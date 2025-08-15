"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    // Add your logout logic here
    navigate("/admin/login")
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const menuItems = [
    { path: "/admin/dashboard", icon: "fas fa-tachometer-alt", label: "Dashboard" },
    { path: "/admin/projects", icon: "fas fa-project-diagram", label: "Projects" },
    { path: "/admin/skills", icon: "fas fa-code", label: "Skills" },
    { path: "/admin/settings", icon: "fas fa-cog", label: "Settings" },
  ]

  const handleNavigation = (path: string) => {
    navigate(path)
    if (window.innerWidth <= 768) {
      closeSidebar()
    }
  }

  return (
    <div className="admin-app">
      <div className="admin-layout">
      {/* Sidebar Overlay for Mobile */}
      <div className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`} onClick={closeSidebar}></div>

      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? "show" : ""}`}>
        <div className="sidebar-header">
          <h4 className="sidebar-title">
            <i className="fas fa-user-shield me-2"></i>
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
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => handleNavigation(item.path)}
            >
              <i className={item.icon}></i>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`admin-main ${sidebarOpen ? "sidebar-open" : ""}`}>
        <header className="admin-header">
          <div className="header-left">
            <button className="hamburger-btn" onClick={toggleSidebar}>
              <i className="fas fa-bars"></i>
            </button>
            <h1 className="page-title">{title}</h1>
          </div>
          <div className="header-actions">
            <button className="btn btn-outline-primary me-2" onClick={() => window.open("/", "_blank")}>
              <i className="fas fa-external-link-alt me-2"></i>
              View Portfolio
            </button>
            <button className="custom-secondary-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt me-2"></i>
              Logout
            </button>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
    </div>
  )
}

export default AdminLayout
