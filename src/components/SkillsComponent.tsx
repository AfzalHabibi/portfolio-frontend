import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
}

const SkillsComponent: React.FC<SkillsComponentProps> = ({ 
  showAllDetails = false, 
  maxSkillsToShow = 12,
  className = ''
}) => {
  const dispatch = useDispatch<AppDispatch>()
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

  // Group skills by proficiency
  const skillsByProficiency = useMemo(() => {
    const grouped = filteredSkills.reduce((acc, skill) => {
      const level = skill.proficiency
      if (!acc[level]) acc[level] = []
      acc[level].push(skill)
      return acc
    }, {} as Record<string, typeof filteredSkills>)

    return grouped
  }, [filteredSkills])

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
      {/* Category Filter */}
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

      {/* Skills Grid */}
      <div className="skills-grid">
        {filteredSkills.map((skill, index) => (
          <div 
            key={skill._id || index} 
            className="skill-card"
            style={{ '--delay': index * 0.1 } as React.CSSProperties}
            onClick={() => showAllDetails && openSkillModal(skill)}
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
                  {skill.projects.length > 0 && (
                    <div className="stat-item">
                      <i className="fas fa-project-diagram"></i>
                      <span>{skill.projects.length} project{skill.projects.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {skill.certifications.length > 0 && (
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
        ))}
      </div>

      {filteredSkills.length === 0 && (
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

      {/* Skills Summary */}
      {!showAllDetails && filteredSkills.length > 0 && (
        <div className="skills-summary mt-4">
          <div className="row">
            <div className="col-md-3 mb-3">
              <div className="summary-card">
                <h4>{allSkills.length}</h4>
                <p>Total Skills</p>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="summary-card">
                <h4>{allSkills.filter(s => s.proficiency === 'Expert').length}</h4>
                <p>Expert Level</p>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="summary-card">
                <h4>{skills.length}</h4>
                <p>Categories</p>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="summary-card">
                <h4>{allSkills.reduce((acc, skill) => acc + skill.projects.length, 0)}</h4>
                <p>Projects</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skill Detail Modal */}
      {showSkillModal && selectedSkill && (
        <div className="skill-modal-overlay" onClick={closeSkillModal}>
          <div className="skill-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="skill-modal-close" onClick={closeSkillModal}>
              <i className="fas fa-times"></i>
            </button>

            <div className="modal-header">
              <div className="d-flex align-items-center mb-3">
                <div 
                  className="modal-skill-icon me-3"
                  style={{ color: selectedSkill.color || selectedSkill.categoryInfo.color }}
                >
                  <i className={selectedSkill.icon || selectedSkill.categoryInfo.icon}></i>
                </div>
                <div>
                  <h3>{selectedSkill.name}</h3>
                  <span className="modal-category">{selectedSkill.categoryInfo.name}</span>
                </div>
              </div>
              
              <div className="proficiency-info-detailed">
                <span 
                  className="proficiency-badge-large"
                  style={{ backgroundColor: getProficiencyColor(selectedSkill.proficiency) }}
                >
                  {selectedSkill.proficiency}
                </span>
                <span className="experience-badge-large">
                  {selectedSkill.experience}
                </span>
                {selectedSkill.version && (
                  <span className="version-badge">
                    {selectedSkill.version}
                  </span>
                )}
              </div>
            </div>

            <div className="modal-body">
              <div className="row">
                <div className="col-md-8">
                  <h5>About this skill</h5>
                  <p>{selectedSkill.description}</p>

                  {selectedSkill.keywords.length > 0 && (
                    <div className="mb-4">
                      <h6>Key Areas</h6>
                      <div className="keywords-grid">
                        {selectedSkill.keywords.map((keyword, idx) => (
                          <span key={idx} className="keyword-tag-large">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedSkill.difficulty_handled && (
                    <div className="mb-4">
                      <h6>Complex Challenges Handled</h6>
                      <p className="difficulty-text">{selectedSkill.difficulty_handled}</p>
                    </div>
                  )}

                  {selectedSkill.best_practices.length > 0 && (
                    <div className="mb-4">
                      <h6>Best Practices</h6>
                      <ul className="practices-list">
                        {selectedSkill.best_practices.map((practice, idx) => (
                          <li key={idx}>{practice}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="col-md-4">
                  {selectedSkill.projects.length > 0 && (
                    <div className="mb-4">
                      <h6>Projects</h6>
                      <ul className="projects-list">
                        {selectedSkill.projects.map((project, idx) => (
                          <li key={idx}>{project}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedSkill.tools_used.length > 0 && (
                    <div className="mb-4">
                      <h6>Tools & Technologies</h6>
                      <div className="tools-grid">
                        {selectedSkill.tools_used.map((tool, idx) => (
                          <span key={idx} className="tool-tag">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedSkill.certifications.length > 0 && (
                    <div className="mb-4">
                      <h6>Certifications</h6>
                      <ul className="certifications-list">
                        {selectedSkill.certifications.map((cert, idx) => (
                          <li key={idx}>
                            <i className="fas fa-certificate me-2"></i>
                            {cert}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedSkill.achievements.length > 0 && (
                    <div className="mb-4">
                      <h6>Key Achievements</h6>
                      <ul className="achievements-list">
                        {selectedSkill.achievements.map((achievement, idx) => (
                          <li key={idx}>
                            <i className="fas fa-trophy me-2"></i>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
