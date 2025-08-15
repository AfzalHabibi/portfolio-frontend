import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useProjects, useSettings } from '../../hooks/useApi';

const Dashboard: React.FC = () => {
  const { isAuthenticated, user, logoutUser } = useAuth();
  const { projects, loading: projectsLoading } = useProjects();
  const { settings, loading: settingsLoading } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate('/admin/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand">Admin Dashboard</span>
          <div className="navbar-nav ms-auto">
            <div className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {user?.email}
              </a>
              <ul className="dropdown-menu">
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid p-4">
        {/* Welcome Section */}
        <div className="row mb-4">
          <div className="col">
            <h1 className="h3">Welcome back, {user?.email}!</h1>
            <p className="text-muted">Manage your portfolio content from here.</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="card-title">Total Projects</h6>
                    <h2 className="mb-0">
                      {projectsLoading ? (
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        projects.length
                      )}
                    </h2>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-project-diagram fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card bg-success text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="card-title">Site Settings</h6>
                    <h2 className="mb-0">
                      {settingsLoading ? (
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        <i className="fas fa-check"></i>
                      )}
                    </h2>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-cog fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card bg-info text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="card-title">Portfolio Status</h6>
                    <h2 className="mb-0">Active</h2>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-globe fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row mb-4">
          <div className="col">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Quick Actions</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    <button 
                      className="btn btn-outline-primary w-100 mb-2"
                      onClick={() => navigate('/admin/projects')}
                    >
                      <i className="fas fa-plus me-2"></i>
                      Add Project
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button 
                      className="btn btn-outline-success w-100 mb-2"
                      onClick={() => navigate('/admin/projects')}
                    >
                      <i className="fas fa-edit me-2"></i>
                      Manage Projects
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button 
                      className="btn btn-outline-info w-100 mb-2"
                      onClick={() => window.open('/', '_blank')}
                    >
                      <i className="fas fa-eye me-2"></i>
                      View Portfolio
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button 
                      className="btn btn-outline-warning w-100 mb-2"
                      onClick={() => {/* TODO: Navigate to settings */}}
                    >
                      <i className="fas fa-cog me-2"></i>
                      Site Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Recent Projects</h5>
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={() => navigate('/admin/projects')}
                >
                  View All
                </button>
              </div>
              <div className="card-body">
                {projectsLoading ? (
                  <div className="text-center">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : projects.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Completed Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.slice(0, 5).map((project) => (
                          <tr key={project.id}>
                            <td>
                              <strong>{project.title}</strong>
                              <br />
                              <small className="text-muted">
                                {project.description.substring(0, 50)}...
                              </small>
                            </td>
                            <td>
                              <span className="badge bg-secondary">{project.category}</span>
                            </td>
                            <td>{project.completedDate}</td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary me-1">
                                <i className="fas fa-edit"></i>
                              </button>
                              <button className="btn btn-sm btn-outline-danger">
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center text-muted">
                    <i className="fas fa-folder-open fa-3x mb-3"></i>
                    <p>No projects found. Create your first project!</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate('/admin/projects')}
                    >
                      <i className="fas fa-plus me-2"></i>
                      Add Project
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;