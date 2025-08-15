"use client"

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { RootState, AppDispatch } from '../../store/store'
import { 
  fetchProjects, 
  createProject, 
  updateProjectById, 
  deleteProjectById,
  clearError,
  clearSelectedProject
} from '../../store/slices/projectSlice'
import { Project } from '../../types'
import { CreateProjectData } from '../../services/projectService'
import AdminLayout from './AdminLayout'
import CustomModal from '../../components/CustomModal'
import Loader from '../../components/Loader'

const Projects: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { projects, loading, error, actionLoading } = useSelector((state: RootState) => state.projects)

  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [formData, setFormData] = useState<CreateProjectData>({
    title: "",
    description: "",
    longDescription: "",
    features: [""],
    technologies: [""],
    category: "",
    completedDate: "",
    demoUrl: "",
    githubUrl: "",
    clientRemarks: "",
    mainImage: "",
    images: [],
    videos: []
  })

  const categories = ["Web Development", "Mobile Development", "Desktop Application", "UI/UX Design", "Other"]

  // Load projects on component mount
  useEffect(() => {
    dispatch(fetchProjects())
  }, [dispatch])

  // Handle errors with toast notifications
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "" || project.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleArrayChange = (index: number, value: string, field: 'features' | 'technologies') => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const addArrayItem = (field: 'features' | 'technologies') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const removeArrayItem = (index: number, field: 'features' | 'technologies') => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const projectData: CreateProjectData = {
        ...formData,
        features: formData.features.filter(f => f.trim()),
        technologies: formData.technologies.filter(t => t.trim()),
      }

      if (editingProject) {
        await dispatch(updateProjectById({ 
          id: editingProject.id, 
          projectData 
        })).unwrap()
        toast.success('Project updated successfully!')
      } else {
        await dispatch(createProject(projectData)).unwrap()
        toast.success('Project created successfully!')
      }

      resetForm()
      setShowModal(false)
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      longDescription: "",
      features: [""],
      technologies: [""],
      category: "",
      completedDate: "",
      demoUrl: "",
      githubUrl: "",
      clientRemarks: "",
      mainImage: "",
      images: [],
      videos: []
    })
    setEditingProject(null)
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription,
      features: project.features?.length ? project.features : [""],
      technologies: project.technologies?.length ? project.technologies : [""],
      category: project.category,
      completedDate: project.completedDate,
      demoUrl: project.demoUrl || "",
      githubUrl: project.githubUrl || "",
      clientRemarks: project.clientRemarks || "",
      mainImage: project.mainImage || "",
      images: project.images || [],
      videos: project.videos || []
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete "${title}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await dispatch(deleteProjectById(id)).unwrap()
        toast.success('Project deleted successfully!')
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Your project has been deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete project')
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <AdminLayout title="Projects Management">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <Loader />
        </div>
      </AdminLayout>
    )
  }
  return (
    <AdminLayout title="Projects Management">
      <div className="dashboard-content">
        {/* Header Section */}
        <div className="welcome-section">
          <div className="welcome-text">
            <h2>Projects Management</h2>
            <p>Manage your portfolio projects and showcase your work</p>
          </div>
          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-number">{projects.length}</span>
              <span className="stat-label">Total Projects</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">{new Set(projects.map(p => p.category)).size}</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
        </div>

        {/* Add Project Button */}
        <div className="add-button-container">
          <button 
            className="custom-primary-btn" 
            onClick={() => setShowModal(true)}
            disabled={actionLoading}
          >
            <i className="fas fa-plus me-2"></i>
            Add New Project
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
                placeholder="Search projects..."
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

        {/* Projects Grid */}
        <div className="items-grid">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div key={project.id} className="content-card item-card">
                <div className="item-card-image">
                  <img
                    src={project.mainImage || "/placeholder.svg"}
                    alt={project.title}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                  <div className="project-overlay">
                    <button 
                      className="custom-primary-btn btn-sm" 
                      onClick={() => handleEdit(project)}
                      disabled={actionLoading}
                      title="Edit Project"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="custom-btn-danger btn-sm" 
                      onClick={() => handleDelete(project.id, project.title)}
                      disabled={actionLoading}
                      title="Delete Project"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-info btn-sm"
                        title="View Demo"
                      >
                        <i className="fas fa-external-link-alt"></i>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-dark btn-sm"
                        title="View Code"
                      >
                        <i className="fab fa-github"></i>
                      </a>
                    )}
                  </div>
                </div>
                <div className="item-card-content">
                  <div className="project-header">
                    <h3 className="item-card-title">{project.title}</h3>
                    <span className="item-card-category">{project.category}</span>
                  </div>
                  <p className="item-card-description">
                    {project.description.length > 120
                      ? `${project.description.substring(0, 120)}...`
                      : project.description}
                  </p>
                  <div className="project-tech-tags">
                    {project.technologies?.slice(0, 3).map((tech, index) => (
                      <span key={index} className="badge bg-secondary me-1 mb-1">
                        {tech}
                      </span>
                    ))}
                    {project.technologies?.length > 3 && (
                      <span className="badge bg-light text-dark">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="item-card-meta">
                    <div className="meta-item">
                      <i className="fas fa-calendar me-1"></i>
                      {formatDate(project.completedDate)}
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-list me-1"></i>
                      {project.features?.length || 0} features
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
              <i className="fas fa-folder-open"></i>
              <h3>No Projects Found</h3>
              <p>
                {searchTerm || selectedCategory
                  ? "No projects match your current filters."
                  : "Create your first project to get started."}
              </p>
              <button className="custom-primary-btn" onClick={() => setShowModal(true)}>
                <i className="fas fa-plus me-2"></i>
                Add New Project
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        <CustomModal
          isOpen={showModal}
          onClose={closeModal}
          title={editingProject ? "Edit Project" : "Add New Project"}
          modalSize="modal-xl"
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
                form="project-form"
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    {editingProject ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  editingProject ? "Update Project" : "Create Project"
                )}
              </button>
            </>
          }
        >
          <form id="project-form" onSubmit={handleSubmit}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., E-commerce Platform"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="form-select"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Short Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={2}
                placeholder="Brief description of the project..."
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Long Description</label>
              <textarea
                name="longDescription"
                value={formData.longDescription}
                onChange={handleInputChange}
                rows={4}
                placeholder="Detailed description of the project..."
                className="form-textarea"
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Features</label>
                <div className="array-input-group">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="array-input-item">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleArrayChange(index, e.target.value, 'features')}
                        placeholder="Feature name"
                        className="form-input"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem(index, 'features')}
                          className="array-remove-btn"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('features')}
                    className="array-add-btn"
                  >
                    <i className="fas fa-plus me-2"></i>Add Feature
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Technologies</label>
                <div className="array-input-group">
                  {formData.technologies.map((tech, index) => (
                    <div key={index} className="array-input-item">
                      <input
                        type="text"
                        value={tech}
                        onChange={(e) => handleArrayChange(index, e.target.value, 'technologies')}
                        placeholder="Technology name"
                        className="form-input"
                      />
                      {formData.technologies.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem(index, 'technologies')}
                          className="array-remove-btn"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('technologies')}
                    className="array-add-btn"
                  >
                    <i className="fas fa-plus me-2"></i>Add Technology
                  </button>
                </div>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Demo URL</label>
                <input
                  type="url"
                  name="demoUrl"
                  value={formData.demoUrl}
                  onChange={handleInputChange}
                  placeholder="https://demo.example.com"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">GitHub URL</label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  placeholder="https://github.com/user/repo"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Completed Date</label>
                <input
                  type="date"
                  name="completedDate"
                  value={formData.completedDate}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Main Image URL</label>
                <input
                  type="url"
                  name="mainImage"
                  value={formData.mainImage}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Client Remarks</label>
              <textarea
                name="clientRemarks"
                value={formData.clientRemarks}
                onChange={handleInputChange}
                rows={3}
                placeholder="Any additional remarks or notes..."
                className="form-textarea"
              />
            </div>
          </form>
        </CustomModal>
      </div>
    </AdminLayout>
  )
}

export default Projects
