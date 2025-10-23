import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';

interface DashboardData {
  totalMembers: number;
  activeTasks: number;
  totalDonations: number;
  activeCampaigns: number;
}

interface TeamMember {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
}

export default function AdminPortal() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalMembers: 0,
    activeTasks: 0,
    totalDonations: 0,
    activeCampaigns: 0
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [sessionStart] = useState(new Date());
  const [sessionTimer, setSessionTimer] = useState('00:00:00');

  useEffect(() => {
    console.log('🚀 Meauxbility Admin Portal - Supabase Edition Loading...');
    initializeSessionTimer();
    initializeCountdown();
    setCurrentDate();
    loadDashboardData();
    testAPIConnections();
    loadUserProfile();
    console.log('✅ Meauxbility Admin Portal - Fully Loaded!');
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((new Date().getTime() - sessionStart.getTime()) / 1000);
      const h = Math.floor(elapsed / 3600);
      const m = Math.floor((elapsed % 3600) / 60);
      const s = elapsed % 60;
      setSessionTimer(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStart]);

  const initializeSessionTimer = () => {
    // Session timer is handled in useEffect above
  };

  const initializeCountdown = () => {
    const launchDate = new Date('2025-11-03T00:00:00');
    const updateCountdown = () => {
      const diff = launchDate.getTime() - new Date().getTime();
      if (diff <= 0) return;
      // Countdown logic would go here
    };
    setInterval(updateCountdown, 1000);
    updateCountdown();
  };

  const setCurrentDate = () => {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
      dateElement.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const loadDashboardData = async () => {
    try {
      console.log('📊 Loading dashboard data...');
      
      // Load members
      const { data: members, error: membersError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' });
      
      if (!membersError) {
        setDashboardData(prev => ({
          ...prev,
          totalMembers: members?.length || 0
        }));
      }

      // Load tasks
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('id', { count: 'exact' })
        .eq('status', 'todo');
      
      if (!tasksError) {
        setDashboardData(prev => ({
          ...prev,
          activeTasks: tasks?.length || 0
        }));
      }

      // Load donations
      const { data: donations, error: donationsError } = await supabase
        .from('donations')
        .select('amount_cents');
      
      if (!donationsError && donations) {
        const totalCents = donations.reduce((sum, donation) => sum + (donation.amount_cents || 0), 0);
        const totalDollars = (totalCents / 100).toLocaleString();
        setDashboardData(prev => ({
          ...prev,
          totalDonations: totalDollars
        }));
      }

      // Load campaigns
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('id', { count: 'exact' })
        .eq('is_active', true);
      
      if (!campaignsError) {
        setDashboardData(prev => ({
          ...prev,
          activeCampaigns: campaigns?.length || 0
        }));
      }

      console.log('✅ Dashboard data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
    }
  };

  const testAPIConnections = async () => {
    console.log('🔗 Testing API connections...');
    await testSupabaseConnection();
    await testClaudeConnection();
    await testChatGPTConnection();
  };

  const testSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      if (error) throw error;
      
      const statusElement = document.getElementById('supabase-status');
      const statusTextElement = document.getElementById('supabase-status-text');
      const infoElement = document.getElementById('supabase-info');
      
      if (statusElement) statusElement.style.background = 'var(--success)';
      if (statusTextElement) statusTextElement.textContent = 'Connected';
      if (infoElement) infoElement.textContent = 'Database accessible';
      
      console.log('✅ Supabase connection successful');
    } catch (error) {
      const statusElement = document.getElementById('supabase-status');
      const statusTextElement = document.getElementById('supabase-status-text');
      const infoElement = document.getElementById('supabase-info');
      
      if (statusElement) statusElement.style.background = 'var(--error)';
      if (statusTextElement) statusTextElement.textContent = 'Error';
      if (infoElement) infoElement.textContent = 'Connection failed';
      
      console.error('❌ Supabase connection failed:', error);
    }
  };

  const testClaudeConnection = () => {
    const statusElement = document.getElementById('claude-status');
    const statusTextElement = document.getElementById('claude-status-text');
    const infoElement = document.getElementById('claude-info');
    
    if (statusElement) statusElement.style.background = 'var(--warning)';
    if (statusTextElement) statusTextElement.textContent = 'Not Configured';
    if (infoElement) infoElement.textContent = 'API key needed';
    
    console.log('⚠️ Claude connection not configured');
  };

  const testChatGPTConnection = () => {
    const statusElement = document.getElementById('chatgpt-status');
    const statusTextElement = document.getElementById('chatgpt-status-text');
    const infoElement = document.getElementById('chatgpt-info');
    
    if (statusElement) statusElement.style.background = 'var(--warning)';
    if (statusTextElement) statusTextElement.textContent = 'Not Configured';
    if (infoElement) infoElement.textContent = 'API key needed';
    
    console.log('⚠️ ChatGPT connection not configured');
  };

  const loadUserProfile = () => {
    setCurrentUser({
      name: 'Sam Primeaux',
      role: 'President'
    });
    console.log('✅ User profile loaded');
  };

  const loadTeamMembers = async () => {
    try {
      const { data: members, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, created_at')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTeamMembers(members || []);
      console.log('✅ Team members loaded');
    } catch (error) {
      console.error('❌ Error loading team members:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('id, title, description, status, priority, created_at')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setTasks(tasks || []);
      console.log('✅ Tasks loaded');
    } catch (error) {
      console.error('❌ Error loading tasks:', error);
    }
  };

  const navigateTo = (page: string) => {
    // Navigation logic would go here
    console.log('Navigating to:', page);
  };

  return (
    <Layout title="Meauxbility Admin Portal" description="Real-time dashboard for Meauxbility operations">
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #333;
          line-height: 1.6;
          min-height: 100vh;
        }

        :root {
          --primary: #667eea;
          --secondary: #764ba2;
          --success: #10b981;
          --warning: #f59e0b;
          --error: #ef4444;
          --surface: #ffffff;
          --surface-alt: #f8fafc;
          --text-primary: #1f2937;
          --text-secondary: #6b7280;
          --border: #e5e7eb;
        }

        .admin-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        .admin-header {
          background: var(--surface);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .admin-title {
          font-size: 2.5rem;
          font-weight: 900;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .admin-subtitle {
          color: var(--text-secondary);
          font-size: 1.125rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: var(--surface);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 900;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: var(--text-secondary);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.875rem;
        }

        .stat-change {
          color: var(--success);
          font-size: 0.875rem;
          font-weight: 600;
          margin-top: 0.5rem;
        }

        .nav-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          background: var(--surface);
          border-radius: 12px;
          padding: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .nav-tab {
          padding: 0.75rem 1.5rem;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-tab.active {
          background: var(--primary);
          color: white;
        }

        .nav-tab:hover:not(.active) {
          background: var(--surface-alt);
          color: var(--text-primary);
        }

        .content-section {
          background: var(--surface);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .api-status {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: var(--surface-alt);
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--warning);
        }

        .status-indicator.connected {
          background: var(--success);
        }

        .status-indicator.error {
          background: var(--error);
        }

        .status-text {
          font-weight: 600;
          color: var(--text-primary);
        }

        .status-info {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .session-info {
          display: flex;
          gap: 2rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }

        .session-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .session-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .session-value {
          font-weight: 800;
          color: var(--text-primary);
        }

        .empty-state {
          text-align: center;
          color: var(--text-secondary);
          padding: 2rem;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .admin-container {
            padding: 1rem;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .nav-tabs {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">Meauxbility Admin Portal</h1>
          <p className="admin-subtitle">Supabase Edition - Real-time Dashboard</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number" id="totalMembers">{dashboardData.totalMembers}</div>
            <div className="stat-label">Total Members</div>
            <div className="stat-change" id="membersChange">↑ Loading...</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" id="activeTasks">{dashboardData.activeTasks}</div>
            <div className="stat-label">Active Tasks</div>
            <div className="stat-change" id="tasksChange">↑ Loading...</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" id="totalDonations">${dashboardData.totalDonations}</div>
            <div className="stat-label">Total Donations</div>
            <div className="stat-change" id="donationsChange">↑ Loading...</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" id="activeCampaigns">{dashboardData.activeCampaigns}</div>
            <div className="stat-label">Active Campaigns</div>
            <div className="stat-change" id="campaignsChange">↑ Loading...</div>
          </div>
        </div>

        <div className="nav-tabs">
          <button className="nav-tab active" onClick={() => navigateTo('dashboard')}>Dashboard</button>
          <button className="nav-tab" onClick={() => navigateTo('team')}>Team</button>
          <button className="nav-tab" onClick={() => navigateTo('tasks')}>Tasks</button>
          <button className="nav-tab" onClick={() => navigateTo('time-tracking')}>Time Tracking</button>
        </div>

        <div className="content-section">
          <h2 className="section-title">API Connection Status</h2>
          
          <div className="api-status">
            <div className="status-indicator" id="supabase-status"></div>
            <div>
              <div className="status-text" id="supabase-status-text">Checking...</div>
              <div className="status-info" id="supabase-info">Supabase Database</div>
            </div>
          </div>

          <div className="api-status">
            <div className="status-indicator" id="claude-status"></div>
            <div>
              <div className="status-text" id="claude-status-text">Checking...</div>
              <div className="status-info" id="claude-info">Claude AI Integration</div>
            </div>
          </div>

          <div className="api-status">
            <div className="status-indicator" id="chatgpt-status"></div>
            <div>
              <div className="status-text" id="chatgpt-status-text">Checking...</div>
              <div className="status-info" id="chatgpt-info">ChatGPT Integration</div>
            </div>
          </div>

          <div className="session-info">
            <div className="session-item">
              <div className="session-label">Session Started</div>
              <div className="session-value" id="session-start">{sessionStart.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            <div className="session-item">
              <div className="session-label">Session Duration</div>
              <div className="session-value" id="session-timer">{sessionTimer}</div>
            </div>
            <div className="session-item">
              <div className="session-label">Current Date</div>
              <div className="session-value" id="current-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
