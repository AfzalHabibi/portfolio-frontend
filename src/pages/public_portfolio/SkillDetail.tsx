"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useSkills } from "../../hooks/useApi"
import Loader from "../../components/Loader"
import type { Skill, SkillItem } from "../../types"

const SkillDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { skills, loading, loadSkills, loadSkillById } = useSkills()
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [selectedItem, setSelectedItem] = useState<SkillItem | null>(null)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    if (id) {
      // First load all skills to find the category
      if (skills.length === 0 && !loading) {
        loadSkills(false)
      } else if (skills.length > 0) {
        const skill = skills.find(s => s._id === id || s.id === id)
        if (skill) {
          setSelectedSkill(skill)
          setPageLoading(false)
        } else {
          // If skill not found, redirect to skills page
          navigate('/skills')
        }
      }
    }
  }, [id, skills, loading, loadSkills, navigate])

  useEffect(() => {
    if (!loading && skills.length > 0) {
      setPageLoading(false)
    }
  }, [loading, skills])

  const getProficiencyLevel = (proficiency: string) => {
    switch (proficiency) {
      case 'Expert': return 95
      case 'Advanced': return 85
      case 'Intermediate': return 70
      case 'Beginner': return 50
      default: return 50
    }
  }

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case 'Expert': return '#ef4444'
      case 'Advanced': return '#f59e0b'
      case 'Intermediate': return '#3b82f6'
      case 'Beginner': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getDifficultyLevel = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'expert': return 5
      case 'advanced': return 4
      case 'intermediate': return 3
      case 'beginner': return 2
      default: return 3
    }
  }

  if (pageLoading || loading) {
    return <Loader />
  }

  if (!selectedSkill) {
    return (
      <div className="skill-detail-error">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 text-center py-5">
              <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
              <h3>Skill Category Not Found</h3>
              <p className="text-muted mb-4">The requested skill category could not be found.</p>
              <Link to="/skills" className="btn-primary-custom">
                <i className="fas fa-arrow-left me-2"></i>
                Back to Skills
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const activeItems = selectedSkill.items.filter(item => item.isActive !== false)

  return (
    <div className="skill-detail-page">
      {/* Hero Section */}
      <section className="hero-section skill-detail-hero">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-8 mx-auto text-center">
              <div className="hero-content animate-on-scroll">
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb" className="mb-4">
                  <ol className="breadcrumb justify-content-center">
                    <li className="breadcrumb-item">
                      <Link to="/" className="text-decoration-none">Home</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="/skills" className="text-decoration-none">Skills</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {selectedSkill.category}
                    </li>
                  </ol>
                </nav>

                {/* Skill Category Header */}
                <div className="skill-category-header">
                  <div 
                    className="skill-category-icon"
                    style={{ 
                      backgroundColor: selectedSkill.color + '20', 
                      borderColor: selectedSkill.color,
                      color: selectedSkill.color 
                    }}
                  >
                    <i className={selectedSkill.icon || 'fas fa-code'}></i>
                  </div>
                  <h1 className="skill-category-title">
                    {selectedSkill.category}
                  </h1>
                  <p className="skill-category-description">
                    {selectedSkill.description || `Comprehensive overview of my ${selectedSkill.category} skills and expertise`}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="skill-quick-stats">
                  <div className="quick-stat">
                    <div className="quick-stat-number">{activeItems.length}</div>
                    <div className="quick-stat-label">Skills</div>
                  </div>
                  <div className="quick-stat">
                    <div className="quick-stat-number">{activeItems.filter(item => item.proficiency === 'Expert').length}</div>
                    <div className="quick-stat-label">Expert</div>
                  </div>
                  <div className="quick-stat">
                    <div className="quick-stat-number">{activeItems.filter(item => item.proficiency === 'Advanced').length}</div>
                    <div className="quick-stat-label">Advanced</div>
                  </div>
                  <div className="quick-stat">
                    <div className="quick-stat-number">
                      {Math.round(activeItems.reduce((acc, item) => {
                        const years = parseFloat(item.experience.replace(/[^\d.]/g, '')) || 0
                        return acc + years
                      }, 0) / Math.max(activeItems.length, 1))}+
                    </div>
                    <div className="quick-stat-label">Avg Years</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills List Section */}
      <section className="section-padding">
        <div className="container">
          <h2 className="section-title">Skills in {selectedSkill.category}</h2>
          <div className="skill-items-grid">
            {activeItems.map((item, index) => (
              <div 
                key={item._id || index} 
                className="skill-item-card"
                style={{ '--delay': index * 0.1 } as React.CSSProperties}
                onClick={() => setSelectedItem(item)}
              >
                <div className="skill-item-header">
                  <div 
                    className="skill-item-icon" 
                    style={{ 
                      backgroundColor: selectedSkill.color + '20', 
                      borderColor: selectedSkill.color,
                      color: selectedSkill.color 
                    }}
                  >
                    <i className={item.icon || selectedSkill.icon || 'fas fa-code'}></i>
                  </div>
                  <h5 className="skill-item-name">{item.name}</h5>
                </div>

                <div className="skill-item-meta">
                  <span 
                    className="proficiency-badge" 
                    style={{ backgroundColor: getProficiencyColor(item.proficiency) }}
                  >
                    {item.proficiency}
                  </span>
                  <span className="experience-badge">
                    <i className="fas fa-clock me-1"></i>
                    {item.experience}
                  </span>
                </div>

                <p className="skill-item-description">{item.description}</p>

                <div className="skill-item-keywords">
                  {item.keywords.slice(0, 4).map((keyword, idx) => (
                    <span key={idx} className="skill-keyword">
                      {keyword}
                    </span>
                  ))}
                  {item.keywords.length > 4 && (
                    <span className="skill-keyword">+{item.keywords.length - 4}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Skills Section */}
      <section className="section-padding" style={{ background: "var(--secondary-bg)" }}>
        <div className="container">
          <h2 className="section-title">Related Skill Categories</h2>
          <div className="related-skills-grid">
            {skills
              .filter(skill => skill._id !== selectedSkill._id && skill.id !== selectedSkill.id)
              .slice(0, 3)
              .map((skill, index) => (
                <Link 
                  key={skill._id || skill.id} 
                  to={`/skills/${skill._id || skill.id}`}
                  className="related-skill-card"
                  style={{ '--delay': index * 0.1 } as React.CSSProperties}
                >
                  <div className="related-skill-header">
                    <div 
                      className="related-skill-icon" 
                      style={{ 
                        backgroundColor: skill.color + '20', 
                        borderColor: skill.color,
                        color: skill.color 
                      }}
                    >
                      <i className={skill.icon || 'fas fa-code'}></i>
                    </div>
                    <div>
                      <h5 className="related-skill-name">{skill.category}</h5>
                      <p className="related-skill-count">{skill.items.filter(item => item.isActive !== false).length} Skills</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Skill Item Detail Modal */}
      {selectedItem && (
        <div className="skill-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="skill-modal-content skill-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="skill-modal-close" onClick={() => setSelectedItem(null)}>
              <i className="fas fa-times"></i>
            </button>

            <div className="modal-header">
              <div className="modal-skill-header">
                <div className="modal-skill-icon" style={{ backgroundColor: selectedSkill.color + '20', borderColor: selectedSkill.color }}>
                  <i className={selectedItem.icon || selectedSkill.icon || 'fas fa-code'} style={{ color: selectedSkill.color }}></i>
                </div>
                <div>
                  <h3>{selectedItem.name}</h3>
                  <span className="modal-category" style={{ color: selectedSkill.color }}>
                    {selectedSkill.category}
                  </span>
                </div>
              </div>
              
              <div className="proficiency-info-detailed">
                <div className="proficiency-badge-large" style={{ backgroundColor: getProficiencyColor(selectedItem.proficiency) }}>
                  {selectedItem.proficiency}
                </div>
                <div className="experience-badge-large">
                  <i className="fas fa-clock me-2"></i>
                  {selectedItem.experience}
                </div>
                {selectedItem.version && (
                  <div className="version-badge">
                    <i className="fas fa-tag me-2"></i>
                    v{selectedItem.version}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-body">
              <div className="skill-detail-content">
                <div className="row">
                  <div className="col-lg-8">
                    {/* Description */}
                    <div className="skill-section">
                      <h5><i className="fas fa-info-circle me-2"></i>Description</h5>
                      <p>{selectedItem.description}</p>
                    </div>

                    {/* Keywords */}
                    <div className="skill-section">
                      <h5><i className="fas fa-tags me-2"></i>Technologies & Keywords</h5>
                      <div className="keywords-grid">
                        {selectedItem.keywords.map((keyword, idx) => (
                          <span key={idx} className="keyword-tag-large" style={{ backgroundColor: selectedSkill.color }}>
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tools Used */}
                    {selectedItem.tools_used && selectedItem.tools_used.length > 0 && (
                      <div className="skill-section">
                        <h5><i className="fas fa-tools me-2"></i>Tools & Technologies</h5>
                        <div className="tools-grid">
                          {selectedItem.tools_used.map((tool, idx) => (
                            <span key={idx} className="tool-tag">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Best Practices */}
                    {selectedItem.best_practices && selectedItem.best_practices.length > 0 && (
                      <div className="skill-section">
                        <h5><i className="fas fa-check-circle me-2"></i>Best Practices</h5>
                        <ul className="practices-list">
                          {selectedItem.best_practices.map((practice, idx) => (
                            <li key={idx}>{practice}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="col-lg-4">
                    {/* Difficulty Level */}
                    {selectedItem.difficulty_handled && (
                      <div className="skill-section">
                        <h6><i className="fas fa-chart-line me-2"></i>Complexity Handled</h6>
                        <div className="difficulty-indicator">
                          <div className="difficulty-stars">
                            {[...Array(5)].map((_, i) => (
                              <i 
                                key={i} 
                                className={`fas fa-star ${i < getDifficultyLevel(selectedItem.difficulty_handled || '') ? 'active' : ''}`}
                                style={{ color: i < getDifficultyLevel(selectedItem.difficulty_handled || '') ? selectedSkill.color : '#ddd' }}
                              ></i>
                            ))}
                          </div>
                          <span className="difficulty-text">{selectedItem.difficulty_handled}</span>
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {selectedItem.projects && selectedItem.projects.length > 0 && (
                      <div className="skill-section">
                        <h6><i className="fas fa-project-diagram me-2"></i>Projects ({selectedItem.projects.length})</h6>
                        <ul className="projects-list">
                          {selectedItem.projects.slice(0, 5).map((project, idx) => (
                            <li key={idx}>{project}</li>
                          ))}
                          {selectedItem.projects.length > 5 && (
                            <li className="more-projects">+{selectedItem.projects.length - 5} more projects</li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Certifications */}
                    {selectedItem.certifications && selectedItem.certifications.length > 0 && (
                      <div className="skill-section">
                        <h6><i className="fas fa-certificate me-2"></i>Certifications</h6>
                        <ul className="certifications-list">
                          {selectedItem.certifications.map((cert, idx) => (
                            <li key={idx}>{cert}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Achievements */}
                    {selectedItem.achievements && selectedItem.achievements.length > 0 && (
                      <div className="skill-section">
                        <h6><i className="fas fa-trophy me-2"></i>Achievements</h6>
                        <ul className="achievements-list">
                          {selectedItem.achievements.map((achievement, idx) => (
                            <li key={idx}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SkillDetail
