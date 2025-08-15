import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useProjects, useSettings } from '../../hooks/useApi';
import AdminLayout from './AdminLayout';

const Dashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { projects, loading: projectsLoading } = useProjects();
  const { settings, loading: settingsLoading } = useSettings();
  const navigate = useNavigate();
  const [recentActivity] = useState([
    { id: 1, action: 'Created new project', item: 'E-commerce Website', time: '2 hours ago', type: 'project' },
    { id: 2, action: 'Updated skill', item: 'React.js', time: '5 hours ago', type: 'skill' },
    { id: 3, action: 'Modified settings', item: 'Site Configuration', time: '1 day ago', type: 'settings' },
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project': return 'fas fa-project-diagram';
      case 'skill': return 'fas fa-code';
      case 'settings': return 'fas fa-cog';
      default: return 'fas fa-circle';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'project': return 'primary';
      case 'skill': return 'success';
      case 'settings': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <AdminLayout title="Dashboard Overview">
      <div className="dashboard-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-text">
            <h2>Welcome back, {user?.email?.split('@')[0] || 'Admin'}</h2>
            <p>Here's what's happening with your portfolio today.</p>
          </div>
          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-number">{projects.length}</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">12</span>
              <span className="stat-label">Skills</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">Active</span>
              <span className="stat-label">Status</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-card-content">
              <div className="stat-card-header">
                <h3>Total Projects</h3>
                <div className="stat-icon">
                  <i className="fas fa-project-diagram"></i>
                </div>
              </div>
              <div className="stat-value">
                {projectsLoading ? (
                  <div className="spinner"></div>
                ) : (
                  <span>{projects.length}</span>
                )}
              </div>
              <div className="stat-change positive">
                <i className="fas fa-arrow-up"></i>
                <span>+2 this month</span>
              </div>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-card-content">
              <div className="stat-card-header">
                <h3>Skills Added</h3>
                <div className="stat-icon">
                  <i className="fas fa-code"></i>
                </div>
              </div>
              <div className="stat-value">
                <span>12</span>
              </div>
              <div className="stat-change positive">
                <i className="fas fa-arrow-up"></i>
                <span>+3 this week</span>
              </div>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-card-content">
              <div className="stat-card-header">
                <h3>Portfolio Views</h3>
                <div className="stat-icon">
                  <i className="fas fa-eye"></i>
                </div>
              </div>
              <div className="stat-value">
                <span>1,247</span>
              </div>
              <div className="stat-change positive">
                <i className="fas fa-arrow-up"></i>
                <span>+15% this month</span>
              </div>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-card-content">
              <div className="stat-card-header">
                <h3>Last Updated</h3>
                <div className="stat-icon">
                  <i className="fas fa-clock"></i>
                </div>
              </div>
              <div className="stat-value">
                <span>2 days ago</span>
              </div>
              <div className="stat-change neutral">
                <i className="fas fa-calendar"></i>
                <span>Keep it fresh!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* Quick Actions */}
          <div className="content-card">
            <div className="card-header">
              <h3>Quick Actions</h3>
              <p>Manage your portfolio content</p>
            </div>
            <div className="quick-actions-grid">
              <button 
                className="action-card primary"
                onClick={() => navigate('/admin/projects')}
              >
                <div className="action-icon">
                  <i className="fas fa-plus"></i>
                </div>
                <div className="action-content">
                  <h4>Add Project</h4>
                  <p>Showcase your latest work</p>
                </div>
              </button>

              <button 
                className="action-card success"
                onClick={() => navigate('/admin/skills')}
              >
                <div className="action-icon">
                  <i className="fas fa-code"></i>
                </div>
                <div className="action-content">
                  <h4>Manage Skills</h4>
                  <p>Update your expertise</p>
                </div>
              </button>

              <button 
                className="action-card warning"
                onClick={() => navigate('/admin/settings')}
              >
                <div className="action-icon">
                  <i className="fas fa-cog"></i>
                </div>
                <div className="action-content">
                  <h4>Site Settings</h4>
                  <p>Customize your portfolio</p>
                </div>
              </button>

              <button 
                className="action-card info"
                onClick={() => window.open('/', '_blank')}
              >
                <div className="action-icon">
                  <i className="fas fa-external-link-alt"></i>
                </div>
                <div className="action-content">
                  <h4>View Portfolio</h4>
                  <p>See your live site</p>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="content-card">
            <div className="card-header">
              <h3>Recent Projects</h3>
              <button 
                className="btn-link"
                onClick={() => navigate('/admin/projects')}
              >
                View All <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            <div className="projects-list">
              {projectsLoading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading projects...</p>
                </div>
              ) : projects.length > 0 ? (
                projects.slice(0, 3).map((project) => (
                  <div key={project.id} className="project-item">
                    <div className="project-image">
                      <img src={project.mainImage || "/placeholder.svg?height=60&width=60"} alt={project.title} />
                    </div>
                    <div className="project-info">
                      <h4>{project.title}</h4>
                      <p>{project.description.substring(0, 80)}...</p>
                      <div className="project-meta">
                        <span className="project-category">{project.category}</span>
                        <span className="project-date">{project.completedDate}</span>
                      </div>
                    </div>
                    <div className="project-actions">
                      <button className="btn-icon">
                        <i className="fas fa-edit"></i>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <i className="fas fa-folder-open"></i>
                  <h4>No Projects Yet</h4>
                  <p>Create your first project to get started!</p>
                  <button 
                    className="custom-primary-btn"
                    onClick={() => navigate('/admin/projects')}
                  >
                    Add Project
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="content-card">
            <div className="card-header">
              <h3>Recent Activity</h3>
              <p>Your latest portfolio updates</p>
            </div>
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon ${getActivityColor(activity.type)}`}>
                    <i className={getActivityIcon(activity.type)}></i>
                  </div>
                  <div className="activity-content">
                    <p>
                      <strong>{activity.action}</strong> "{activity.item}"
                    </p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
