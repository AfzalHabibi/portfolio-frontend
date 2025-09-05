"use client"

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { 
  fetchSkills, 
  createSkill,
  addSkillItem,
  updateSkillItem,
  deleteSkillItem,
  clearError
} from '../../store/slices/skillSlice'
import { RootState, AppDispatch } from '../../store/store'
import { SkillItem } from '../../types'
import AdminLayout from './AdminLayout'
import CustomModal from '../../components/CustomModal'
import Loader from '../../components/Loader'

interface SkillFormData {
  name: string
  category: string
  keywords: string[]
  proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  experience: string
  description: string
  projects: string[]
  certifications: string[]
  tools_used: string[]
  best_practices: string[]
  achievements: string[]
  version?: string
  methodologies: string[]
  performance_metrics: string[]
  used_in_roles: string[]
  difficulty_handled?: string
  endorsements: string[]
  icon?: string
  color?: string
  isActive?: boolean
  displayOrder?: number
}

const SkillsManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { skills, loading, error, actionLoading } = useSelector((state: RootState) => state.skills)
  
  // Track if initial fetch has been made
  const hasFetchedRef = useRef(false)

  // Modal and editing state
  const [showModal, setShowModal] = useState(false)
  const [editingSkill, setEditingSkill] = useState<{ categoryId: string; item: SkillItem } | null>(null)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  
  // Form data state
  const [formData, setFormData] = useState<SkillFormData>({
    name: '',
    category: '',
    keywords: [],
    proficiency: 'Intermediate',
    experience: '',
    description: '',
    projects: [],
    certifications: [],
    tools_used: [],
    best_practices: [],
    achievements: [],
    version: '',
    methodologies: [],
    performance_metrics: [],
    used_in_roles: [],
    difficulty_handled: '',
    endorsements: [],
    icon: 'fas fa-code',
    color: '#0ea5e9',
    isActive: true,
    displayOrder: 0
  })

  const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

  // Load skills on mount - prevent duplicate calls
  useEffect(() => {
    if (!hasFetchedRef.current && skills.length === 0 && !loading) {
      hasFetchedRef.current = true
      dispatch(fetchSkills(true)) // Include inactive for admin
    }
  }, [dispatch, skills.length, loading])

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  // Get all skills as flat array
  const allSkills = useMemo(() => {
    return skills.flatMap(skill => 
      skill.items.map(item => ({
        ...item,
        categoryName: skill.category,
        categoryId: skill._id || skill.id,
        categoryColor: skill.color || '#0ea5e9',
        categoryIcon: skill.icon || 'fas fa-code'
      }))
    )
  }, [skills])

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = skills.map(skill => skill.category).filter(Boolean)
    return Array.from(new Set(cats))
  }, [skills])

  // Filtered skills for display
  const filteredSkills = useMemo(() => {
    return allSkills.filter((skill) => {
      const matchesSearch = !searchTerm || 
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !selectedCategory || skill.categoryName === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [allSkills, searchTerm, selectedCategory])

  // Memoized stats calculation
  const stats = useMemo(() => ({
    totalSkills: allSkills.length,
    totalCategories: categories.length
  }), [allSkills, categories])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const handleArrayChange = useCallback((index: number, value: string, field: keyof SkillFormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => (i === index ? value : item)),
    }))
  }, [])

  const addArrayItem = useCallback((field: keyof SkillFormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), ""],
    }))
  }, [])

  const removeArrayItem = useCallback((index: number, field: keyof SkillFormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }))
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name.trim() || !formData.category.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      // Find or create category
      let targetCategory = skills.find(skill => skill.category.toLowerCase() === formData.category.toLowerCase())
      
      const skillItemData = {
        name: formData.name,
        keywords: formData.keywords.filter(k => k.trim()),
        proficiency: formData.proficiency,
        experience: formData.experience,
        description: formData.description,
        projects: formData.projects.filter(p => p.trim()),
        certifications: formData.certifications.filter(c => c.trim()),
        tools_used: formData.tools_used.filter(t => t.trim()),
        best_practices: formData.best_practices.filter(b => b.trim()),
        achievements: formData.achievements.filter(a => a.trim()),
        version: formData.version,
        methodologies: formData.methodologies.filter(m => m.trim()),
        performance_metrics: formData.performance_metrics.filter(p => p.trim()),
        used_in_roles: formData.used_in_roles.filter(r => r.trim()),
        difficulty_handled: formData.difficulty_handled,
        endorsements: formData.endorsements.filter(e => e.trim()),
        icon: formData.icon,
        color: formData.color,
        isActive: formData.isActive,
        displayOrder: formData.displayOrder
      }

      if (editingSkill) {
        // Update existing skill
        await dispatch(updateSkillItem({
          categoryId: editingSkill.categoryId,
          itemId: editingSkill.item._id!,
          itemData: skillItemData
        })).unwrap()
        toast.success('Skill updated successfully!')
      } else {
        if (!targetCategory) {
          // Create new category first
          const createSkillAction = await dispatch(createSkill({
            category: formData.category,
            description: `${formData.category} related skills`,
            icon: formData.icon || 'fas fa-code',
            color: formData.color || '#0ea5e9',
            items: []
          }))
          
          if (createSkill.fulfilled.match(createSkillAction)) {
            targetCategory = createSkillAction.payload
          } else {
            throw new Error('Failed to create category')
          }
        }

        // Add skill to category
        if (targetCategory) {
          await dispatch(addSkillItem({
            categoryId: targetCategory._id || targetCategory.id!,
            itemData: skillItemData
          })).unwrap()
          toast.success('Skill added successfully!')
        }
      }

      resetForm()
      setShowModal(false)
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    }
  }, [dispatch, editingSkill, formData, skills])

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      category: '',
      keywords: [],
      proficiency: 'Intermediate',
      experience: '',
      description: '',
      projects: [],
      certifications: [],
      tools_used: [],
      best_practices: [],
      achievements: [],
      version: '',
      methodologies: [],
      performance_metrics: [],
      used_in_roles: [],
      difficulty_handled: '',
      endorsements: [],
      icon: 'fas fa-code',
      color: '#0ea5e9',
      isActive: true,
      displayOrder: 0
    })
    setEditingSkill(null)
  }, [])

  const closeModal = useCallback(() => {
    setShowModal(false)
    resetForm()
  }, [resetForm])

  const handleEdit = useCallback((skill: any) => {
    setEditingSkill({ categoryId: skill.categoryId, item: skill })
    setFormData({
      name: skill.name,
      category: skill.categoryName,
      keywords: skill.keywords || [],
      proficiency: skill.proficiency,
      experience: skill.experience || '',
      description: skill.description || '',
      projects: skill.projects || [],
      certifications: skill.certifications || [],
      tools_used: skill.tools_used || [],
      best_practices: skill.best_practices || [],
      achievements: skill.achievements || [],
      version: skill.version || '',
      methodologies: skill.methodologies || [],
      performance_metrics: skill.performance_metrics || [],
      used_in_roles: skill.used_in_roles || [],
      difficulty_handled: skill.difficulty_handled || '',
      endorsements: skill.endorsements || [],
      icon: skill.icon || skill.categoryIcon,
      color: skill.color || skill.categoryColor,
      isActive: skill.isActive !== false,
      displayOrder: skill.displayOrder || 0
    })
    setShowModal(true)
  }, [])

  const handleDelete = useCallback(async (skill: any) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete "${skill.name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await dispatch(deleteSkillItem({ 
          categoryId: skill.categoryId, 
          itemId: skill._id! 
        })).unwrap()
        toast.success('Skill deleted successfully!')
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Your skill has been deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete skill')
      }
    }
  }, [dispatch])

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case 'Expert': return '#10b981'
      case 'Advanced': return '#3b82f6'
      case 'Intermediate': return '#f59e0b'
      case 'Beginner': return '#ef4444'
      default: return '#6b7280'
    }
  }

  // Render loading state only on initial load
  if (loading && allSkills.length === 0) {
    return (
      <AdminLayout title="Skills Management">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <Loader />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Skills Management">
      <div className="dashboard-content">
        {/* Header Section */}
        <div className="welcome-section">
          <div className="welcome-text">
            <h2>Skills Management</h2>
            <p>Manage your professional skills and expertise</p>
          </div>
          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.totalSkills}</span>
              <span className="stat-label">Total Skills</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">{stats.totalCategories}</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
        </div>

        {/* Add Skill Button */}
        <div className="add-button-container">
          <button 
            className="custom-primary-btn" 
            onClick={() => setShowModal(true)}
            disabled={actionLoading}
            type="button"
          >
            <i className="fas fa-plus me-2"></i>
            Add New Skill
          </button>
        </div>

        {/* Filters Section */}
        <div className="content-card filters-card">
          <div className="filters-container">
            <div className="search-container">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ minWidth: "150px" }}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="items-grid">
          {filteredSkills.length > 0 ? (
            filteredSkills.map((skill) => (
              <SkillCard 
                key={skill._id} 
                skill={skill} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                getProficiencyColor={getProficiencyColor}
                actionLoading={actionLoading}
              />
            ))
          ) : (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <i className="fas fa-code"></i>
              <h4>No Skills Found</h4>
              <p>
                {searchTerm || selectedCategory 
                  ? 'No skills match your current filters.' 
                  : 'Start by adding your first skill.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <CustomModal
          isOpen={showModal}
          onClose={closeModal}
          title={editingSkill ? "Edit Skill" : "Add New Skill"}
          modalSize="modal-lg"
          actions={
            <>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={closeModal}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="custom-primary-btn"
                form="skill-form"
                disabled={actionLoading}
              >
                {actionLoading && <i className="fas fa-spinner fa-spin me-2"></i>}
                {editingSkill ? 'Update Skill' : 'Create Skill'}
              </button>
            </>
          }
        >
          <form id="skill-form" onSubmit={handleSubmit}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Skill Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., JavaScript (ES6+)"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <input
                  type="text"
                  name="category"
                  className="form-input"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Frontend Development"
                  required
                  list="categories"
                />
                <datalist id="categories">
                  {categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Proficiency Level *</label>
                <select
                  name="proficiency"
                  className="form-select"
                  value={formData.proficiency}
                  onChange={handleInputChange}
                  required
                >
                  {proficiencyLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Experience</label>
                <input
                  type="text"
                  name="experience"
                  className="form-input"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="e.g., 3+ years"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                className="form-textarea"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your skill and experience with it"
                rows={3}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Keywords</label>
              <div className="array-input-group">
                {formData.keywords.map((keyword, index) => (
                  <div key={index} className="array-input-item">
                    <input
                      type="text"
                      className="form-input"
                      value={keyword}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'keywords')}
                      placeholder={`Keyword ${index + 1}`}
                    />
                    {formData.keywords.length > 1 && (
                      <button
                        type="button"
                        className="array-remove-btn"
                        onClick={() => removeArrayItem(index, 'keywords')}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="array-add-btn"
                  onClick={() => addArrayItem('keywords')}
                >
                  <i className="fas fa-plus me-2"></i>
                  Add Keyword
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Projects</label>
              <div className="array-input-group">
                {formData.projects.map((project, index) => (
                  <div key={index} className="array-input-item">
                    <input
                      type="text"
                      className="form-input"
                      value={project}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'projects')}
                      placeholder={`Project ${index + 1}`}
                    />
                    {formData.projects.length > 1 && (
                      <button
                        type="button"
                        className="array-remove-btn"
                        onClick={() => removeArrayItem(index, 'projects')}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="array-add-btn"
                  onClick={() => addArrayItem('projects')}
                >
                  <i className="fas fa-plus me-2"></i>
                  Add Project
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tools & Technologies</label>
              <div className="array-input-group">
                {formData.tools_used.map((tool, index) => (
                  <div key={index} className="array-input-item">
                    <input
                      type="text"
                      className="form-input"
                      value={tool}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'tools_used')}
                      placeholder={`Tool ${index + 1}`}
                    />
                    {formData.tools_used.length > 1 && (
                      <button
                        type="button"
                        className="array-remove-btn"
                        onClick={() => removeArrayItem(index, 'tools_used')}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="array-add-btn"
                  onClick={() => addArrayItem('tools_used')}
                >
                  <i className="fas fa-plus me-2"></i>
                  Add Tool
                </button>
              </div>
            </div>
          </form>
        </CustomModal>
      )}
    </AdminLayout>
  )
}

// Memoized Skill Card Component
const SkillCard = React.memo<{
  skill: any
  onEdit: (skill: any) => void
  onDelete: (skill: any) => void
  getProficiencyColor: (proficiency: string) => string
  actionLoading: boolean
}>(({ skill, onEdit, onDelete, getProficiencyColor, actionLoading }) => {
  return (
    <div className="content-card item-card">
      <div className="item-card-header">
        <div className="d-flex align-items-center">
          <div 
            className="skill-icon me-3"
            style={{ color: skill.categoryColor }}
          >
            <i className={skill.categoryIcon}></i>
          </div>
          <div className="flex-grow-1">
            <h3 className="item-card-title">{skill.name}</h3>
            <span className="item-card-category">{skill.categoryName}</span>
          </div>
          <div 
            className="proficiency-badge"
            style={{ backgroundColor: getProficiencyColor(skill.proficiency) }}
          >
            {skill.proficiency}
          </div>
        </div>
      </div>
      
      <div className="item-card-content">
        <p className="item-card-description">
          {skill.description}
        </p>
        
        {skill.experience && (
          <div className="skill-meta">
            <span className="meta-item">
              <i className="fas fa-clock me-1"></i>
              {skill.experience}
            </span>
          </div>
        )}
        
        {skill.keywords && skill.keywords.length > 0 && (
          <div className="skill-keywords">
            {skill.keywords.slice(0, 3).map((keyword: string, index: number) => (
              <span key={index} className="keyword-tag">
                {keyword}
              </span>
            ))}
            {skill.keywords.length > 3 && (
              <span className="keyword-more">
                +{skill.keywords.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="item-card-actions">
        <button 
          className="btn-icon" 
          onClick={() => onEdit(skill)}
          disabled={actionLoading}
          title="Edit Skill"
        >
          <i className="fas fa-edit"></i>
        </button>
        <button 
          className="btn-icon" 
          onClick={() => onDelete(skill)}
          disabled={actionLoading}
          title="Delete Skill"
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  )
})

SkillCard.displayName = 'SkillCard'

export default SkillsManager
