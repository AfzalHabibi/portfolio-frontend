"use client"

import type React from "react"
import { useEffect, useRef, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { AppDispatch, RootState } from "../store/store"
import { fetchSkills } from "../store/slices/skillSlice"
import type { SkillItem } from "../types"

interface SkillItemWithCategory extends SkillItem {
  categoryInfo: {
    name: string
    color: string
    icon: string
    categoryId: string
  }
}

const FeaturedSkillsComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { skills, loading, error } = useSelector((state: RootState) => state.skills)
  
  const hasFetchedRef = useRef(false)

  useEffect(() => {
    if (!hasFetchedRef.current && skills.length === 0 && !loading) {
      hasFetchedRef.current = true
      dispatch(fetchSkills(false))
    }
  }, [dispatch, skills.length, loading])

  // Get featured skills only
  const featuredSkills = useMemo((): SkillItemWithCategory[] => {
    return skills
      .filter(skill => skill.isFeatured)
      .flatMap(skill => 
        skill.items
          .filter(item => item.isActive !== false)
          .slice(0, 2) // Limit to 2 items per featured category
          .map(item => ({
            ...item,
            categoryInfo: {
              name: skill.category,
              color: skill.color || '#0ea5e9',
              icon: skill.icon || 'fas fa-code',
              categoryId: skill._id || skill.id || ''
            }
          }))
      )
      .slice(0, 6) // Show max 6 featured skills on home
  }, [skills])

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

  if (loading) {
    return (
      <div className="skills-loading">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading skills...</span>
          </div>
          <p className="mt-3 text-muted">Loading featured skills...</p>
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

  if (featuredSkills.length === 0) {
    return (
      <div className="no-skills">
        <div className="text-center py-5">
          <i className="fas fa-star fa-3x text-muted mb-3"></i>
          <h5>No featured skills</h5>
          <p className="text-muted">No featured skills available at the moment</p>
        </div>
      </div>
    )
  }

  return (
    <div className="featured-skills-component">
      {/* Featured Skills Grid */}
      <div className="skills-grid">
        {featuredSkills.map((skill, index) => (
          <div 
            key={skill._id || index} 
            className="skill-card featured"
            style={{ '--delay': index * 0.1 } as React.CSSProperties}
          >
            <div className="skill-card-inner">
              {/* Skill Header */}
              <div className="skill-header">
                <div className="skill-icon" style={{ backgroundColor: skill.categoryInfo.color + '20', borderColor: skill.categoryInfo.color }}>
                  <i className={skill.icon || skill.categoryInfo.icon} style={{ color: skill.categoryInfo.color }}></i>
                </div>
                <div className="skill-title">
                  <h6>{skill.name}</h6>
                  <span className="skill-category" style={{ color: skill.categoryInfo.color }}>
                    {skill.categoryInfo.name}
                  </span>
                </div>
              </div>

              {/* Proficiency Section */}
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
                      background: `linear-gradient(90deg, ${getProficiencyColor(skill.proficiency)}, ${skill.categoryInfo.color})`
                    }}
                  ></div>
                </div>
              </div>

              {/* Description */}
              <p className="skill-description">
                {skill.description}
              </p>

              {/* Keywords */}
              <div className="skill-keywords">
                {skill.keywords.slice(0, 3).map((keyword, idx) => (
                  <span key={idx} className="keyword-tag" style={{ backgroundColor: skill.categoryInfo.color }}>
                    {keyword}
                  </span>
                ))}
                {skill.keywords.length > 3 && (
                  <span className="keyword-tag more">+{skill.keywords.length - 3}</span>
                )}
              </div>

              {/* Skill Actions */}
              <div className="skill-actions">
                <Link 
                  to={`/skills/${skill.categoryInfo.categoryId}`}
                  className="btn-skill-details"
                  style={{ backgroundColor: skill.categoryInfo.color }}
                >
                  <i className="fas fa-arrow-right"></i>
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Skills Button */}
      <div className="text-center mt-5">
        <Link to="/skills" className="btn-primary-custom">
          <i className="fas fa-list-alt me-2"></i>
          View All Skills
        </Link>
      </div>

      {/* Skills Summary for Featured */}
      {/* <div className="skills-summary mt-4">
        <div className="row">
          <div className="col-md-3 mb-3">
            <div className="summary-card">
              <h4>{skills.filter(s => s.isFeatured).length}</h4>
              <p>Featured Categories</p>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="summary-card">
              <h4>{featuredSkills.filter(s => s.proficiency === 'Expert').length}</h4>
              <p>Expert Level</p>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="summary-card">
              <h4>{featuredSkills.filter(s => s.proficiency === 'Advanced').length}</h4>
              <p>Advanced Level</p>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="summary-card">
              <h4>{Math.round(featuredSkills.reduce((acc, skill) => {
                const years = parseFloat(skill.experience.replace(/[^\d.]/g, '')) || 0
                return acc + years
              }, 0) / featuredSkills.length)}</h4>
              <p>Avg. Experience</p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default FeaturedSkillsComponent
