import React, { useState } from 'react';
import AdminLayout from './AdminLayout';

interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  profileImage: string;
  resume: string;
}

interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  website: string;
}

interface SiteSettings {
  siteTitle: string;
  siteDescription: string;
  favicon: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  enableDarkMode: boolean;
  enableAnimations: boolean;
  showContactForm: boolean;
  googleAnalytics: string;
}

const SettingsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    profileImage: '',
    resume: '',
  });

  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    github: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    website: '',
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteTitle: '',
    siteDescription: '',
    favicon: '',
    logo: '',
    primaryColor: '#a53b4c',
    secondaryColor: '#0d6efd',
    enableDarkMode: true,
    enableAnimations: true,
    showContactForm: true,
    googleAnalytics: '',
  });

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialLinksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialLinks(prev => ({ ...prev, [name]: value }));
  };

  const handleSiteSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setSiteSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = (section: string) => {
    // Here you would typically save to your backend
    alert(`${section} settings saved successfully!`);
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: 'fas fa-user' },
    { id: 'social', label: 'Social Links', icon: 'fas fa-share-alt' },
    { id: 'site', label: 'Site Settings', icon: 'fas fa-cog' },
  ];

  return (
    <AdminLayout title="Settings Management">
      <div className="settings-manager">
        {/* Tab Navigation */}
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={`${tab.icon} me-2`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
          <div className="settings-content">
            <div className="settings-header">
              <h3>Personal Information</h3>
              <p>Update your personal details and professional information</p>
            </div>

            <form className="settings-form">
              <div className="form-section">
                <h4>Basic Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={personalInfo.name}
                      onChange={handlePersonalInfoChange}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Professional Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={personalInfo.title}
                      onChange={handlePersonalInfoChange}
                      placeholder="e.g., Full Stack Developer"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={personalInfo.email}
                      onChange={handlePersonalInfoChange}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={personalInfo.phone}
                      onChange={handlePersonalInfoChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={personalInfo.location}
                    onChange={handlePersonalInfoChange}
                    placeholder="City, Country"
                  />
                </div>

                <div className="form-group">
                  <label>Professional Bio</label>
                  <textarea
                    name="bio"
                    value={personalInfo.bio}
                    onChange={handlePersonalInfoChange}
                    rows={4}
                    placeholder="Write a brief description about yourself and your expertise..."
                  ></textarea>
                </div>
              </div>

              <div className="form-section">
                <h4>Media & Documents</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Profile Image URL</label>
                    <input
                      type="url"
                      name="profileImage"
                      value={personalInfo.profileImage}
                      onChange={handlePersonalInfoChange}
                      placeholder="https://example.com/profile.jpg"
                    />
                  </div>
                  <div className="form-group">
                    <label>Resume/CV URL</label>
                    <input
                      type="url"
                      name="resume"
                      value={personalInfo.resume}
                      onChange={handlePersonalInfoChange}
                      placeholder="https://example.com/resume.pdf"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleSave('Personal Information')}
                >
                  <i className="fas fa-save me-2"></i>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Social Links Tab */}
        {activeTab === 'social' && (
          <div className="settings-content">
            <div className="settings-header">
              <h3>Social Media Links</h3>
              <p>Add your social media profiles and professional networks</p>
            </div>

            <form className="settings-form">
              <div className="form-section">
                <h4>Professional Networks</h4>
                <div className="social-input-group">
                  <div className="social-input">
                    <div className="input-icon">
                      <i className="fab fa-github"></i>
                    </div>
                    <input
                      type="url"
                      name="github"
                      value={socialLinks.github}
                      onChange={handleSocialLinksChange}
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div className="social-input">
                    <div className="input-icon">
                      <i className="fab fa-linkedin"></i>
                    </div>
                    <input
                      type="url"
                      name="linkedin"
                      value={socialLinks.linkedin}
                      onChange={handleSocialLinksChange}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Social Media</h4>
                <div className="social-input-group">
                  <div className="social-input">
                    <div className="input-icon">
                      <i className="fab fa-twitter"></i>
                    </div>
                    <input
                      type="url"
                      name="twitter"
                      value={socialLinks.twitter}
                      onChange={handleSocialLinksChange}
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  <div className="social-input">
                    <div className="input-icon">
                      <i className="fab fa-instagram"></i>
                    </div>
                    <input
                      type="url"
                      name="instagram"
                      value={socialLinks.instagram}
                      onChange={handleSocialLinksChange}
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                  <div className="social-input">
                    <div className="input-icon">
                      <i className="fas fa-globe"></i>
                    </div>
                    <input
                      type="url"
                      name="website"
                      value={socialLinks.website}
                      onChange={handleSocialLinksChange}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleSave('Social Links')}
                >
                  <i className="fas fa-save me-2"></i>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Site Settings Tab */}
        {activeTab === 'site' && (
          <div className="settings-content">
            <div className="settings-header">
              <h3>Site Configuration</h3>
              <p>Customize your portfolio's appearance and functionality</p>
            </div>

            <form className="settings-form">
              <div className="form-section">
                <h4>General Settings</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Site Title *</label>
                    <input
                      type="text"
                      name="siteTitle"
                      value={siteSettings.siteTitle}
                      onChange={handleSiteSettingsChange}
                      placeholder="Your Portfolio"
                    />
                  </div>
                  <div className="form-group">
                    <label>Site Description</label>
                    <textarea
                      name="siteDescription"
                      value={siteSettings.siteDescription}
                      onChange={handleSiteSettingsChange}
                      rows={2}
                      placeholder="Brief description for SEO..."
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Visual Settings</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Primary Color</label>
                    <div className="color-input">
                      <input
                        type="color"
                        name="primaryColor"
                        value={siteSettings.primaryColor}
                        onChange={handleSiteSettingsChange}
                      />
                      <input
                        type="text"
                        value={siteSettings.primaryColor}
                        onChange={handleSiteSettingsChange}
                        name="primaryColor"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Secondary Color</label>
                    <div className="color-input">
                      <input
                        type="color"
                        name="secondaryColor"
                        value={siteSettings.secondaryColor}
                        onChange={handleSiteSettingsChange}
                      />
                      <input
                        type="text"
                        value={siteSettings.secondaryColor}
                        onChange={handleSiteSettingsChange}
                        name="secondaryColor"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Feature Toggles</h4>
                <div className="toggle-group">
                  <div className="toggle-item">
                    <input
                      type="checkbox"
                      id="enableDarkMode"
                      name="enableDarkMode"
                      checked={siteSettings.enableDarkMode}
                      onChange={handleSiteSettingsChange}
                    />
                    <label htmlFor="enableDarkMode">
                      <i className="fas fa-moon me-2"></i>
                      Enable Dark Mode
                    </label>
                  </div>
                  <div className="toggle-item">
                    <input
                      type="checkbox"
                      id="enableAnimations"
                      name="enableAnimations"
                      checked={siteSettings.enableAnimations}
                      onChange={handleSiteSettingsChange}
                    />
                    <label htmlFor="enableAnimations">
                      <i className="fas fa-magic me-2"></i>
                      Enable Animations
                    </label>
                  </div>
                  <div className="toggle-item">
                    <input
                      type="checkbox"
                      id="showContactForm"
                      name="showContactForm"
                      checked={siteSettings.showContactForm}
                      onChange={handleSiteSettingsChange}
                    />
                    <label htmlFor="showContactForm">
                      <i className="fas fa-envelope me-2"></i>
                      Show Contact Form
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Analytics</h4>
                <div className="form-group">
                  <label>Google Analytics ID</label>
                  <input
                    type="text"
                    name="googleAnalytics"
                    value={siteSettings.googleAnalytics}
                    onChange={handleSiteSettingsChange}
                    placeholder="GA-XXXXXXXXX-X"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleSave('Site Settings')}
                >
                  <i className="fas fa-save me-2"></i>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SettingsManager;
