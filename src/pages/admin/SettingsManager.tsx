"use client"

import type React from "react"
import { useState } from "react"
import AdminLayout from "./AdminLayout"

const SettingsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general")
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "My Portfolio",
    tagline: "Full Stack Developer",
    email: "contact@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",

    // Social Links
    github: "https://github.com/username",
    linkedin: "https://linkedin.com/in/username",
    twitter: "https://twitter.com/username",
    instagram: "https://instagram.com/username",

    // Theme Settings
    primaryColor: "#6366f1",
    secondaryColor: "#8b5cf6",
    darkMode: true,

    // SEO Settings
    metaTitle: "My Portfolio - Full Stack Developer",
    metaDescription: "Professional portfolio showcasing my work as a full stack developer",
    metaKeywords: "developer, portfolio, react, node.js, javascript",

    // Features
    showProjects: true,
    showSkills: true,
    showContact: true,
    showBlog: false,
    enableAnimations: true,
    enableParticles: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Save settings logic here
    alert("Settings saved successfully!")
  }

  const tabs = [
    { id: "general", label: "General", icon: "fas fa-cog" },
    { id: "social", label: "Social Links", icon: "fas fa-share-alt" },
    { id: "theme", label: "Theme", icon: "fas fa-palette" },
    { id: "seo", label: "SEO", icon: "fas fa-search" },
    { id: "features", label: "Features", icon: "fas fa-toggle-on" },
  ]

  return (
    <AdminLayout title="Settings Management">
      <div className="dashboard-content">
        {/* Header */}
        <div className="welcome-section">
          <div className="welcome-text">
            <h2>Settings Management</h2>
            <p>Configure your portfolio settings and preferences</p>
          </div>
        </div>

        {/* Settings Tabs */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "2rem",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "1rem 1.5rem",
                background: "none",
                border: "none",
                color: activeTab === tab.id ? "var(--accent-primary)" : "var(--text-muted)",
                fontWeight: "500",
                cursor: "pointer",
                borderBottom: activeTab === tab.id ? "2px solid var(--accent-primary)" : "2px solid transparent",
                transition: "var(--transition-fast)",
              }}
            >
              <i className={`${tab.icon} me-2`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="content-card">
          <form onSubmit={handleSubmit}>
            {/* General Settings */}
            {activeTab === "general" && (
              <div>
                <div style={{ marginBottom: "2rem" }}>
                  <h3
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "1.5rem",
                      fontWeight: "600",
                      margin: "0 0 0.5rem 0",
                    }}
                  >
                    General Settings
                  </h3>
                  <p style={{ color: "var(--text-muted)", margin: "0" }}>Basic information about your portfolio</p>
                </div>

                <div style={{ maxWidth: "800px" }}>
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
                        Site Name
                      </label>
                      <input
                        type="text"
                        name="siteName"
                        value={settings.siteName}
                        onChange={handleInputChange}
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
                        Tagline
                      </label>
                      <input
                        type="text"
                        name="tagline"
                        value={settings.tagline}
                        onChange={handleInputChange}
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
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={settings.email}
                        onChange={handleInputChange}
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
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={settings.phone}
                        onChange={handleInputChange}
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
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={settings.location}
                      onChange={handleInputChange}
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
            )}

            {/* Social Links */}
            {activeTab === "social" && (
              <div>
                <div style={{ marginBottom: "2rem" }}>
                  <h3
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "1.5rem",
                      fontWeight: "600",
                      margin: "0 0 0.5rem 0",
                    }}
                  >
                    Social Links
                  </h3>
                  <p style={{ color: "var(--text-muted)", margin: "0" }}>Connect your social media profiles</p>
                </div>

                <div style={{ maxWidth: "800px", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    { name: "github", icon: "fab fa-github", label: "GitHub" },
                    { name: "linkedin", icon: "fab fa-linkedin", label: "LinkedIn" },
                    { name: "twitter", icon: "fab fa-twitter", label: "Twitter" },
                    { name: "instagram", icon: "fab fa-instagram", label: "Instagram" },
                  ].map((social) => (
                    <div key={social.name} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div
                        style={{
                          width: "45px",
                          height: "45px",
                          background: "var(--secondary-bg)",
                          border: "1px solid var(--border-color)",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--text-muted)",
                          fontSize: "1.1rem",
                        }}
                      >
                        <i className={social.icon}></i>
                      </div>
                      <div style={{ flex: "1" }}>
                        <label
                          style={{
                            display: "block",
                            color: "var(--text-primary)",
                            fontWeight: "500",
                            marginBottom: "0.25rem",
                            fontSize: "0.9rem",
                          }}
                        >
                          {social.label}
                        </label>
                        <input
                          type="url"
                          name={social.name}
                          value={settings[social.name as keyof typeof settings] as string}
                          onChange={handleInputChange}
                          placeholder={`Your ${social.label} URL`}
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
                  ))}
                </div>
              </div>
            )}

            {/* Theme Settings */}
            {activeTab === "theme" && (
              <div>
                <div style={{ marginBottom: "2rem" }}>
                  <h3
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "1.5rem",
                      fontWeight: "600",
                      margin: "0 0 0.5rem 0",
                    }}
                  >
                    Theme Settings
                  </h3>
                  <p style={{ color: "var(--text-muted)", margin: "0" }}>Customize the appearance of your portfolio</p>
                </div>

                <div style={{ maxWidth: "800px" }}>
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
                        Primary Color
                      </label>
                      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        <input
                          type="color"
                          name="primaryColor"
                          value={settings.primaryColor}
                          onChange={handleInputChange}
                          style={{
                            width: "50px",
                            height: "40px",
                            padding: "0",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        />
                        <input
                          type="text"
                          name="primaryColor"
                          value={settings.primaryColor}
                          onChange={handleInputChange}
                          style={{
                            flex: "1",
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
                        Secondary Color
                      </label>
                      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        <input
                          type="color"
                          name="secondaryColor"
                          value={settings.secondaryColor}
                          onChange={handleInputChange}
                          style={{
                            width: "50px",
                            height: "40px",
                            padding: "0",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        />
                        <input
                          type="text"
                          name="secondaryColor"
                          value={settings.secondaryColor}
                          onChange={handleInputChange}
                          style={{
                            flex: "1",
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

                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                    <input
                      type="checkbox"
                      name="darkMode"
                      checked={settings.darkMode}
                      onChange={handleInputChange}
                      style={{
                        width: "20px",
                        height: "20px",
                        accentColor: "var(--accent-primary)",
                      }}
                    />
                    <label style={{ color: "var(--text-primary)", fontWeight: "500", cursor: "pointer", margin: "0" }}>
                      Enable Dark Mode
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* SEO Settings */}
            {activeTab === "seo" && (
              <div>
                <div style={{ marginBottom: "2rem" }}>
                  <h3
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "1.5rem",
                      fontWeight: "600",
                      margin: "0 0 0.5rem 0",
                    }}
                  >
                    SEO Settings
                  </h3>
                  <p style={{ color: "var(--text-muted)", margin: "0" }}>Optimize your portfolio for search engines</p>
                </div>

                <div style={{ maxWidth: "800px" }}>
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
                      Meta Title
                    </label>
                    <input
                      type="text"
                      name="metaTitle"
                      value={settings.metaTitle}
                      onChange={handleInputChange}
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
                      Meta Description
                    </label>
                    <textarea
                      name="metaDescription"
                      value={settings.metaDescription}
                      onChange={handleInputChange}
                      rows={3}
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
                      Meta Keywords
                    </label>
                    <input
                      type="text"
                      name="metaKeywords"
                      value={settings.metaKeywords}
                      onChange={handleInputChange}
                      placeholder="Separate keywords with commas"
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
            )}

            {/* Features */}
            {activeTab === "features" && (
              <div>
                <div style={{ marginBottom: "2rem" }}>
                  <h3
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "1.5rem",
                      fontWeight: "600",
                      margin: "0 0 0.5rem 0",
                    }}
                  >
                    Features
                  </h3>
                  <p style={{ color: "var(--text-muted)", margin: "0" }}>Enable or disable portfolio features</p>
                </div>

                <div style={{ maxWidth: "800px", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    { name: "showProjects", label: "Show Projects Section" },
                    { name: "showSkills", label: "Show Skills Section" },
                    { name: "showContact", label: "Show Contact Section" },
                    { name: "showBlog", label: "Show Blog Section" },
                    { name: "enableAnimations", label: "Enable Animations" },
                    { name: "enableParticles", label: "Enable Particle Effects" },
                  ].map((feature) => (
                    <div key={feature.name} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <input
                        type="checkbox"
                        name={feature.name}
                        checked={settings[feature.name as keyof typeof settings] as boolean}
                        onChange={handleInputChange}
                        style={{
                          width: "20px",
                          height: "20px",
                          accentColor: "var(--accent-primary)",
                        }}
                      />
                      <label
                        style={{ color: "var(--text-primary)", fontWeight: "500", cursor: "pointer", margin: "0" }}
                      >
                        {feature.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div
              style={{
                marginTop: "2rem",
                paddingTop: "2rem",
                borderTop: "1px solid var(--border-color)",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-save me-2"></i>
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default SettingsManager
