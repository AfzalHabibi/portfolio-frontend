"use client"

import type React from "react"
import { useState } from "react"
import AdminLayout from "./AdminLayout"

interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  features: string[]
  technologies: string[]
  category: string
  completedDate: string
  demoUrl?: string
  githubUrl?: string
  clientRemarks?: string
  mainImage?: string
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "E-commerce Platform",
      description: "Full-stack e-commerce solution with React and Node.js",
      longDescription:
        "A comprehensive e-commerce platform built with modern technologies including React, Node.js, and MongoDB. Features include user authentication, product catalog, shopping cart, payment integration, and admin dashboard.",
      features: ["User Authentication", "Product Catalog", "Shopping Cart", "Payment Integration", "Admin Dashboard"],
      technologies: ["React", "Node.js", "MongoDB", "Express", "Stripe"],
      category: "Web Development",
      completedDate: "2024-01-15",
      demoUrl: "https://demo.example.com",
      githubUrl: "https://github.com/user/ecommerce",
      mainImage: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "2",
      title: "Mobile Banking App",
      description: "Secure mobile banking application with biometric authentication",
      longDescription:
        "A secure mobile banking application featuring biometric authentication, real-time transactions, account management, and comprehensive security measures.",
      features: ["Biometric Auth", "Real-time Transactions", "Account Management", "Security Features"],
      technologies: ["React Native", "Firebase", "Node.js", "PostgreSQL"],
      category: "Mobile Development",
      completedDate: "2024-01-10",
      githubUrl: "https://github.com/user/banking-app",
      mainImage: "/placeholder.svg?height=300&width=400",
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    features: [""],
    technologies: [""],
    category: "",
    completedDate: "",
    demoUrl: "",
    githubUrl: "",
    clientRemarks: "",
    mainImage: "",
  })

  const categories = ["Web Development", "Mobile Development", "Desktop Application", "UI/UX Design", "Other"]

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "" || project.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleArrayChange = (index: number, value: string, field: 'features' | 'technologies') => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const addArrayItem = (field: 'features' | 'technologies') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const removeArrayItem = (index: number, field: 'features' | 'technologies') => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newProject: Project = {
      id: editingProject?.id || Date.now().toString(),
      ...formData,
      features: formData.features.filter(f => f.trim()),
      technologies: formData.technologies.filter(t => t.trim()),
    }

    if (editingProject) {
      setProjects((prev) => prev.map((project) => (project.id === editingProject.id ? newProject : project)))
    } else {
      setProjects((prev) => [...prev, newProject])
    }

    resetForm()
    setShowModal(false)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      longDescription: "",
      features: [""],
      technologies: [""],
      category: "",
      completedDate: "",
      demoUrl: "",
      githubUrl: "",
      clientRemarks: "",
      mainImage: "",
    })
    setEditingProject(null)
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription,
      features: project.features?.length ? project.features : [""],
      technologies: project.technologies?.length ? project.technologies : [""],
      category: project.category,
      completedDate: project.completedDate,
      demoUrl: project.demoUrl || "",
      githubUrl: project.githubUrl || "",
      clientRemarks: project.clientRemarks || "",
      mainImage: project.mainImage || "",
    })
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setProjects((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

  return (
    <AdminLayout title="Projects Management">
      <div className="dashboard-content">
        {/* Header Section */}
        <div className="welcome-section">
          <div className="welcome-text">
            <h2>Projects Management</h2>
            <p>Manage your portfolio projects and showcase your work</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus me-2"></i>
            Add New Project
          </button>
        </div>

        {/* Filters Section */}
        <div className="content-card" style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: "1", minWidth: "250px" }}>
              <div style={{ position: "relative" }}>
                <i
                  className="fas fa-search"
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                ></i>
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                    background: "var(--secondary-bg)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                  }}
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: "0.75rem",
                background: "var(--secondary-bg)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                color: "var(--text-primary)",
                fontSize: "0.9rem",
                minWidth: "150px",
              }}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div key={project.id} className="content-card" style={{ padding: "0", overflow: "hidden" }}>
                <div style={{ position: "relative" }}>
                  <img
                    src={project.mainImage || "/placeholder.svg"}
                    alt={project.title}
                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "0",
                      left: "0",
                      right: "0",
                      bottom: "0",
                      background: "rgba(0, 0, 0, 0.7)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      opacity: "0",
                      transition: "opacity 0.3s ease",
                    }}
                    className="project-overlay"
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                  >
                    <button className="btn btn-primary btn-sm">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(project.id)}>
                      <i className="fas fa-trash"></i>
                    </button>
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-info btn-sm"
                      >
                        <i className="fas fa-external-link-alt"></i>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                      >
                        <i className="fab fa-github"></i>
                      </a>
                    )}
                  </div>
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "1rem",
                    }}
                  >
                    <h3 style={{ color: "var(--text-primary)", fontSize: "1.25rem", fontWeight: "600", margin: "0" }}>
                      {project.title}
                    </h3>
                    <span
                      style={{
                        background: "var(--accent-primary)",
                        color: "white",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                      }}
                    >
                      {project.category}
                    </span>
                  </div>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.9rem",
                      lineHeight: "1.5",
                      marginBottom: "1rem",
                    }}
                  >
                    {project.description.length > 120
                      ? `${project.description.substring(0, 120)}...`
                      : project.description}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                    {project.technologies?.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        style={{
                          background: "var(--secondary-bg)",
                          color: "var(--text-muted)",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies && project.technologies.length > 3 && (
                      <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                      <i className="fas fa-calendar me-1"></i>
                      {new Date(project.completedDate).toLocaleDateString()}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        color: "var(--text-muted)",
                        fontSize: "0.875rem",
                      }}
                    >
                      {project.features && (
                        <span>
                          <i className="fas fa-list me-1"></i>
                          {project.features.length} features
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
              <i className="fas fa-folder-open"></i>
              <h3>No Projects Found</h3>
              <p>
                {searchTerm || selectedCategory
                  ? "No projects match your current filters."
                  : "Create your first project to get started."}
              </p>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                <i className="fas fa-plus me-2"></i>
                Add New Project
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default Projects
