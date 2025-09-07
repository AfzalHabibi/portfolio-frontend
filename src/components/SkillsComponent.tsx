import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchSkills } from '../store/slices/skillSlice'
import { RootState, AppDispatch } from '../store/store'
import { Skill, SkillItem } from '../types'

interface SkillItemWithCategory extends SkillItem {
  categoryInfo: {
    name: string
    color: string
    icon: string
  }
}

interface SkillsComponentProps {
  showAllDetails?: boolean
  maxSkillsToShow?: number
  className?: string
  showCategories?: boolean // New prop to show categories instead of individual skills
}

const SkillsComponent: React.FC<SkillsComponentProps> = ({ 
  showAllDetails = false, 
  maxSkillsToShow = 12,
  className = '',
  showCategories = false
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { skills, loading, error } = useSelector((state: RootState) => state.skills)
  
  // Track if initial fetch has been made
  const hasFetchedRef = useRef(false)

  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedSkill, setSelectedSkill] = useState<SkillItemWithCategory | null>(null)
  const [showSkillModal, setShowSkillModal] = useState(false)

  useEffect(() => {
    if (!hasFetchedRef.current && skills.length === 0 && !loading) {
      hasFetchedRef.current = true
      dispatch(fetchSkills(false)) // Only active skills for public
    }
  }, [dispatch, skills.length, loading])

  // Get all categories
  const categories = useMemo(() => {
    const cats = ['all', ...skills.map(skill => skill.category)]
    return Array.from(new Set(cats))
  }, [skills])

  // Get all skills with category info
  const allSkills = useMemo((): SkillItemWithCategory[] => {
    return skills.flatMap(skill => 
      skill.items
        .filter(item => item.isActive !== false)
        .map(item => ({
          ...item,
          categoryInfo: {
            name: skill.category,
            color: skill.color || '#0ea5e9',
            icon: skill.icon || 'fas fa-code'
          }
        }))
    )
  }, [skills])

  // Filtered skills based on active category
  const filteredSkills = useMemo(() => {
    const filtered = activeCategory === 'all' 
      ? allSkills 
      : allSkills.filter(skill => skill.categoryInfo.name === activeCategory)
    
    return filtered.slice(0, maxSkillsToShow)
  }, [allSkills, activeCategory, maxSkillsToShow])

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case 'Expert': return '#ef4444'
      case 'Advanced': return '#f59e0b'
      case 'Intermediate': return '#3b82f6'
      case 'Beginner': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getProficiencyLevel = (proficiency: string) => {
    switch (proficiency) {
      case 'Expert': return 95
      case 'Advanced': return 85
      case 'Intermediate': return 70
      case 'Beginner': return 50
      default: return 50
    }
  }

  const openSkillModal = (skill: SkillItemWithCategory) => {
    setSelectedSkill(skill)
    setShowSkillModal(true)
  }

  const closeSkillModal = () => {
    setSelectedSkill(null)
    setShowSkillModal(false)
  }

  // Handle category navigation
  const navigateToSkillCategory = (skillCategory: Skill) => {
    navigate(`/skills/${skillCategory._id || skillCategory.id}`)
  }

  const handleSkillClick = (skill: SkillItemWithCategory) => {
    if (showAllDetails) {
      // Find the skill category this item belongs to
      const skillCategory = skills.find(category => 
        category.category === skill.categoryInfo.name
      )
      if (skillCategory) {
        navigateToSkillCategory(skillCategory)
      }
    } else {
      openSkillModal(skill)
    }
  }

  const handleCategoryClick = (skillCategory: Skill) => {
    navigateToSkillCategory(skillCategory)
  }

  if (loading) {
    return (
      <div className="skills-loading">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading skills...</span>
          </div>
          <p className="mt-3 text-muted">Loading skills...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="skills-error">
        <div className="text-center py-5">
          <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
          <h5>Unable to load skills</h5>
          <p className="text-muted">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`skills-component ${className}`}>
      {/* Category Filter - only show for individual skills view */}
      {!showCategories && (
        <div className="category-filter mb-4">
          <div className="category-tabs">
            {categories.map(category => (
              <button
                key={category}
                className={`category-tab ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category === 'all' ? 'All Skills' : category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Skills Grid */}
      <div className="skills-grid">
        {showCategories ? (
          /* Render Skill Categories */
          skills.map((skillCategory, index) => (
            <div 
              key={skillCategory._id || skillCategory.id || index} 
              className="skill-card category-card"
              style={{ '--delay': index * 0.1 } as React.CSSProperties}
              onClick={() => handleCategoryClick(skillCategory)}
            >
              <div className="skill-card-inner">
                <div className="skill-header">
                  <div 
                    className="skill-icon"
                    style={{ 
                      color: skillCategory.color || '#0ea5e9',
                      backgroundColor: (skillCategory.color || '#0ea5e9') + '20',
                      borderColor: skillCategory.color || '#0ea5e9'
                    }}
                  >
                    <i className={skillCategory.icon || 'fas fa-code'}></i>
                  </div>
                  <div className="skill-title">
                    <h6>{skillCategory.category}</h6>
                    <span className="skill-category">
                      {skillCategory.items.filter(item => item.isActive !== false).length} Skills
                    </span>
                  </div>
                </div>

                <div className="skill-proficiency">
                  <div className="proficiency-info">
                    <span className="proficiency-label">
                      {skillCategory.items.filter(item => item.proficiency === 'Expert' && item.isActive !== false).length} Expert
                    </span>
                    <span className="experience-label">
                      {Math.round(skillCategory.items.reduce((acc, item) => {
                        if (item.isActive === false) return acc
                        const years = parseFloat(item.experience.replace(/[^\d.]/g, '')) || 0
                        return acc + years
                      }, 0) / Math.max(skillCategory.items.filter(item => item.isActive !== false).length, 1))}+ years avg
                    </span>
                  </div>
                </div>

                <p className="skill-description">
                  {skillCategory.description || `Explore my ${skillCategory.category} skills and expertise`}
                </p>

                <div className="skill-actions">
                  <button 
                    className="btn-skill-details"
                    style={{ 
                      borderColor: skillCategory.color || '#0ea5e9',
                      color: skillCategory.color || '#0ea5e9'
                    }}
                  >
                    <i className="fas fa-arrow-right me-2"></i>
                    View Skills
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          /* Render Individual Skills */
          filteredSkills.map((skill, index) => (
            <div 
              key={skill._id || index} 
              className="skill-card"
              style={{ '--delay': index * 0.1 } as React.CSSProperties}
              onClick={() => handleSkillClick(skill)}
            >
              <div className="skill-card-inner">
                <div className="skill-header">
                  <div 
                    className="skill-icon"
                    style={{ color: skill.color || skill.categoryInfo.color }}
                  >
                    <i className={skill.icon || skill.categoryInfo.icon}></i>
                  </div>
                  <div className="skill-title">
                    <h6>{skill.name}</h6>
                    <span className="skill-category">
                      {skill.categoryInfo.name}
                    </span>
                  </div>
                </div>

                <div className="skill-proficiency">
                  <div className="proficiency-info">
                    <span className="proficiency-label">{skill.proficiency}</span>
                    <span className="experience-label">{skill.experience}</span>
                  </div>
                  <div className="proficiency-bar">
                    <div 
                      className="proficiency-fill"
                      style={{ 
                        width: `${getProficiencyLevel(skill.proficiency)}%`,
                        backgroundColor: getProficiencyColor(skill.proficiency)
                      }}
                    ></div>
                  </div>
                </div>

                {!showAllDetails && (
                  <p className="skill-description">{skill.description}</p>
                )}

                {skill.keywords.length > 0 && (
                  <div className="skill-keywords">
                    {skill.keywords.slice(0, 3).map((keyword, idx) => (
                      <span key={idx} className="keyword-tag">
                        {keyword}
                      </span>
                    ))}
                    {skill.keywords.length > 3 && (
                      <span className="keyword-tag more">
                        +{skill.keywords.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {showAllDetails && (
                  <div className="skill-stats">
                    {skill.projects && skill.projects.length > 0 && (
                      <div className="stat-item">
                        <i className="fas fa-project-diagram"></i>
                        <span>{skill.projects.length} project{skill.projects.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {skill.certifications && skill.certifications.length > 0 && (
                      <div className="stat-item">
                        <i className="fas fa-certificate"></i>
                        <span>{skill.certifications.length} cert{skill.certifications.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                )}

                {showAllDetails && (
                  <div className="skill-actions">
                    <button className="btn-skill-details">
                      <i className="fas fa-info-circle"></i>
                      View Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* No Skills Message */}
      {!showCategories && filteredSkills.length === 0 && (
        <div className="no-skills">
          <div className="text-center py-5">
            <i className="fas fa-search fa-3x text-muted mb-3"></i>
            <h5>No skills found</h5>
            <p className="text-muted">
              {activeCategory === 'all' 
                ? 'No skills available at the moment' 
                : `No skills found in ${activeCategory} category`}
            </p>
          </div>
        </div>
      )}

      {/* Skill Detail Modal */}
      {!showCategories && showSkillModal && selectedSkill && (
        <div className="skill-modal-overlay" onClick={closeSkillModal}>
          <div className="skill-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="skill-modal-close" onClick={closeSkillModal}>
              <i className="fas fa-times"></i>
            </button>

            <div className="modal-header">
              <div className="modal-skill-header">
                <div 
                  className="modal-skill-icon" 
                  style={{ 
                    backgroundColor: selectedSkill.categoryInfo.color + '20', 
                    borderColor: selectedSkill.categoryInfo.color 
                  }}
                >
                  <i 
                    className={selectedSkill.icon || selectedSkill.categoryInfo.icon} 
                    style={{ color: selectedSkill.categoryInfo.color }}
                  ></i>
                </div>
                <div>
                  <h3>{selectedSkill.name}</h3>
                  <span className="modal-category" style={{ color: selectedSkill.categoryInfo.color }}>
                    {selectedSkill.categoryInfo.name}
                  </span>
                </div>
              </div>
              
              <div className="proficiency-info-detailed">
                <div className="proficiency-badge-large" style={{ backgroundColor: getProficiencyColor(selectedSkill.proficiency) }}>
                  {selectedSkill.proficiency}
                </div>
                <div className="experience-badge-large">
                  <i className="fas fa-clock me-2"></i>
                  {selectedSkill.experience}
                </div>
                {selectedSkill.version && (
                  <div className="version-badge">
                    <i className="fas fa-tag me-2"></i>
                    v{selectedSkill.version}
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
                      <p>{selectedSkill.description}</p>
                    </div>

                    {/* Keywords */}
                    <div className="skill-section">
                      <h5><i className="fas fa-tags me-2"></i>Technologies & Keywords</h5>
                      <div className="keywords-grid">
                        {selectedSkill.keywords.map((keyword, idx) => (
                          <span key={idx} className="keyword-tag-large" style={{ backgroundColor: selectedSkill.categoryInfo.color }}>
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    {/* Projects */}
                    {selectedSkill.projects && selectedSkill.projects.length > 0 && (
                      <div className="skill-section">
                        <h6><i className="fas fa-project-diagram me-2"></i>Projects ({selectedSkill.projects.length})</h6>
                        <ul className="projects-list">
                          {selectedSkill.projects.slice(0, 5).map((project, idx) => (
                            <li key={idx}>{project}</li>
                          ))}
                          {selectedSkill.projects.length > 5 && (
                            <li className="more-projects">+{selectedSkill.projects.length - 5} more projects</li>
                          )}
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

export default SkillsComponent