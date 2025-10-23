import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SUPABASE_URL = window.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY;
const EDGE_ASSET_SIGNER = window.EDGE_ASSET_SIGNER || '/asset_signer';
const EDGE_AGENT_GATEWAY = window.EDGE_AGENT_GATEWAY || '/agent_gateway';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const qs = (sel) => document.querySelector(sel);
const app = document.getElementById('app');

function render(html) { 
  app.innerHTML = html; 
}

function card(title, content) {
  return `<div class="card"><h3>${title}</h3>${content}</div>`;
}

async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session || null;
}

async function signInView() {
  render(`
    <div style="max-width: 600px; margin: 0 auto;">
      <h1>🚀 Meauxbility Admin Dashboard</h1>
      <p>Sign in to access your organization's projects, tasks, and assets.</p>
      
      ${card('Sign In', `
        <div class="row">
          <input id="email" placeholder="Enter your email address" type="email" style="flex: 1;" />
          <button id="send">Send Magic Link</button>
        </div>
        <div><small>After signing in, this page will refresh automatically.</small></div>
        <pre id="out"></pre>
      `)}
      
      <div style="margin-top: 24px; padding: 16px; background: #f0f9ff; border-radius: 8px;">
        <h4>🔧 Features Available:</h4>
        <ul>
          <li>Organization switching</li>
          <li>Project management</li>
          <li>Task tracking</li>
          <li>Asset uploads</li>
          <li>Team collaboration</li>
        </ul>
      </div>
    </div>
  `);
  
  qs('#send').onclick = async () => {
    const email = qs('#email').value;
    if (!email) {
      qs('#out').textContent = 'Please enter an email address.';
      return;
    }
    
    const { error } = await supabase.auth.signInWithOtp({ email });
    qs('#out').textContent = error ? error.message : '✅ Check your email for the login link.';
  };
}

async function fetchMemberships(jwt) {
  // Using RLS with anon key: fetch orgs user can see via org_members join
  const { data, error } = await supabase
    .from('org_members')
    .select('organization_id, organizations!inner(id, name)')
    .order('organization_id', { ascending: true });
  
  if (error) throw error;
  
  const orgs = (data || []).map(r => ({ 
    id: r.organizations.id, 
    name: r.organizations.name 
  }));
  
  return orgs;
}

async function fetchProjects(jwt, organization_id) {
  // Use Edge Function to ensure org scoping
  const res = await fetch(EDGE_AGENT_GATEWAY + '/projects?organization_id=' + encodeURIComponent(organization_id), {
    headers: { Authorization: `Bearer ${jwt}` }
  });
  
  if (!res.ok) throw new Error(await res.text());
  
  const json = await res.json();
  return json.projects || [];
}

async function createProject(jwt, organization_id, name) {
  // Minimal insert via REST direct if you prefer:
  // But we'll route via Edge later; for now use client (RLS enforces)
  const { data, error } = await supabase
    .from('projects')
    .insert([{ organization_id, name }])
    .select('*')
    .single();
  
  if (error) throw error;
  return data;
}

async function fetchTasks(jwt, organization_id) {
  const res = await fetch(EDGE_AGENT_GATEWAY + '/tasks?organization_id=' + encodeURIComponent(organization_id), {
    headers: { Authorization: `Bearer ${jwt}` }
  });
  
  if (!res.ok) throw new Error(await res.text());
  
  const json = await res.json();
  return json.tasks || [];
}

async function createTask(jwt, body) {
  const res = await fetch(EDGE_AGENT_GATEWAY + '/tasks', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${jwt}` 
    },
    body: JSON.stringify(body),
  });
  
  if (!res.ok) throw new Error(await res.text());
  
  const json = await res.json();
  return json.task;
}

async function signUploadUrl(jwt, organization_id, path, expires_in = 900) {
  const res = await fetch(EDGE_ASSET_SIGNER + '/sign', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${jwt}` 
    },
    body: JSON.stringify({ organization_id, path, expires_in }),
  });
  
  if (!res.ok) throw new Error(await res.text());
  
  return res.json();
}

function viewLayout(user, orgs, selectedOrg, state = {}) {
  const orgOptions = orgs.map(o => 
    `<option value="${o.id}" ${selectedOrg === o.id ? 'selected' : ''}>${o.name}</option>`
  ).join('');
  
  const projects = state.projects || [];
  const tasks = state.tasks || [];
  
  render(`
    <div style="max-width: 1200px; margin: 0 auto;">
      <div class="row" style="background: white; padding: 16px; border-radius: 8px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="flex:1">
          <strong>👤 User:</strong> ${user.email}
        </div>
        <div class="row">
          <label>🏢 Organization:</label>
          <select id="org" style="min-width: 200px;">
            ${orgOptions}
          </select>
          <button id="signOut">Sign Out</button>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        ${card('📁 Projects', `
          <div class="row">
            <input id="projectName" placeholder="New project name" style="flex: 1;" />
            <button id="createProject">Create</button>
          </div>
          <div id="projects">
            ${projects.map(p => 
              `<div style="padding: 8px; background: #f8f9fa; border-radius: 4px; margin: 4px 0;">
                <strong>${p.name}</strong> 
                <small style="color: #666;">(${p.status})</small>
                <div style="font-size: 12px; color: #888;">ID: ${p.id}</div>
              </div>`
            ).join('') || '<em>No projects found</em>'}
          </div>
        `)}
        
        ${card('✅ Tasks', `
          <div class="row">
            <input id="taskTitle" placeholder="Task title" style="flex: 1;" />
            <button id="createTask">Create</button>
          </div>
          <div class="row" style="margin-top: 8px;">
            <input id="taskDesc" placeholder="Description (optional)" style="flex: 1;" />
            <input id="taskProject" placeholder="Project ID" style="flex: 1;" />
          </div>
          <div id="tasks">
            ${tasks.map(t => 
              `<div style="padding: 8px; background: #f8f9fa; border-radius: 4px; margin: 4px 0;">
                <strong>${t.title}</strong> 
                <small style="color: #666;">(${t.status})</small>
                <div style="font-size: 12px; color: #888;">Project: ${t.project_id}</div>
              </div>`
            ).join('') || '<em>No tasks found</em>'}
          </div>
        `)}
      </div>
      
      ${card('📤 Asset Upload (team-assets)', `
        <div class="row">
          <input id="assetPath" placeholder="path/filename.ext" style="flex: 1;" />
          <input type="file" id="assetFile" style="flex: 1;" />
          <button id="uploadAsset">Upload</button>
        </div>
        <div style="margin-top: 8px;">
          <small>Upload files to your organization's asset storage.</small>
        </div>
        <pre id="uploadOut" style="margin-top: 12px;"></pre>
      `)}
      
      <div class="card" style="margin-top: 16px;">
        <h4>🔍 Debug Log</h4>
        <pre id="log" style="max-height: 200px; overflow-y: auto;"></pre>
      </div>
    </div>
  `);
  
  // Event handlers
  qs('#signOut').onclick = async () => {
    await supabase.auth.signOut();
    location.reload();
  };
  
  qs('#org').onchange = () => {
    const newOrg = qs('#org').value;
    localStorage.setItem('selectedOrg', newOrg);
    bootstrap();
  };
  
  qs('#createProject').onclick = async () => {
    const name = qs('#projectName').value;
    if (!name) return;
    
    try {
      const { data: sess } = await supabase.auth.getSession();
      await createProject(sess.session.access_token, selectedOrg, name);
      qs('#projectName').value = '';
      log(`✅ Created project: ${name}`);
      bootstrap(); // refresh
    } catch (e) {
      log(`❌ Error creating project: ${e.message || String(e)}`);
    }
  };
  
  qs('#createTask').onclick = async () => {
    const title = qs('#taskTitle').value;
    const description = qs('#taskDesc').value || null;
    const project_id = qs('#taskProject').value;
    
    if (!title || !project_id) {
      log('❌ Please provide both title and project ID');
      return;
    }
    
    try {
      const { data: sess } = await supabase.auth.getSession();
      await createTask(sess.session.access_token, { 
        organization_id: selectedOrg, 
        project_id, 
        title, 
        description 
      });
      qs('#taskTitle').value = '';
      qs('#taskDesc').value = '';
      qs('#taskProject').value = '';
      log(`✅ Created task: ${title}`);
      bootstrap();
    } catch (e) {
      log(`❌ Error creating task: ${e.message || String(e)}`);
    }
  };
  
  qs('#uploadAsset').onclick = async () => {
    const file = qs('#assetFile').files[0];
    const path = qs('#assetPath').value;
    
    if (!file || !path) {
      log('❌ Please select a file and provide a path');
      return;
    }
    
    try {
      const { data: sess } = await supabase.auth.getSession();
      const { url } = await signUploadUrl(sess.session.access_token, selectedOrg, path);
      
      const put = await fetch(url, { 
        method: 'PUT', 
        body: file, 
        headers: { 
          'Content-Type': file.type || 'application/octet-stream' 
        } 
      });
      
      const ok = put.ok;
      const message = ok ? `✅ Upload successful: ${path}` : `❌ Upload failed: ${put.status}`;
      qs('#uploadOut').textContent = message;
      log(message);
    } catch (e) {
      const error = `❌ Upload error: ${e.message || String(e)}`;
      qs('#uploadOut').textContent = error;
      log(error);
    }
  };
  
  function log(msg) { 
    const timestamp = new Date().toLocaleTimeString();
    qs('#log').textContent = (qs('#log').textContent + `\n[${timestamp}] ${msg}`).trim(); 
  }
}

async function appView() {
  const session = await getSession();
  const user = session.user;
  
  let orgs = [];
  try { 
    orgs = await fetchMemberships(session.access_token); 
  } catch (e) {
    log(`❌ Error fetching organizations: ${e.message}`);
  }
  
  if (!orgs.length) {
    render(`
      <div style="max-width: 600px; margin: 0 auto; text-align: center;">
        <h2>🏢 No Organizations Found</h2>
        <p>You don't have access to any organizations yet.</p>
        <p>Contact your administrator to be added to an organization.</p>
        <button id="signOut" style="margin-top: 16px;">Sign Out</button>
      </div>
    `);
    qs('#signOut').onclick = async () => { 
      await supabase.auth.signOut(); 
      location.reload(); 
    };
    return;
  }
  
  const saved = localStorage.getItem('selectedOrg');
  const selectedOrg = (orgs.find(o => o.id === saved) ? saved : orgs[0].id);
  
  // Load data
  let projects = [], tasks = [];
  try {
    projects = await fetchProjects(session.access_token, selectedOrg);
    tasks = await fetchTasks(session.access_token, selectedOrg);
    log(`✅ Loaded ${projects.length} projects and ${tasks.length} tasks`);
  } catch (e) {
    log(`⚠️ Error loading data: ${e.message}`);
  }
  
  viewLayout(user, orgs, selectedOrg, { projects, tasks });
}

async function bootstrap() {
  const session = await getSession();
  if (!session) return signInView();
  return appView();
}

// Initialize
bootstrap();

// Handle email link callback
supabase.auth.onAuthStateChange((_event, _sess) => {
  // For GH Pages, a full reload is simplest
  bootstrap();
});
