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
        <div className="settings-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
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
                <div className="form-section">
                  <h3 className="form-section-title">General Settings</h3>
                  <p className="form-section-description">Basic information about your portfolio</p>
                </div>

                <div className="form-container">
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Site Name</label>
                      <input
                        type="text"
                        name="siteName"
                        value={settings.siteName}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tagline</label>
                      <input
                        type="text"
                        name="tagline"
                        value={settings.tagline}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={settings.email}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={settings.phone}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={settings.location}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Social Links */}
            {activeTab === "social" && (
              <div>
                <div className="form-section">
                  <h3 className="form-section-title">Social Links</h3>
                  <p className="form-section-description">Connect your social media profiles</p>
                </div>

                <div className="form-container social-links-container">
                  {[
                    { name: "github", icon: "fab fa-github", label: "GitHub" },
                    { name: "linkedin", icon: "fab fa-linkedin", label: "LinkedIn" },
                    { name: "twitter", icon: "fab fa-twitter", label: "Twitter" },
                    { name: "instagram", icon: "fab fa-instagram", label: "Instagram" },
                  ].map((social) => (
                    <div key={social.name} className="social-link-item">
                      <div className="social-icon">
                        <i className={social.icon}></i>
                      </div>
                      <div className="form-group">
                        <label className="form-label">{social.label}</label>
                        <input
                          type="url"
                          name={social.name}
                          value={settings[social.name as keyof typeof settings] as string}
                          onChange={handleInputChange}
                          placeholder={`Your ${social.label} URL`}
                          className="form-input"
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
                <div className="form-section">
                  <h3 className="form-section-title">Theme Settings</h3>
                  <p className="form-section-description">Customize the appearance of your portfolio</p>
                </div>

                <div className="form-container">
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Primary Color</label>
                      <div className="color-input-group">
                        <input
                          type="color"
                          name="primaryColor"
                          value={settings.primaryColor}
                          onChange={handleInputChange}
                          className="form-color"
                        />
                        <input
                          type="text"
                          name="primaryColor"
                          value={settings.primaryColor}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Secondary Color</label>
                      <div className="color-input-group">
                        <input
                          type="color"
                          name="secondaryColor"
                          value={settings.secondaryColor}
                          onChange={handleInputChange}
                          className="form-color"
                        />
                        <input
                          type="text"
                          name="secondaryColor"
                          value={settings.secondaryColor}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-checkbox">
                    <input
                      type="checkbox"
                      name="darkMode"
                      checked={settings.darkMode}
                      onChange={handleInputChange}
                    />
                    <label>Enable Dark Mode</label>
                  </div>
                </div>
              </div>
            )}

            {/* SEO Settings */}
            {activeTab === "seo" && (
              <div>
                <div className="form-section">
                  <h3 className="form-section-title">SEO Settings</h3>
                  <p className="form-section-description">Optimize your portfolio for search engines</p>
                </div>

                <div className="form-container">
                  <div className="form-group">
                    <label className="form-label">Meta Title</label>
                    <input
                      type="text"
                      name="metaTitle"
                      value={settings.metaTitle}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Meta Description</label>
                    <textarea
                      name="metaDescription"
                      value={settings.metaDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="form-textarea"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Meta Keywords</label>
                    <input
                      type="text"
                      name="metaKeywords"
                      value={settings.metaKeywords}
                      onChange={handleInputChange}
                      placeholder="Separate keywords with commas"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            {activeTab === "features" && (
              <div>
                <div className="form-section">
                  <h3 className="form-section-title">Features</h3>
                  <p className="form-section-description">Enable or disable portfolio features</p>
                </div>

                <div className="form-container features-container">
                  {[
                    { name: "showProjects", label: "Show Projects Section" },
                    { name: "showSkills", label: "Show Skills Section" },
                    { name: "showContact", label: "Show Contact Section" },
                    { name: "showBlog", label: "Show Blog Section" },
                    { name: "enableAnimations", label: "Enable Animations" },
                    { name: "enableParticles", label: "Enable Particle Effects" },
                  ].map((feature) => (
                    <div key={feature.name} className="form-checkbox">
                      <input
                        type="checkbox"
                        name={feature.name}
                        checked={settings[feature.name as keyof typeof settings] as boolean}
                        onChange={handleInputChange}
                      />
                      <label>{feature.label}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="form-actions">
              <button type="submit" className="custom-primary-btn">
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
