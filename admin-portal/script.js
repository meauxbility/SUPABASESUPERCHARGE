/**
 * Spartans Admin Portal - Interactive JavaScript
 * Dark theme with bright highlights and semi-functional to-do guide
 */

class SpartansAdmin {
    constructor() {
        this.tasks = [];
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTasks();
        this.updateTaskCount();
        this.setupNotifications();
        console.log('Spartans Admin Portal initialized');
    }

    bindEvents() {
        // Sidebar navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.navigateToSection(section);
            });
        });

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // Task management
        const addTaskBtn = document.getElementById('addTaskBtn');
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => {
                this.showTaskModal();
            });
        }

        // Task modal events
        const taskModal = document.getElementById('taskModal');
        const cancelTask = document.getElementById('cancelTask');
        const saveTask = document.getElementById('saveTask');

        if (cancelTask) {
            cancelTask.addEventListener('click', () => {
                this.hideTaskModal();
            });
        }

        if (saveTask) {
            saveTask.addEventListener('click', () => {
                this.saveTask();
            });
        }

        // Task filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.currentTarget.dataset.filter;
                this.filterTasks(filter);
                this.updateActiveFilter(e.currentTarget);
            });
        });

        // Quick actions
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.textContent.trim();
                this.handleQuickAction(action);
            });
        });

        // Search functionality
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Notification button
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                this.showNotifications();
            });
        }

        // Close modal on backdrop click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideTaskModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    navigateToSection(section) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });

        const activeMenuItem = document.querySelector(`[data-section="${section}"]`);
        if (activeMenuItem) {
            activeMenuItem.classList.add('active');
        }

        // Update page title and breadcrumb
        this.updatePageTitle(section);

        this.currentSection = section;
    }

    updatePageTitle(section) {
        const titles = {
            dashboard: 'Dashboard',
            tasks: 'Task Management',
            team: 'Team Members',
            projects: 'Active Projects',
            ai: 'AI Assistant',
            analytics: 'Analytics Dashboard',
            settings: 'Settings'
        };

        const pageTitle = document.getElementById('pageTitle');
        const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');

        if (pageTitle) {
            pageTitle.textContent = titles[section] || 'Dashboard';
        }

        if (breadcrumbCurrent) {
            breadcrumbCurrent.textContent = titles[section] || 'Dashboard';
        }
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');

        if (sidebar && mainContent) {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        }
    }

    loadTasks() {
        // Load tasks from localStorage or API
        const savedTasks = localStorage.getItem('spartans-tasks');
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
        } else {
            // Default tasks
            this.tasks = [
                {
                    id: 1,
                    title: 'Set up Claude.ai integration',
                    description: 'Configure Claude.ai API key and test integration',
                    priority: 'high',
                    status: 'completed',
                    assignee: 'sam',
                    dueDate: '2024-10-20',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    title: 'Create Shopify custom build project',
                    description: 'Set up project structure and modal system',
                    priority: 'high',
                    status: 'in-progress',
                    assignee: 'connor',
                    dueDate: '2024-10-25',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    title: 'Design admin portal interface',
                    description: 'Create dark theme with bright highlights',
                    priority: 'medium',
                    status: 'completed',
                    assignee: 'sam',
                    dueDate: '2024-10-18',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 4,
                    title: 'Implement team collaboration features',
                    description: 'Add team member management and communication',
                    priority: 'medium',
                    status: 'pending',
                    assignee: 'fred',
                    dueDate: '2024-10-30',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 5,
                    title: 'Set up API integration layer',
                    description: 'Create independent API for future platform migration',
                    priority: 'high',
                    status: 'in-progress',
                    assignee: 'connor',
                    dueDate: '2024-11-05',
                    createdAt: new Date().toISOString()
                }
            ];
            this.saveTasks();
        }

        this.renderTasks();
    }

    saveTasks() {
        localStorage.setItem('spartans-tasks', JSON.stringify(this.tasks));
    }

    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        if (!tasksList) return;

        tasksList.innerHTML = '';

        this.tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            tasksList.appendChild(taskElement);
        });
    }

    createTaskElement(task) {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-item';
        taskDiv.dataset.taskId = task.id;

        const statusClass = task.status === 'completed' ? 'checked' : '';
        const priorityClass = task.priority;

        taskDiv.innerHTML = `
            <div class="task-checkbox ${statusClass}" onclick="admin.toggleTask(${task.id})">
                ${task.status === 'completed' ? '<i class="fas fa-check"></i>' : ''}
            </div>
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                <div class="task-description">${task.description}</div>
                <div class="task-meta">
                    <span class="task-priority ${priorityClass}">${task.priority}</span>
                    <span><i class="fas fa-user"></i> ${this.getAssigneeName(task.assignee)}</span>
                    <span><i class="fas fa-calendar"></i> ${new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-icon" onclick="admin.editTask(${task.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" onclick="admin.deleteTask(${task.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        return taskDiv;
    }

    getAssigneeName(assignee) {
        const assignees = {
            sam: 'Sam Primeaux',
            connor: 'Connor Mcneely',
            fred: 'Fred Williams'
        };
        return assignees[assignee] || 'Unassigned';
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = task.status === 'completed' ? 'pending' : 'completed';
            this.saveTasks();
            this.renderTasks();
            this.updateTaskCount();
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            this.populateTaskForm(task);
            this.showTaskModal();
        }
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveTasks();
            this.renderTasks();
            this.updateTaskCount();
        }
    }

    showTaskModal() {
        const modal = document.getElementById('taskModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hideTaskModal() {
        const modal = document.getElementById('taskModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            this.clearTaskForm();
        }
    }

    populateTaskForm(task) {
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description;
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskDueDate').value = task.dueDate;
        document.getElementById('taskAssignee').value = task.assignee;
    }

    clearTaskForm() {
        document.getElementById('taskForm').reset();
    }

    saveTask() {
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const priority = document.getElementById('taskPriority').value;
        const dueDate = document.getElementById('taskDueDate').value;
        const assignee = document.getElementById('taskAssignee').value;

        if (!title.trim()) {
            alert('Please enter a task title');
            return;
        }

        const task = {
            id: Date.now(),
            title: title.trim(),
            description: description.trim(),
            priority,
            status: 'pending',
            assignee,
            dueDate,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        this.updateTaskCount();
        this.hideTaskModal();

        this.showNotification('Task created successfully!', 'success');
    }

    filterTasks(filter) {
        const tasksList = document.getElementById('tasksList');
        if (!tasksList) return;

        const taskItems = tasksList.querySelectorAll('.task-item');
        
        taskItems.forEach(item => {
            const taskId = parseInt(item.dataset.taskId);
            const task = this.tasks.find(t => t.id === taskId);
            
            if (filter === 'all' || task.status === filter) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    updateActiveFilter(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    updateTaskCount() {
        const taskCount = document.getElementById('taskCount');
        if (taskCount) {
            const pendingTasks = this.tasks.filter(t => t.status !== 'completed').length;
            taskCount.textContent = pendingTasks;
        }
    }

    handleQuickAction(action) {
        switch (action) {
            case 'Add Task':
                this.showTaskModal();
                break;
            case 'Invite Team':
                this.showNotification('Team invitation feature coming soon!', 'info');
                break;
            case 'AI Assistant':
                this.navigateToSection('ai');
                break;
            case 'View Analytics':
                this.navigateToSection('analytics');
                break;
            default:
                console.log('Quick action:', action);
        }
    }

    handleSearch(query) {
        if (query.length < 2) return;

        // Search through tasks, team members, and projects
        const results = this.tasks.filter(task => 
            task.title.toLowerCase().includes(query.toLowerCase()) ||
            task.description.toLowerCase().includes(query.toLowerCase())
        );

        console.log('Search results:', results);
        this.showNotification(`Found ${results.length} results for "${query}"`, 'info');
    }

    setupNotifications() {
        // Simulate notifications
        this.notifications = [
            {
                id: 1,
                title: 'Claude.ai Integration Active',
                message: 'AI assistant is ready to help with development tasks',
                type: 'success',
                timestamp: new Date().toISOString()
            },
            {
                id: 2,
                title: 'New Task Assigned',
                message: 'You have been assigned a new high-priority task',
                type: 'info',
                timestamp: new Date(Date.now() - 300000).toISOString()
            },
            {
                id: 3,
                title: 'Team Member Online',
                message: 'Connor Mcneely is now online',
                type: 'info',
                timestamp: new Date(Date.now() - 600000).toISOString()
            }
        ];
    }

    showNotifications() {
        // Create notifications dropdown
        const notificationDropdown = document.createElement('div');
        notificationDropdown.className = 'notification-dropdown';
        notificationDropdown.innerHTML = `
            <div class="notification-header">
                <h3>Notifications</h3>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="notification-list">
                ${this.notifications.map(notif => `
                    <div class="notification-item">
                        <div class="notification-icon">
                            <i class="fas fa-${notif.type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                        </div>
                        <div class="notification-content">
                            <div class="notification-title">${notif.title}</div>
                            <div class="notification-message">${notif.message}</div>
                            <div class="notification-time">${this.formatTime(notif.timestamp)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Add styles
        notificationDropdown.style.cssText = `
            position: absolute;
            top: 100%;
            right: 0;
            width: 300px;
            background: var(--bg-card);
            border: 1px solid var(--border-primary);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            margin-top: 10px;
        `;

        // Remove existing dropdown
        const existing = document.querySelector('.notification-dropdown');
        if (existing) existing.remove();

        // Add to DOM
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.parentElement.style.position = 'relative';
            notificationBtn.parentElement.appendChild(notificationDropdown);
        }

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notificationDropdown.parentElement) {
                notificationDropdown.remove();
            }
        }, 5000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-card);
            border: 1px solid var(--border-primary);
            border-left: 4px solid var(--accent-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'primary'});
            border-radius: var(--radius-md);
            padding: var(--spacing-md);
            color: var(--text-primary);
            box-shadow: var(--shadow-lg);
            z-index: 2000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    formatTime(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return time.toLocaleDateString();
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-box input');
            if (searchInput) {
                searchInput.focus();
            }
        }

        // Escape to close modals
        if (e.key === 'Escape') {
            this.hideTaskModal();
        }

        // Number keys for navigation
        if (e.key >= '1' && e.key <= '7') {
            const sections = ['dashboard', 'tasks', 'team', 'projects', 'ai', 'analytics', 'settings'];
            const sectionIndex = parseInt(e.key) - 1;
            if (sections[sectionIndex]) {
                this.navigateToSection(sections[sectionIndex]);
            }
        }
    }

    // Public methods for external access
    addTask(taskData) {
        const task = {
            id: Date.now(),
            ...taskData,
            createdAt: new Date().toISOString()
        };
        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        this.updateTaskCount();
    }

    getTasks() {
        return this.tasks;
    }

    getTaskStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.status === 'completed').length;
        const pending = this.tasks.filter(t => t.status === 'pending').length;
        const inProgress = this.tasks.filter(t => t.status === 'in-progress').length;

        return { total, completed, pending, inProgress };
    }
}

// Initialize the admin portal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.admin = new SpartansAdmin();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .notification-dropdown {
            max-height: 400px;
            overflow-y: auto;
        }
        
        .notification-header {
            padding: var(--spacing-md);
            border-bottom: 1px solid var(--border-primary);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .notification-header h3 {
            font-size: 1rem;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .notification-header button {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 1.2rem;
            cursor: pointer;
            padding: var(--spacing-xs);
            border-radius: var(--radius-sm);
        }
        
        .notification-list {
            max-height: 300px;
            overflow-y: auto;
        }
        
        .notification-item {
            padding: var(--spacing-md);
            border-bottom: 1px solid var(--border-primary);
            display: flex;
            align-items: flex-start;
            gap: var(--spacing-sm);
        }
        
        .notification-item:last-child {
            border-bottom: none;
        }
        
        .notification-icon {
            color: var(--accent-primary);
            font-size: 1.2rem;
            margin-top: 2px;
        }
        
        .notification-content {
            flex: 1;
        }
        
        .notification-title {
            font-weight: 500;
            color: var(--text-primary);
            margin-bottom: var(--spacing-xs);
        }
        
        .notification-message {
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin-bottom: var(--spacing-xs);
        }
        
        .notification-time {
            font-size: 0.75rem;
            color: var(--text-muted);
        }
    `;
    document.head.appendChild(style);
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpartansAdmin;
}
