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
          <button className="custom-primary-btn" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus me-2"></i>
            Add New Project
          </button>
        </div>

        {/* Filters Section */}
        <div className="content-card filters-card">
          <div className="filters-container">
            <div className="search-container">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ minWidth: "150px" }}
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
        <div className="items-grid">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div key={project.id} className="content-card item-card">
                <div className="item-card-image">
                  <img
                    src={project.mainImage || "/placeholder.svg"}
                    alt={project.title}
                  />
                  <div className="project-overlay">
                    <button className="custom-primary-btn btn-sm" onClick={() => handleEdit(project)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="custom-btn-danger  " onClick={() => handleDelete(project.id)}>
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
                        className="custom-secondary-btn"
                      >
                        <i className="fab fa-github"></i>
                      </a>
                    )}
                  </div>
                </div>
                <div className="item-card-content">
                  <div className="project-header">
                    <h3 className="item-card-title">{project.title}</h3>
                    <span className="item-card-category">{project.category}</span>
                  </div>
                  <p className="item-card-description">
                    {project.description.length > 120
                      ? `${project.description.substring(0, 120)}...`
                      : project.description}
                  </p>
                  <div className="project-tech-tags">
                    {project.technologies?.slice(0, 3).map((tech, index) => (
                      <span key={index} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                    {project.technologies && project.technologies.length > 3 && (
                      <span className="tech-more">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="item-card-actions">
                    <div className="item-card-meta">
                      <div className="meta-item">
                        <i className="fas fa-calendar"></i>
                        {new Date(project.completedDate).toLocaleDateString()}
                      </div>
                      {project.features && (
                        <div className="meta-item">
                          <i className="fas fa-list"></i>
                          {project.features.length} features
                        </div>
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
              <button className="custom-primary-btn" onClick={() => setShowModal(true)}>
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
