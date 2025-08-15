import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useApi';
import "../../styles/admin.css"; // Assuming you have a CSS file for styles

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/admin/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/admin/projects', icon: 'fas fa-project-diagram', label: 'Projects' },
    { path: '/admin/skills', icon: 'fas fa-code', label: 'Skills' },
    { path: '/admin/settings', icon: 'fas fa-cog', label: 'Settings' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    closeSidebar();
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h4 className="sidebar-title">
            <i className="fas fa-user-shield"></i>
            Admin Panel
          </h4>
          <button className="sidebar-close" onClick={closeSidebar}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              <i className={item.icon}></i>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <i className="fas fa-user"></i>
            </div>
            <div className="user-details">
              <div className="user-name">{user?.email?.split('@')[0] || 'Admin'}</div>
              <div className="user-role">Administrator</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-header">
          <div className="header-content">
            <div className="header-left">
              <button className="hamburger-btn" onClick={toggleSidebar}>
                <i className="fas fa-bars"></i>
              </button>
              <h1 className="page-title">{title}</h1>
            </div>
            <div className="header-actions">
              <button 
                className="btn btn-outline-primary"
                onClick={() => window.open('/', '_blank')}
              >
                <i className="fas fa-external-link-alt"></i>
                View Portfolio
              </button>
            </div>
          </div>
        </header>

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
