"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { RootState, AppDispatch } from '../../store/store'
import { 
  fetchProjects, 
  createProject, 
  createProjectWithFiles,
  updateProjectById, 
  updateProjectWithFiles,
  deleteProjectById,
  clearError,
  clearSelectedProject
} from '../../store/slices/projectSlice'
import { Project } from '../../types'
import { CreateProjectData, CreateProjectWithFilesData, UpdateProjectWithFilesData } from '../../services/projectService'
import AdminLayout from './AdminLayout'
import CustomModal from '../../components/CustomModal'
import ImageUpload from '../../components/ImageUpload'
import ImageGallery from '../../components/ImageGallery'
import Loader from '../../components/Loader'
import '../../styles/imageUpload.css'
import '../../styles/imageGallery.css'

const Projects: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { projects, loading, error, actionLoading } = useSelector((state: RootState) => state.projects)

  // Modal and editing state
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  
  // Form data state
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

  // Image handling state
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([])
  const [videoFiles, setVideoFiles] = useState<File[]>([])
  const [useFileUpload, setUseFileUpload] = useState(false)
  
  // Existing images for editing
  const [existingMainImage, setExistingMainImage] = useState<string>("")
  const [existingImages, setExistingImages] = useState<Array<{id: string, url: string, name?: string}>>([])
  const [existingVideos, setExistingVideos] = useState<Array<{id: string, url: string, name?: string}>>([])

  const categories = ["Web Development", "Mobile Development", "Desktop Application", "UI/UX Design", "Other"]

  // Load projects on component mount - prevent duplicate calls
  useEffect(() => {
    if (projects.length === 0 && !loading) {
      dispatch(fetchProjects())
    }
  }, [dispatch, projects.length, loading])

  // Handle errors with toast notifications
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  // Memoized filtered projects to prevent unnecessary recalculations
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = !searchTerm || 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !selectedCategory || project.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [projects, searchTerm, selectedCategory])

  // Memoized stats calculation
  const stats = useMemo(() => ({
    totalProjects: projects.length,
    totalCategories: new Set(projects.map(p => p.category)).size
  }), [projects])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const handleArrayChange = useCallback((index: number, value: string, field: 'features' | 'technologies') => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }, [])

  const addArrayItem = useCallback((field: 'features' | 'technologies') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }, [])

  const removeArrayItem = useCallback((index: number, field: 'features' | 'technologies') => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }, [])

  // Image handling functions
  const handleMainImageChange = useCallback((files: File[], existingImages: Array<{id: string, url: string, name?: string}>) => {
    setMainImageFile(files[0] || null)
  }, [])

  const handleAdditionalImagesChange = useCallback((files: File[], existingImages: Array<{id: string, url: string, name?: string}>) => {
    setAdditionalImageFiles(files)
    setExistingImages(existingImages)
  }, [])

  const handleVideosChange = useCallback((files: File[], existingVideos: Array<{id: string, url: string, name?: string}>) => {
    setVideoFiles(files)
    setExistingVideos(existingVideos)
  }, [])

  const resetImageStates = useCallback(() => {
    setMainImageFile(null)
    setAdditionalImageFiles([])
    setVideoFiles([])
    setExistingMainImage("")
    setExistingImages([])
    setExistingVideos([])
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validate main image
    if (useFileUpload && !mainImageFile && !existingMainImage && !editingProject?.mainImage) {
      toast.error('Please provide a main image')
      return
    } else if (!useFileUpload && !formData.mainImage.trim()) {
      toast.error('Please provide a main image URL')
      return
    }

    try {
      if (useFileUpload) {
        // Handle file uploads
        if (editingProject) {
          // Update with files
          const updateData: UpdateProjectWithFilesData = {
            title: formData.title,
            description: formData.description,
            longDescription: formData.longDescription,
            features: formData.features.filter(f => f.trim()),
            technologies: formData.technologies.filter(t => t.trim()),
            category: formData.category,
            completedDate: formData.completedDate,
            demoUrl: formData.demoUrl,
            githubUrl: formData.githubUrl,
            clientRemarks: formData.clientRemarks,
            existingImages: existingImages.map(img => img.url),
            existingVideos: existingVideos.map(vid => vid.url)
          }

          if (mainImageFile) {
            updateData.mainImage = mainImageFile
          }
          if (additionalImageFiles.length > 0) {
            updateData.images = additionalImageFiles
          }
          if (videoFiles.length > 0) {
            updateData.videos = videoFiles
          }

          await dispatch(updateProjectWithFiles({ 
            id: editingProject.id, 
            projectData: updateData 
          })).unwrap()
          toast.success('Project updated successfully!')
        } else {
          // Create with files
          if (!mainImageFile) {
            toast.error('Please provide a main image file')
            return
          }

          const createData: CreateProjectWithFilesData = {
            title: formData.title,
            description: formData.description,
            longDescription: formData.longDescription,
            features: formData.features.filter(f => f.trim()),
            technologies: formData.technologies.filter(t => t.trim()),
            category: formData.category,
            completedDate: formData.completedDate,
            demoUrl: formData.demoUrl,
            githubUrl: formData.githubUrl,
            clientRemarks: formData.clientRemarks,
            mainImage: mainImageFile
          }

          if (additionalImageFiles.length > 0) {
            createData.images = additionalImageFiles
          }
          if (videoFiles.length > 0) {
            createData.videos = videoFiles
          }

          await dispatch(createProjectWithFiles(createData)).unwrap()
          toast.success('Project created successfully!')
        }
      } else {
        // Handle URL inputs
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
      }

      resetForm()
      setShowModal(false)
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    }
  }, [dispatch, editingProject, formData, useFileUpload, mainImageFile, additionalImageFiles, videoFiles, existingMainImage, existingImages, existingVideos])

  const resetForm = useCallback(() => {
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
    resetImageStates()
    setUseFileUpload(false)
  }, [resetImageStates])

  const closeModal = useCallback(() => {
    setShowModal(false)
    resetForm()
  }, [resetForm])

  const handleEdit = useCallback((project: Project) => {
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
    
    // Set existing images for file upload mode
    setExistingMainImage(project.mainImage || "")
    setExistingImages(
      project.images?.map((url, index) => ({
        id: `existing-${index}`,
        url,
        name: `Image ${index + 1}`
      })) || []
    )
    setExistingVideos(
      project.videos?.map((url, index) => ({
        id: `existing-video-${index}`,
        url,
        name: `Video ${index + 1}`
      })) || []
    )
    
    setShowModal(true)
  }, [])

  const handleDelete = useCallback(async (id: string, title: string) => {
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
  }, [dispatch])

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }, [])

  // Render loading state only on initial load
  if (loading && projects.length === 0) {
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
              <span className="stat-number">{stats.totalProjects}</span>
              <span className="stat-label">Total Projects</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">{stats.totalCategories}</span>
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
            type="button"
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
              <ProjectCard 
                key={project.id} 
                project={project} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                formatDate={formatDate}
                actionLoading={actionLoading}
              />
            ))
          ) : (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <i className="fas fa-folder-open"></i>
              <h4>No Projects Found</h4>
              <p>
                {searchTerm || selectedCategory 
                  ? 'No projects match your current filters.' 
                  : 'Start by adding your first project.'}
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
          title={editingProject ? "Edit Project" : "Add New Project"}
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
                form="project-form"
                disabled={actionLoading}
              >
                {actionLoading && <i className="fas fa-spinner fa-spin me-2"></i>}
                {editingProject ? 'Update Project' : 'Create Project'}
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
                  className="form-input"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter project title"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
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
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                className="form-textarea"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the project"
                rows={3}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Long Description</label>
              <textarea
                name="longDescription"
                className="form-textarea"
                value={formData.longDescription}
                onChange={handleInputChange}
                placeholder="Detailed description of the project"
                rows={4}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Completed Date</label>
                <input
                  type="date"
                  name="completedDate"
                  className="form-input"
                  value={formData.completedDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Image Upload Method</label>
                <div className="upload-method-toggle">
                  <label className="toggle-option">
                    <input
                      type="radio"
                      name="uploadMethod"
                      checked={!useFileUpload}
                      onChange={() => setUseFileUpload(false)}
                    />
                    <span>Image URLs</span>
                  </label>
                  <label className="toggle-option">
                    <input
                      type="radio"
                      name="uploadMethod"
                      checked={useFileUpload}
                      onChange={() => setUseFileUpload(true)}
                    />
                    <span>File Upload</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            {useFileUpload ? (
              <div className="image-upload-section">
                {/* Main Image Upload */}
                <ImageUpload
                  label="Main Image"
                  multiple={false}
                  maxFiles={1}
                  maxFileSize={10}
                  existingImages={existingMainImage ? [{
                    id: 'main-existing',
                    url: existingMainImage,
                    name: 'Main Image'
                  }] : []}
                  onImagesChange={handleMainImageChange}
                  required={!editingProject}
                  className="main-image-upload"
                />

                {/* Additional Images Upload */}
                <ImageUpload
                  label="Additional Images"
                  multiple={true}
                  maxFiles={10}
                  maxFileSize={10}
                  existingImages={existingImages}
                  onImagesChange={handleAdditionalImagesChange}
                  className="additional-images-upload"
                />

                {/* Videos Upload */}
                <ImageUpload
                  label="Project Videos"
                  multiple={true}
                  maxFiles={5}
                  maxFileSize={50}
                  acceptedFormats={['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm']}
                  existingImages={existingVideos}
                  onImagesChange={handleVideosChange}
                  className="videos-upload"
                />
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Main Image URL *</label>
                <input
                  type="url"
                  name="mainImage"
                  className="form-input"
                  value={formData.mainImage}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
            )}

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Demo URL</label>
                <input
                  type="url"
                  name="demoUrl"
                  className="form-input"
                  value={formData.demoUrl}
                  onChange={handleInputChange}
                  placeholder="https://demo.example.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">GitHub URL</label>
                <input
                  type="url"
                  name="githubUrl"
                  className="form-input"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Features</label>
              <div className="array-input-group">
                {formData.features.map((feature, index) => (
                  <div key={index} className="array-input-item">
                    <input
                      type="text"
                      className="form-input"
                      value={feature}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'features')}
                      placeholder={`Feature ${index + 1}`}
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        className="array-remove-btn"
                        onClick={() => removeArrayItem(index, 'features')}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="array-add-btn"
                  onClick={() => addArrayItem('features')}
                >
                  <i className="fas fa-plus me-2"></i>
                  Add Feature
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
                      className="form-input"
                      value={tech}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'technologies')}
                      placeholder={`Technology ${index + 1}`}
                    />
                    {formData.technologies.length > 1 && (
                      <button
                        type="button"
                        className="array-remove-btn"
                        onClick={() => removeArrayItem(index, 'technologies')}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="array-add-btn"
                  onClick={() => addArrayItem('technologies')}
                >
                  <i className="fas fa-plus me-2"></i>
                  Add Technology
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Client Remarks</label>
              <textarea
                name="clientRemarks"
                className="form-textarea"
                value={formData.clientRemarks}
                onChange={handleInputChange}
                placeholder="Any remarks or feedback from client"
                rows={3}
              />
            </div>
          </form>
        </CustomModal>
      )}
    </AdminLayout>
  )
}

// Memoized Project Card Component to prevent unnecessary re-renders
const ProjectCard = React.memo<{
  project: Project
  onEdit: (project: Project) => void
  onDelete: (id: string, title: string) => void
  formatDate: (date: string) => string
  actionLoading: boolean
}>(({ project, onEdit, onDelete, formatDate, actionLoading }) => {
  // Prepare gallery images
  const galleryImages = React.useMemo(() => {
    const images = [];
    
    // Add main image
    if (project.mainImage) {
      images.push({
        id: 'main',
        url: project.mainImage,
        name: 'Main Image',
        type: 'image' as const
      });
    }
    
    // Add additional images
    if (project.images && project.images.length > 0) {
      project.images.forEach((url, index) => {
        images.push({
          id: `image-${index}`,
          url,
          name: `Image ${index + 1}`,
          type: 'image' as const
        });
      });
    }
    
    // Add videos
    if (project.videos && project.videos.length > 0) {
      project.videos.forEach((url, index) => {
        images.push({
          id: `video-${index}`,
          url,
          name: `Video ${index + 1}`,
          type: 'video' as const
        });
      });
    }
    
    return images;
  }, [project.mainImage, project.images, project.videos]);

  return (
    <div className="content-card item-card">
      <div className="item-card-image">
        <img
          src={project.mainImage || ""}
          alt={project.title}
        />
        <div className="project-overlay">
          <button 
            className="btn-icon" 
            onClick={() => onEdit(project)}
            disabled={actionLoading}
            title="Edit Project"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button 
            className="btn-icon" 
            onClick={() => onDelete(project.id, project.title)}
            disabled={actionLoading}
            title="Delete Project"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
        
        {/* Image count badge */}
        {galleryImages.length > 1 && (
          <div className="image-count-badge">
            <i className="fas fa-images"></i>
            {galleryImages.length}
          </div>
        )}
      </div>
      
      <div className="item-card-content">
        <div className="project-header">
          <h3 className="item-card-title">{project.title}</h3>
          <span className="item-card-category">{project.category}</span>
        </div>
        
        <p className="item-card-description">
          {project.description}
        </p>
        
        <div className="project-tech-tags">
          {project.technologies?.slice(0, 3).map((tech, index) => (
            <span key={index} className="tech-tag">
              {tech}
            </span>
          ))}
          {project.technologies && project.technologies.length > 3 && (
            <span className="tech-more">
              +{project.technologies.length - 3} more
            </span>
          )}
        </div>
        
        <div className="item-card-actions">
          <div className="item-card-meta">
            <div className="meta-item">
              <i className="fas fa-calendar"></i>
              {formatDate(project.completedDate)}
            </div>
            {project.demoUrl && (
              <div className="meta-item">
                <i className="fas fa-external-link-alt"></i>
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  Demo
                </a>
              </div>
            )}
            {project.githubUrl && (
              <div className="meta-item">
                <i className="fab fa-github"></i>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  Code
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
})

ProjectCard.displayName = 'ProjectCard'

export default Projects
