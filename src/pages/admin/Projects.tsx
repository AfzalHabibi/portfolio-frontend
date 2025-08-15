import React, { useState, useEffect } from 'react';
import { useAuth, useProjects } from '../../hooks/useApi';
import { CreateProjectWithFilesData } from '../../services/projectService';
import { Project } from '../../types';
import AdminLayout from './AdminLayout';

interface ProjectFormData {
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  technologies: string[];
  category: string;
  completedDate: string;
  demoUrl: string;
  githubUrl: string;
  clientRemarks: string;
  mainImage: File | null;
  images: File[];
  videos: File[];
}

const Projects: React.FC = () => {
  const {
    projects,
    loading,
    actionLoading,
    error,
    loadProjects,
    addProjectWithFiles,
    editProject,
    removeProject,
    clearProjectError,
  } = useProjects();

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    longDescription: '',
    features: [''],
    technologies: [''],
    category: '',
    completedDate: '',
    demoUrl: '',
    githubUrl: '',
    clientRemarks: '',
    mainImage: null,
    images: [],
    videos: [],
  });

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearProjectError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearProjectError]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      longDescription: '',
      features: [''],
      technologies: [''],
      category: '',
      completedDate: '',
      demoUrl: '',
      githubUrl: '',
      clientRemarks: '',
      mainImage: null,
      images: [],
      videos: [],
    });
    setEditingProject(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files) return;

    if (name === 'mainImage') {
      setFormData(prev => ({
        ...prev,
        mainImage: files[0] || null,
      }));
    } else if (name === 'images') {
      setFormData(prev => ({
        ...prev,
        images: Array.from(files),
      }));
    } else if (name === 'videos') {
      setFormData(prev => ({
        ...prev,
        videos: Array.from(files),
      }));
    }
  };

  const handleArrayChange = (index: number, value: string, field: 'features' | 'technologies') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item),
    }));
  };

  const addArrayItem = (field: 'features' | 'technologies') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (index: number, field: 'features' | 'technologies') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription,
      features: project.features || [''],
      technologies: project.technologies || [''],
      category: project.category,
      completedDate: project.completedDate,
      demoUrl: project.demoUrl || '',
      githubUrl: project.githubUrl || '',
      clientRemarks: project.clientRemarks || '',
      mainImage: null,
      images: [],
      videos: [],
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingProject && !formData.mainImage) {
      alert('Please select a main image');
      return;
    }

    const projectData: CreateProjectWithFilesData = {
      title: formData.title,
      description: formData.description,
      longDescription: formData.longDescription,
      features: formData.features.filter(f => f.trim() !== ''),
      technologies: formData.technologies.filter(t => t.trim() !== ''),
      category: formData.category,
      completedDate: formData.completedDate,
      demoUrl: formData.demoUrl,
      githubUrl: formData.githubUrl,
      clientRemarks: formData.clientRemarks,
      mainImage: formData.mainImage!,
      images: formData.images,
      videos: formData.videos,
    };

    try {
      if (editingProject) {
        const updateData = {
          title: formData.title,
          description: formData.description,
          longDescription: formData.longDescription,
          features: formData.features.filter(f => f.trim() !== ''),
          technologies: formData.technologies.filter(t => t.trim() !== ''),
          category: formData.category,
          completedDate: formData.completedDate,
          demoUrl: formData.demoUrl,
          githubUrl: formData.githubUrl,
          clientRemarks: formData.clientRemarks,
        };
        await editProject(editingProject.id, updateData);
      } else {
        await addProjectWithFiles(projectData);
      }
      setShowModal(false);
      resetForm();
      loadProjects();
    } catch (err) {
      console.error('Error saving project:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await removeProject(id);
        loadProjects();
      } catch (err) {
        console.error('Error deleting project:', err);
      }
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(projects.map(p => p.category)));

  return (
    <AdminLayout title="Projects Management">
      <div className="projects-manager">
        {/* Error Alert */}
        {error && (
          <div className="alert alert-error">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
            <button className="alert-close" onClick={clearProjectError}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {/* Header Actions */}
        <div className="content-header">
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-project-diagram"></i>
              </div>
              <div className="stat-info">
                <h3>{projects.length}</h3>
                <p>Total Projects</p>
              </div>
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <i className="fas fa-plus"></i>
            Add New Project
          </button>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading projects...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-image">
                  <img src={project.mainImage || "/placeholder.svg?height=200&width=350"} alt={project.title} />
                  <div className="project-overlay">
                    <div className="project-actions">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => handleEdit(project)}
                        title="Edit Project"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(project.id)}
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
                          className="btn-icon btn-view"
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
                          className="btn-icon btn-github"
                          title="View Code"
                        >
                          <i className="fab fa-github"></i>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="project-content">
                  <div className="project-header">
                    <h3>{project.title}</h3>
                    <span className="project-category">{project.category}</span>
                  </div>
                  <p className="project-description">
                    {project.description.length > 120 
                      ? `${project.description.substring(0, 120)}...` 
                      : project.description}
                  </p>
                  <div className="project-technologies">
                    {project.technologies?.slice(0, 3).map((tech, index) => (
                      <span key={index} className="tech-tag">{tech}</span>
                    ))}
                    {project.technologies && project.technologies.length > 3 && (
                      <span className="tech-more">+{project.technologies.length - 3} more</span>
                    )}
                  </div>
                  <div className="project-footer">
                    <span className="project-date">
                      <i className="fas fa-calendar"></i>
                      {new Date(project.completedDate).toLocaleDateString()}
                    </span>
                    <div className="project-stats">
                      {project.features && (
                        <span title="Features">
                          <i className="fas fa-list"></i>
                          {project.features.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <i className="fas fa-folder-open"></i>
              <h3>No Projects Found</h3>
              <p>
                {searchTerm || selectedCategory 
                  ? "No projects match your current filters." 
                  : "Create your first project to get started."}
              </p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
              >
                <i className="fas fa-plus"></i>
                Add New Project
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Project Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
              resetForm();
            }
          }}>
            <div className="modal-content project-modal">
              <div className="modal-header">
                <h2>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
                <button
                  className="modal-close"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="project-form">
                <div className="modal-body">
                  {/* Basic Information */}
                  <div className="form-section">
                    <h3>Basic Information</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Project Title *</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Enter project title"
                          required
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
                          <option value="Web Development">Web Development</option>
                          <option value="Mobile Development">Mobile Development</option>
                          <option value="Desktop Application">Desktop Application</option>
                          <option value="UI/UX Design">UI/UX Design</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Short Description *</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Brief description of the project"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Detailed Description *</label>
                      <textarea
                        name="longDescription"
                        value={formData.longDescription}
                        onChange={handleInputChange}
                        placeholder="Detailed project description"
                        rows={5}
                        required
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div className="form-section">
                    <h3>Features</h3>
                    <div className="array-inputs">
                      {formData.features.map((feature, index) => (
                        <div key={index} className="array-input">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => handleArrayChange(index, e.target.value, 'features')}
                            placeholder="Enter feature"
                          />
                          <button
                            type="button"
                            className="btn-remove"
                            onClick={() => removeArrayItem(index, 'features')}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn-add"
                        onClick={() => addArrayItem('features')}
                      >
                        <i className="fas fa-plus"></i>
                        Add Feature
                      </button>
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="form-section">
                    <h3>Technologies</h3>
                    <div className="array-inputs">
                      {formData.technologies.map((tech, index) => (
                        <div key={index} className="array-input">
                          <input
                            type="text"
                            value={tech}
                            onChange={(e) => handleArrayChange(index, e.target.value, 'technologies')}
                            placeholder="Enter technology"
                          />
                          <button
                            type="button"
                            className="btn-remove"
                            onClick={() => removeArrayItem(index, 'technologies')}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn-add"
                        onClick={() => addArrayItem('technologies')}
                      >
                        <i className="fas fa-plus"></i>
                        Add Technology
                      </button>
                    </div>
                  </div>

                  {/* URLs and Date */}
                  <div className="form-section">
                    <h3>Links & Timeline</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Demo URL</label>
                        <input
                          type="url"
                          name="demoUrl"
                          value={formData.demoUrl}
                          onChange={handleInputChange}
                          placeholder="https://demo-url.com"
                        />
                      </div>
                      <div className="form-group">
                        <label>GitHub URL</label>
                        <input
                          type="url"
                          name="githubUrl"
                          value={formData.githubUrl}
                          onChange={handleInputChange}
                          placeholder="https://github.com/username/repo"
                        />
                      </div>
                      <div className="form-group">
                        <label>Completion Date *</label>
                        <input
                          type="date"
                          name="completedDate"
                          value={formData.completedDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Client Remarks */}
                  <div className="form-section">
                    <h3>Additional Information</h3>
                    <div className="form-group">
                      <label>Client Remarks</label>
                      <textarea
                        name="clientRemarks"
                        value={formData.clientRemarks}
                        onChange={handleInputChange}
                        placeholder="Client feedback or additional notes"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* File Uploads */}
                  <div className="form-section">
                    <h3>Media Files</h3>
                    <div className="form-group">
                      <label>Main Image * {editingProject && "(Leave empty to keep current image)"}</label>
                      <input
                        type="file"
                        name="mainImage"
                        accept="image/*"
                        onChange={handleFileChange}
                        required={!editingProject}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Additional Images</label>
                      <input
                        type="file"
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Videos</label>
                      <input
                        type="file"
                        name="videos"
                        accept="video/*"
                        multiple
                        onChange={handleFileChange}
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
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <>
                        <div className="spinner-small"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save"></i>
                        {editingProject ? 'Update Project' : 'Create Project'}
                      </>
                    )}
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

export default Projects;
