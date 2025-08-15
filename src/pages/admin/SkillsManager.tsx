import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  icon: string;
  description: string;
  yearsOfExperience: number;
  projects: number;
}

const SkillsManager: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    level: 1,
    icon: '',
    description: '',
    yearsOfExperience: 0,
    projects: 0,
  });

  const categories = [
    'Frontend Development',
    'Backend Development',
    'Database',
    'DevOps',
    'Mobile Development',
    'Design',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSkill: Skill = {
      id: editingSkill?.id || Date.now().toString(),
      ...formData,
    };

    if (editingSkill) {
      setSkills(prev => prev.map(skill => skill.id === editingSkill.id ? newSkill : skill));
    } else {
      setSkills(prev => [...prev, newSkill]);
    }

    resetForm();
    setShowModal(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      level: 1,
      icon: '',
      description: '',
      yearsOfExperience: 0,
      projects: 0,
    });
    setEditingSkill(null);
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon: skill.icon,
      description: skill.description,
      yearsOfExperience: skill.yearsOfExperience,
      projects: skill.projects,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      setSkills(prev => prev.filter(skill => skill.id !== id));
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 8) return 'success';
    if (level >= 6) return 'warning';
    if (level >= 4) return 'info';
    return 'secondary';
  };

  const getLevelText = (level: number) => {
    if (level >= 8) return 'Expert';
    if (level >= 6) return 'Advanced';
    if (level >= 4) return 'Intermediate';
    return 'Beginner';
  };

  return (
    <AdminLayout title="Skills Management">
      <div className="skills-manager">
        {/* Header Actions */}
        <div className="content-header">
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-code"></i>
              </div>
              <div className="stat-info">
                <h3>{skills.length}</h3>
                <p>Total Skills</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-layer-group"></i>
              </div>
              <div className="stat-info">
                <h3>{new Set(skills.map(s => s.category)).size}</h3>
                <p>Categories</p>
              </div>
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <i className="fas fa-plus me-2"></i>
            Add Skill
          </button>
        </div>

        {/* Skills Grid */}
        <div className="skills-grid">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <div key={skill.id} className="skill-card">
                <div className="skill-header">
                  <div className="skill-icon">
                    <i className={skill.icon || 'fas fa-code'}></i>
                  </div>
                  <div className="skill-actions">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEdit(skill)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(skill.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                
                <div className="skill-content">
                  <h5 className="skill-name">{skill.name}</h5>
                  <span className="skill-category">{skill.category}</span>
                  
                  <div className="skill-level">
                    <div className="level-bar">
                      <div 
                        className={`level-fill bg-${getLevelColor(skill.level)}`}
                        style={{ width: `${skill.level * 10}%` }}
                      ></div>
                    </div>
                    <span className={`level-badge badge bg-${getLevelColor(skill.level)}`}>
                      {getLevelText(skill.level)} ({skill.level}/10)
                    </span>
                  </div>

                  <p className="skill-description">{skill.description}</p>
                  
                  <div className="skill-stats">
                    <div className="stat">
                      <i className="fas fa-calendar-alt"></i>
                      <span>{skill.yearsOfExperience} years</span>
                    </div>
                    <div className="stat">
                      <i className="fas fa-project-diagram"></i>
                      <span>{skill.projects} projects</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <i className="fas fa-code fa-3x"></i>
              <h4>No Skills Added</h4>
              <p>Start building your skills portfolio by adding your first skill.</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                <i className="fas fa-plus me-2"></i>
                Add Your First Skill
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h5>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Skill Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., React.js"
                      />
                    </div>
                    <div className="form-group">
                      <label>Category *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Skill Level (1-10) *</label>
                      <input
                        type="range"
                        name="level"
                        min="1"
                        max="10"
                        value={formData.level}
                        onChange={handleInputChange}
                        className="range-input"
                      />
                      <div className="range-value">
                        {formData.level}/10 - {getLevelText(formData.level)}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Icon Class</label>
                      <input
                        type="text"
                        name="icon"
                        value={formData.icon}
                        onChange={handleInputChange}
                        placeholder="e.g., fab fa-react"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Brief description of your experience with this skill..."
                    ></textarea>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Years of Experience</label>
                      <input
                        type="number"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={handleInputChange}
                        min="0"
                        step="0.5"
                      />
                    </div>
                    <div className="form-group">
                      <label>Projects Count</label>
                      <input
                        type="number"
                        name="projects"
                        value={formData.projects}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingSkill ? 'Update Skill' : 'Add Skill'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SkillsManager;
