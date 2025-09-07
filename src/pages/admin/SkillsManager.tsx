"use client"

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import {
  fetchSkills,
  createSkillDirect,
  deleteSkillItem,
  clearError
} from '../../store/slices/skillSlice'
import { RootState, AppDispatch } from '../../store/store'
import { DirectSkillData } from '../../services/skillService'
import AdminLayout from './AdminLayout'
import CustomModal from '../../components/CustomModal'
import Loader from '../../components/Loader'
import { Link } from 'react-router-dom'
import { Edit, Trash2 } from 'lucide-react'

interface SkillFormData {
  name: string
  category: string
  keywords: string
  proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  experience: string
  description: string
  projects: string
  certifications: string
  tools_used: string
  best_practices: string
  achievements: string
  icon?: string
  color?: string
}

const SkillsManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { skills, loading, error, actionLoading } = useSelector((state: RootState) => state.skills)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<string | null>(null)
  const [formData, setFormData] = useState<SkillFormData>({
    name: '',
    category: '',
    keywords: '',
    proficiency: 'Beginner',
    experience: '',
    description: '',
    projects: '',
    certifications: '',
    tools_used: '',
    best_practices: '',
    achievements: '',
    icon: '',
    color: '#3B82F6'
  })

  useEffect(() => {
    dispatch(fetchSkills(false))
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      keywords: '',
      proficiency: 'Beginner',
      experience: '',
      description: '',
      projects: '',
      certifications: '',
      tools_used: '',
      best_practices: '',
      achievements: '',
      icon: '',
      color: '#3B82F6'
    })
    setEditingSkill(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const convertFormDataToDirectSkillData = (formData: SkillFormData): DirectSkillData => {
    return {
      name: formData.name,
      category: formData.category,
      keywords: formData.keywords ? formData.keywords.split(',').map(k => k.trim()).filter(k => k) : [],
      proficiency: formData.proficiency,
      experience: formData.experience,
      description: formData.description,
      projects: formData.projects ? formData.projects.split(',').map(p => p.trim()).filter(p => p) : [],
      certifications: formData.certifications ? formData.certifications.split(',').map(c => c.trim()).filter(c => c) : [],
      tools_used: formData.tools_used ? formData.tools_used.split(',').map(t => t.trim()).filter(t => t) : [],
      best_practices: formData.best_practices ? formData.best_practices.split(',').map(b => b.trim()).filter(b => b) : [],
      achievements: formData.achievements ? formData.achievements.split(',').map(a => a.trim()).filter(a => a) : [],
      icon: formData.icon || undefined,
      color: formData.color || undefined
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.category.trim() || !formData.experience.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const skillData = convertFormDataToDirectSkillData(formData)
      const resultAction = await dispatch(createSkillDirect(skillData))

      if (createSkillDirect.fulfilled.match(resultAction)) {
        toast.success('Skill created successfully!')
        closeModal()
        dispatch(fetchSkills(false)) // Refresh the skills list
      } else {
        toast.error('Failed to create skill')
      }
    } catch (error) {
      console.error('Error creating skill:', error)
      toast.error('An error occurred while creating the skill')
    }
  }

  const handleDeleteSkill = async (categoryId: string, itemId: string, skillName: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${skillName}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        const resultAction = await dispatch(deleteSkillItem({ categoryId, itemId }))
        
        if (deleteSkillItem.fulfilled.match(resultAction)) {
          toast.success('Skill deleted successfully!')
          dispatch(fetchSkills(false)) // Refresh the skills list
        } else {
          toast.error('Failed to delete skill')
        }
      } catch (error) {
        console.error('Error deleting skill:', error)
        toast.error('An error occurred while deleting the skill')
      }
    }
  }

  const openModal = (skillId?: string, itemId?: string) => {
    if (skillId && itemId) {
      setEditingSkill(skillId)
      // TODO: Load skill item data for editing when needed
      // Find the specific skill item and populate the form
      const skill = skills.find(s => (s.id || s._id) === skillId)
      const item = skill?.items?.find(i => i._id === itemId)
      if (item) {
        setFormData({
          name: item.name,
          category: skill?.category || '',
          keywords: item.keywords?.join(', ') || '',
          proficiency: item.proficiency,
          experience: item.experience,
          description: item.description,
          projects: item.projects?.join(', ') || '',
          certifications: item.certifications?.join(', ') || '',
          tools_used: item.tools_used?.join(', ') || '',
          best_practices: item.best_practices?.join(', ') || '',
          achievements: item.achievements?.join(', ') || '',
          icon: item.icon || '',
          color: item.color || '#3B82F6'
        })
      }
    } else {
      resetForm()
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    resetForm()
  }

  const renderSkillGrid = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-8">
          <Loader />
        </div>
      )
    }

    const totalSkillItems = skills.reduce((total, skill) => total + (skill.items?.length || 0), 0)

    if (totalSkillItems === 0) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No skills found</h3>
            <p className="mt-2 text-sm text-gray-500">Get started by creating your first skill.</p>
            <div className="mt-6">
              <button
                onClick={() => openModal()}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Skill
              </button>
            </div>
          </div>
        </div>
      )
    }


    return (
      <div className="table-container" >
        <table className="data-table">
          <thead>
            <tr>
              <th>Skill Name</th>
              <th>Category</th>
              <th>Proficiency</th>
              <th>Experience</th>
              <th>
                <div className="action-cell">
                  Actions
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {skills.flatMap((skill) =>
              skill.items?.map((item) => (
                <tr key={`${skill.id || skill._id}-${item._id}`}>
                  <td>{item.name}</td>
                  <td>{skill.category}</td>
                  <td>{item.proficiency}</td>
                  <td>{item.experience}</td>
                  <td>
                    <div className="action-cell">
                      <button
                        onClick={() => openModal(skill.id || skill._id, item._id)}
                        title="Edit"
                        className="edit-button"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        className="delete-button"
                        onClick={() => {
                          const categoryId = skill.id || skill._id
                          const itemId = item._id
                          if (categoryId && itemId) {
                            handleDeleteSkill(categoryId, itemId, item.name)
                          }
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) || []
            )}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <AdminLayout title="Skills Management">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Skills Management</h1>
            <p className="text-gray-600 mt-2">Manage your skills and proficiency levels</p>
          </div>
          <button
            onClick={() => openModal()}
            className="custom-primary-btn"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add New Skill</span>
          </button>
        </div>

        {renderSkillGrid()}

        <CustomModal
          isOpen={isModalOpen}
          onClose={closeModal}
          modalSize='modal-xl'
          title={editingSkill ? "Edit Skill" : "Add New Skill"}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Essential Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="form-label">
                    Skill Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., React.js"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="form-label">
                    Category *
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., Frontend Development"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="proficiency" className="form-label">
                    Proficiency Level *
                  </label>
                  <select
                    id="proficiency"
                    name="proficiency"
                    value={formData.proficiency}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="experience" className="form-label">
                    Experience *
                  </label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., 3 years"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="description" className="form-label">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="form-input"
                  placeholder="Describe your experience with this skill..."
                  required
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Details (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="keywords" className="form-label">
                    Keywords
                  </label>
                  <input
                    type="text"
                    id="keywords"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., JavaScript, Components, Hooks"
                  />
                </div>

                <div>
                  <label htmlFor="projects" className="form-label">
                    Projects
                  </label>
                  <input
                    type="text"
                    id="projects"
                    name="projects"
                    value={formData.projects}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., E-commerce App, Portfolio Website"
                  />
                </div>

                <div>
                  <label htmlFor="certifications" className="form-label">
                    Certifications
                  </label>
                  <input
                    type="text"
                    id="certifications"
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., React Developer Certification"
                  />
                </div>

                <div>
                  <label htmlFor="tools_used" className="form-label">
                    Tools Used
                  </label>
                  <input
                    type="text"
                    id="tools_used"
                    name="tools_used"
                    value={formData.tools_used}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., VS Code, Create React App"
                  />
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Details (Optional)</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="best_practices" className="form-label">
                    Best Practices
                  </label>
                  <input
                    type="text"
                    id="best_practices"
                    name="best_practices"
                    value={formData.best_practices}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., Component Reusability, Performance Optimization"
                  />
                </div>

                <div>
                  <label htmlFor="achievements" className="form-label">
                    Achievements
                  </label>
                  <input
                    type="text"
                    id="achievements"
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., Built 5+ React apps, Led team development"
                  />
                </div>
              </div>
            </div>

            {/* Visual Settings */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Visual Settings (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="icon" className="form-label">
                    Icon URL
                  </label>
                  <input
                    type="text"
                    id="icon"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://example.com/icon.svg"
                  />
                </div>

                <div>
                  <label htmlFor="color" className="form-label">
                    Color
                  </label>
                  <input
                    type="color"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  editingSkill ? 'Update Skill' : 'Create Skill'
                )}
              </button>
            </div>
          </form>
        </CustomModal>
      </div>
    </AdminLayout>
  )
}

export default SkillsManager
