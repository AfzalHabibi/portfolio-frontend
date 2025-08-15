"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import AdminLayout from "./AdminLayout"
import { RootState, AppDispatch } from "../../store/store"
import { fetchSiteSettings, updateSiteSettings, clearError } from "../../store/slices/settingsSlice"
import { SiteSettings } from "../../types"
import Loader from "../../components/Loader"

const SettingsManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { settings, loading, error } = useSelector((state: RootState) => state.settings)
  
  const [activeTab, setActiveTab] = useState("general")
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Fetch settings on component mount
    dispatch(fetchSiteSettings())
  }, [dispatch])

  useEffect(() => {
    // Update local settings when Redux state changes
    setLocalSettings(settings)
  }, [settings])

  useEffect(() => {
    // Clear any previous errors when component mounts
    if (error) {
      dispatch(clearError())
    }
  }, [dispatch, error])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    
    if (name.startsWith('socialLinks.')) {
      const socialKey = name.split('.')[1]
      setLocalSettings((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value,
        },
      }))
    } else {
      setLocalSettings((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await dispatch(updateSiteSettings(localSettings)).unwrap()
      alert("Settings saved successfully!")
    } catch (error: any) {
      alert(`Failed to save settings: ${error}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const tabs = [
    { id: "general", label: "General", icon: "fas fa-cog" },
    { id: "social", label: "Social Links", icon: "fas fa-share-alt" },
  ]

  if (loading && !localSettings.name) {
    return (
      <AdminLayout title="Settings Management">
        <div className="dashboard-content">
          <Loader />
        </div>
      </AdminLayout>
    )
  }

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

        {error && (
          <div className="alert alert-error mb-3">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

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
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={localSettings.name || ''}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={localSettings.title || ''}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      value={localSettings.description || ''}
                      onChange={handleInputChange}
                      rows={3}
                      className="form-textarea"
                      required
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={localSettings.email || ''}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={localSettings.phone || ''}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={localSettings.location || ''}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">CV URL</label>
                    <input
                      type="text"
                      name="cvUrl"
                      value={localSettings.cvUrl || ''}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Path to your CV file"
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
                    { name: "behance", icon: "fab fa-behance", label: "Behance" },
                    { name: "dribbble", icon: "fab fa-dribbble", label: "Dribbble" },
                  ].map((social) => (
                    <div key={social.name} className="social-link-item">
                      <div className="social-icon">
                        <i className={social.icon}></i>
                      </div>
                      <div className="form-group">
                        <label className="form-label">{social.label}</label>
                        <input
                          type="url"
                          name={`socialLinks.${social.name}`}
                          value={localSettings.socialLinks?.[social.name as keyof typeof localSettings.socialLinks] || ''}
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

            {/* Save Button */}
            <div className="form-actions">
              <button 
                type="submit" 
                className="custom-primary-btn"
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default SettingsManager
