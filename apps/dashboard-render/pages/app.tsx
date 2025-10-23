'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const EDGE_AGENT_GATEWAY = '/agent_gateway';
const EDGE_ASSET_SIGNER = '/asset_signer';

type Org = { id: string; name: string };
type Project = { id: string; name: string; status: string; organization_id: string; created_at: string };
type Task = { id: string; title: string; status: string; project_id: string; organization_id: string; created_at: string };

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user || null);
      if (!data.session) setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setSession(sess);
      setUser(sess?.user || null);
      if (!sess) setLoading(false);
    });

    return () => { sub.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!session) return;
    
    (async () => {
      try {
        // fetch org memberships
        const { data, error } = await supabase
          .from('org_members')
          .select('organization_id, organizations!inner(id, name)')
          .order('organization_id', { ascending: true });
        
        if (error) throw error;
        
        const list = (data || []).map((r: any) => ({ 
          id: r.organizations.id, 
          name: r.organizations.name 
        }));
        
        setOrgs(list);
        
        if (list.length > 0) {
          const saved = localStorage.getItem('selectedOrg');
          const orgId = saved && list.find(o => o.id === saved) ? saved : list[0].id;
          setSelectedOrg(orgId);
          localStorage.setItem('selectedOrg', orgId);
        }
      } catch (e: any) {
        setMessage(`Error loading organizations: ${e.message}`);
      }
    })();
  }, [session]);

  useEffect(() => {
    if (!session || !selectedOrg) return;
    
    (async () => {
      try {
        // Load projects and tasks
        const [projectsRes, tasksRes] = await Promise.all([
          fetch(`${EDGE_AGENT_GATEWAY}/projects?organization_id=${encodeURIComponent(selectedOrg)}`, {
            headers: { Authorization: `Bearer ${session.access_token}` }
          }),
          fetch(`${EDGE_AGENT_GATEWAY}/tasks?organization_id=${encodeURIComponent(selectedOrg)}`, {
            headers: { Authorization: `Bearer ${session.access_token}` }
          })
        ]);
        
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setProjects(projectsData.projects || []);
        }
        
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData.tasks || []);
        }
      } catch (e: any) {
        setMessage(`Error loading data: ${e.message}`);
      }
    })();
  }, [session, selectedOrg]);

  const createProject = async (name: string) => {
    if (!session || !selectedOrg) return;
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ organization_id: selectedOrg, name }])
        .select('*')
        .single();
      
      if (error) throw error;
      setProjects(prev => [...prev, data]);
      setMessage(`✅ Created project: ${name}`);
    } catch (e: any) {
      setMessage(`❌ Error creating project: ${e.message}`);
    }
  };

  const createTask = async (title: string, description: string, project_id: string) => {
    if (!session || !selectedOrg) return;
    
    try {
      const res = await fetch(`${EDGE_AGENT_GATEWAY}/tasks`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${session.access_token}` 
        },
        body: JSON.stringify({ 
          organization_id: selectedOrg, 
          project_id, 
          title, 
          description 
        }),
      });
      
      if (!res.ok) throw new Error(await res.text());
      
      const { task } = await res.json();
      setTasks(prev => [...prev, task]);
      setMessage(`✅ Created task: ${title}`);
    } catch (e: any) {
      setMessage(`❌ Error creating task: ${e.message}`);
    }
  };

  const uploadAsset = async (file: File, path: string) => {
    if (!session || !selectedOrg) return;
    
    try {
      // Get signed URL
      const signRes = await fetch(`${EDGE_ASSET_SIGNER}/sign`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${session.access_token}` 
        },
        body: JSON.stringify({ organization_id: selectedOrg, path, expires_in: 900 }),
      });
      
      if (!signRes.ok) throw new Error(await signRes.text());
      
      const { url } = await signRes.json();
      
      // Upload file
      const uploadRes = await fetch(url, { 
        method: 'PUT', 
        body: file, 
        headers: { 'Content-Type': file.type || 'application/octet-stream' } 
      });
      
      if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.status}`);
      
      setMessage(`✅ Upload successful: ${path}`);
    } catch (e: any) {
      setMessage(`❌ Upload error: ${e.message}`);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!session) {
    return <SignInView />;
  }

  if (!orgs.length) {
    return (
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '24px',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <h2>🏢 No Organizations Found</h2>
        <p>You don't have access to any organizations yet.</p>
        <p>Contact your administrator to be added to an organization.</p>
        <button 
          onClick={() => supabase.auth.signOut()}
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '24px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '16px', 
        borderRadius: '8px', 
        marginBottom: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <strong>👤 User:</strong> {user?.email}
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label>🏢 Organization:</label>
          <select 
            value={selectedOrg} 
            onChange={(e) => {
              setSelectedOrg(e.target.value);
              localStorage.setItem('selectedOrg', e.target.value);
            }}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            {orgs.map(org => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
          <button 
            onClick={() => supabase.auth.signOut()}
            style={{
              padding: '8px 16px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {message && (
        <div style={{
          padding: '12px',
          background: message.includes('✅') ? '#f0fdf4' : '#fef2f2',
          color: message.includes('✅') ? '#059669' : '#dc2626',
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <ProjectCard 
          projects={projects} 
          onCreateProject={createProject}
        />
        <TaskCard 
          tasks={tasks} 
          projects={projects}
          onCreateTask={createTask}
        />
      </div>

      <AssetUploadCard onUpload={uploadAsset} />
    </div>
  );
}

function SignInView() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSignIn = async () => {
    if (!email) {
      setMessage('Please enter an email address.');
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({ email });
    setMessage(error ? error.message : '✅ Check your email for the login link.');
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '24px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1>🚀 Meauxbility Admin Dashboard</h1>
      <p>Sign in to access your organization's projects, tasks, and assets.</p>
      
      <div style={{ 
        background: 'white', 
        padding: '16px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3>Sign In</h3>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            style={{ 
              flex: 1, 
              padding: '8px 12px', 
              border: '1px solid #ddd', 
              borderRadius: '4px' 
            }}
          />
          <button 
            onClick={handleSignIn}
            style={{
              padding: '8px 16px',
              background: '#6366F1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Send Magic Link
          </button>
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          After signing in, this page will refresh automatically.
        </div>
        {message && (
          <div style={{
            marginTop: '12px',
            padding: '8px',
            background: message.includes('✅') ? '#f0fdf4' : '#fef2f2',
            color: message.includes('✅') ? '#059669' : '#dc2626',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ projects, onCreateProject }: { 
  projects: Project[], 
  onCreateProject: (name: string) => void 
}) {
  const [name, setName] = useState('');

  return (
    <div style={{ 
      background: 'white', 
      padding: '16px', 
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3>📁 Projects</h3>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <input 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New project name"
          style={{ 
            flex: 1, 
            padding: '8px 12px', 
            border: '1px solid #ddd', 
            borderRadius: '4px' 
          }}
        />
        <button 
          onClick={() => {
            if (name) {
              onCreateProject(name);
              setName('');
            }
          }}
          style={{
            padding: '8px 16px',
            background: '#6366F1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create
        </button>
      </div>
      <div>
        {projects.map(p => (
          <div key={p.id} style={{ 
            padding: '8px', 
            background: '#f8f9fa', 
            borderRadius: '4px', 
            margin: '4px 0' 
          }}>
            <strong>{p.name}</strong> 
            <small style={{ color: '#666', marginLeft: '8px' }}>({p.status})</small>
            <div style={{ fontSize: '12px', color: '#888' }}>ID: {p.id}</div>
          </div>
        ))}
        {projects.length === 0 && <em>No projects found</em>}
      </div>
    </div>
  );
}

function TaskCard({ tasks, projects, onCreateTask }: { 
  tasks: Task[], 
  projects: Project[],
  onCreateTask: (title: string, description: string, project_id: string) => void 
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');

  return (
    <div style={{ 
      background: 'white', 
      padding: '16px', 
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3>✅ Tasks</h3>
      <div style={{ marginBottom: '12px' }}>
        <input 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          style={{ 
            width: '100%', 
            padding: '8px 12px', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            marginBottom: '8px'
          }}
        />
        <input 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          style={{ 
            width: '100%', 
            padding: '8px 12px', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            marginBottom: '8px'
          }}
        />
        <select 
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '8px 12px', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            marginBottom: '8px'
          }}
        >
          <option value="">Select Project</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <button 
          onClick={() => {
            if (title && projectId) {
              onCreateTask(title, description, projectId);
              setTitle('');
              setDescription('');
              setProjectId('');
            }
          }}
          style={{
            width: '100%',
            padding: '8px 16px',
            background: '#6366F1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create Task
        </button>
      </div>
      <div>
        {tasks.map(t => (
          <div key={t.id} style={{ 
            padding: '8px', 
            background: '#f8f9fa', 
            borderRadius: '4px', 
            margin: '4px 0' 
          }}>
            <strong>{t.title}</strong> 
            <small style={{ color: '#666', marginLeft: '8px' }}>({t.status})</small>
            <div style={{ fontSize: '12px', color: '#888' }}>Project: {t.project_id}</div>
          </div>
        ))}
        {tasks.length === 0 && <em>No tasks found</em>}
      </div>
    </div>
  );
}

function AssetUploadCard({ onUpload }: { 
  onUpload: (file: File, path: string) => void 
}) {
  const [path, setPath] = useState('');
  const [file, setFile] = useState<File | null>(null);

  return (
    <div style={{ 
      background: 'white', 
      padding: '16px', 
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginTop: '16px'
    }}>
      <h3>📤 Asset Upload (team-assets)</h3>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
        <input 
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="path/filename.ext"
          style={{ 
            flex: 1, 
            padding: '8px 12px', 
            border: '1px solid #ddd', 
            borderRadius: '4px' 
          }}
        />
        <input 
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={{ 
            flex: 1, 
            padding: '8px 12px', 
            border: '1px solid #ddd', 
            borderRadius: '4px' 
          }}
        />
        <button 
          onClick={() => {
            if (file && path) {
              onUpload(file, path);
            }
          }}
          style={{
            padding: '8px 16px',
            background: '#6366F1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Upload
        </button>
      </div>
      <div style={{ fontSize: '14px', color: '#666' }}>
        Upload files to your organization's asset storage.
      </div>
    </div>
  );
}
