"use client"

import type React from "react"
import { useState } from "react"
import AdminLayout from "./AdminLayout"

interface Skill {
  id: string
  name: string
  category: string
  level: number
  icon: string
  description: string
  yearsOfExperience: number
  projects: number
}

const SkillsManager: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([
    {
      id: "1",
      name: "React.js",
      category: "Frontend Development",
      level: 9,
      icon: "fab fa-react",
      description: "Advanced React development with hooks, context, and modern patterns",
      yearsOfExperience: 4,
      projects: 15,
    },
    {
      id: "2",
      name: "Node.js",
      category: "Backend Development",
      level: 8,
      icon: "fab fa-node-js",
      description: "Server-side JavaScript development with Express and various databases",
      yearsOfExperience: 3,
      projects: 12,
    },
    {
      id: "3",
      name: "TypeScript",
      category: "Frontend Development",
      level: 8,
      icon: "fas fa-code",
      description: "Type-safe JavaScript development for large-scale applications",
      yearsOfExperience: 3,
      projects: 10,
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    level: 1,
    icon: "",
    description: "",
    yearsOfExperience: 0,
    projects: 0,
  })

  const categories = [
    "Frontend Development",
    "Backend Development",
    "Database",
    "DevOps",
    "Mobile Development",
    "Design",
    "Other",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newSkill: Skill = {
      id: editingSkill?.id || Date.now().toString(),
      ...formData,
    }

    if (editingSkill) {
      setSkills((prev) => prev.map((skill) => (skill.id === editingSkill.id ? newSkill : skill)))
    } else {
      setSkills((prev) => [...prev, newSkill])
    }

    resetForm()
    setShowModal(false)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      level: 1,
      icon: "",
      description: "",
      yearsOfExperience: 0,
      projects: 0,
    })
    setEditingSkill(null)
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon: skill.icon,
      description: skill.description,
      yearsOfExperience: skill.yearsOfExperience,
      projects: skill.projects,
    })
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      setSkills((prev) => prev.filter((skill) => skill.id !== id))
    }
  }

  const getLevelColor = (level: number) => {
    if (level >= 8) return "success"
    if (level >= 6) return "warning"
    if (level >= 4) return "info"
    return "secondary"
  }

  const getLevelText = (level: number) => {
    if (level >= 8) return "Expert"
    if (level >= 6) return "Advanced"
    if (level >= 4) return "Intermediate"
    return "Beginner"
  }

  return (
    <AdminLayout title="Skills Management">
      <div className="dashboard-content">
        {/* Header Section */}
        <div className="welcome-section">
          <div className="welcome-text">
            <h2>Skills Management</h2>
            <p>Manage your technical skills and expertise levels</p>
          </div>
          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-number">{skills.length}</span>
              <span className="stat-label">Total Skills</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">{new Set(skills.map((s) => s.category)).size}</span>
              <span className="stat-label">Categories</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">
                {Math.round(skills.reduce((acc, skill) => acc + skill.level, 0) / skills.length) || 0}
              </span>
              <span className="stat-label">Avg Level</span>
            </div>
          </div>
        </div>

        {/* Add Skill Button */}
        <div style={{ marginBottom: "2rem", textAlign: "right" }}>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus me-2"></i>
            Add Skill
          </button>
        </div>

        {/* Skills Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
          {skills.length > 0 ? (
            skills.map((skill) => (
              <div key={skill.id} className="content-card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "45px",
                      height: "45px",
                      background: "var(--accent-primary)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "1.1rem",
                    }}
                  >
                    <i className={skill.icon || "fas fa-code"}></i>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="btn-icon"
                      onClick={() => handleEdit(skill)}
                      style={{ background: "var(--accent-primary)", color: "white" }}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleDelete(skill.id)}
                      style={{ background: "var(--danger-color)", color: "white" }}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                <div>
                  <h5
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      margin: "0 0 0.25rem 0",
                    }}
                  >
                    {skill.name}
                  </h5>
                  <span
                    style={{
                      background: "var(--secondary-bg)",
                      color: "var(--text-muted)",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: "500",
                    }}
                  >
                    {skill.category}
                  </span>

                  <div style={{ margin: "1rem 0" }}>
                    <div
                      style={{
                        height: "8px",
                        background: "var(--secondary-bg)",
                        borderRadius: "4px",
                        overflow: "hidden",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${skill.level * 10}%`,
                          background: `var(--${getLevelColor(skill.level)}-color)`,
                          transition: "width 0.3s ease",
                        }}
                      ></div>
                    </div>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "12px",
                        background: `var(--${getLevelColor(skill.level)}-color)`,
                        color: "white",
                      }}
                    >
                      {getLevelText(skill.level)} ({skill.level}/10)
                    </span>
                  </div>

                  <p
                    style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5", margin: "1rem 0" }}
                  >
                    {skill.description}
                  </p>

                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "var(--text-muted)",
                        fontSize: "0.85rem",
                      }}
                    >
                      <i className="fas fa-calendar-alt"></i>
                      <span>{skill.yearsOfExperience} years</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "var(--text-muted)",
                        fontSize: "0.85rem",
                      }}
                    >
                      <i className="fas fa-project-diagram"></i>
                      <span>{skill.projects} projects</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
              <i className="fas fa-code"></i>
              <h4>No Skills Added</h4>
              <p>Start building your skills portfolio by adding your first skill.</p>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                <i className="fas fa-plus me-2"></i>
                Add Your First Skill
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              right: "0",
              bottom: "0",
              background: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: "2000",
              padding: "1rem",
            }}
          >
            <div
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-color)",
                borderRadius: "12px",
                width: "100%",
                maxWidth: "600px",
                maxHeight: "90vh",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  padding: "1.5rem",
                  borderBottom: "1px solid var(--border-color)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h5 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--text-primary)", margin: "0" }}>
                  {editingSkill ? "Edit Skill" : "Add New Skill"}
                </h5>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    fontSize: "1.25rem",
                    cursor: "pointer",
                    padding: "0.5rem",
                    borderRadius: "6px",
                    transition: "var(--transition-fast)",
                  }}
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ padding: "1.5rem", overflowY: "auto", flex: "1" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label
                        style={{
                          display: "block",
                          color: "var(--text-primary)",
                          fontWeight: "500",
                          marginBottom: "0.5rem",
                          fontSize: "0.9rem",
                        }}
                      >
                        Skill Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., React.js"
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          background: "var(--secondary-bg)",
                          border: "1px solid var(--border-color)",
                          borderRadius: "8px",
                          color: "var(--text-primary)",
                          fontSize: "0.9rem",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          color: "var(--text-primary)",
                          fontWeight: "500",
                          marginBottom: "0.5rem",
                          fontSize: "0.9rem",
                        }}
                      >
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          background: "var(--secondary-bg)",
                          border: "1px solid var(--border-color)",
                          borderRadius: "8px",
                          color: "var(--text-primary)",
                          fontSize: "0.9rem",
                        }}
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label
                        style={{
                          display: "block",
                          color: "var(--text-primary)",
                          fontWeight: "500",
                          marginBottom: "0.5rem",
                          fontSize: "0.9rem",
                        }}
                      >
                        Skill Level (1-10) *
                      </label>
                      <input
                        type="range"
                        name="level"
                        min="1"
                        max="10"
                        value={formData.level}
                        onChange={handleInputChange}
                        style={{
                          width: "100%",
                          height: "6px",
                          background: "var(--secondary-bg)",
                          borderRadius: "3px",
                          outline: "none",
                          appearance: "none",
                        }}
                      />
                      <div
                        style={{
                          textAlign: "center",
                          marginTop: "0.5rem",
                          color: "var(--text-muted)",
                          fontSize: "0.85rem",
                        }}
                      >
                        {formData.level}/10 - {getLevelText(formData.level)}
                      </div>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          color: "var(--text-primary)",
                          fontWeight: "500",
                          marginBottom: "0.5rem",
                          fontSize: "0.9rem",
                        }}
                      >
                        Icon Class
                      </label>
                      <input
                        type="text"
                        name="icon"
                        value={formData.icon}
                        onChange={handleInputChange}
                        placeholder="e.g., fab fa-react"
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          background: "var(--secondary-bg)",
                          border: "1px solid var(--border-color)",
                          borderRadius: "8px",
                          color: "var(--text-primary)",
                          fontSize: "0.9rem",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label
                      style={{
                        display: "block",
                        color: "var(--text-primary)",
                        fontWeight: "500",
                        marginBottom: "0.5rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Brief description of your experience with this skill..."
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        background: "var(--secondary-bg)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "8px",
                        color: "var(--text-primary)",
                        fontSize: "0.9rem",
                        resize: "vertical",
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label
                        style={{
                          display: "block",
                          color: "var(--text-primary)",
                          fontWeight: "500",
                          marginBottom: "0.5rem",
                          fontSize: "0.9rem",
                        }}
                      >
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={handleInputChange}
                        min="0"
                        step="0.5"
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          background: "var(--secondary-bg)",
                          border: "1px solid var(--border-color)",
                          borderRadius: "8px",
                          color: "var(--text-primary)",
                          fontSize: "0.9rem",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          color: "var(--text-primary)",
                          fontWeight: "500",
                          marginBottom: "0.5rem",
                          fontSize: "0.9rem",
                        }}
                      >
                        Projects Count
                      </label>
                      <input
                        type="number"
                        name="projects"
                        value={formData.projects}
                        onChange={handleInputChange}
                        min="0"
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          background: "var(--secondary-bg)",
                          border: "1px solid var(--border-color)",
                          borderRadius: "8px",
                          color: "var(--text-primary)",
                          fontSize: "0.9rem",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: "1.5rem",
                    borderTop: "1px solid var(--border-color)",
                    display: "flex",
                    gap: "1rem",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingSkill ? "Update Skill" : "Add Skill"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default SkillsManager
