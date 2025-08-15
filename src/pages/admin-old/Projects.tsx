import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useProjects } from '../../hooks/useApi';
import { CreateProjectWithFilesData } from '../../services/projectService';
import { Project } from '../../types';

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
  const { isAuthenticated, user, logoutUser } = useAuth();
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

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
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
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearProjectError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearProjectError]);

  const handleLogout = () => {
    logoutUser();
    navigate('/admin/login');
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.mainImage) {
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
      mainImage: formData.mainImage,
      images: formData.images,
      videos: formData.videos,
    };

    try {
      await addProjectWithFiles(projectData);
      setShowModal(false);
      resetForm();
      loadProjects(); // Refresh the projects list
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await removeProject(id);
        loadProjects(); // Refresh the projects list
      } catch (err) {
        console.error('Error deleting project:', err);
      }
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand">Project Management</span>
          <div className="navbar-nav ms-auto">
            <button 
              className="btn btn-outline-light me-2"
              onClick={() => navigate('/admin/dashboard')}
            >
              <i className="fas fa-arrow-left me-1"></i>
              Dashboard
            </button>
            <div className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {user?.email}
              </a>
              <ul className="dropdown-menu">
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid p-4">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3">Projects</h1>
                <p className="text-muted">Manage your portfolio projects</p>
              </div>
              <button
                className="custom-primary-btn"
                onClick={() => setShowModal(true)}
              >
                <i className="fas fa-plus me-2"></i>
                Add Project
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={clearProjectError}></button>
          </div>
        )}

        {/* Projects Grid */}
        <div className="row">
          {loading ? (
            <div className="col-12 text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100">
                  <img
                    src={project.mainImage}
                    className="card-img-top"
                    alt={project.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{project.title}</h5>
                    <p className="card-text flex-grow-1">
                      {project.description.substring(0, 100)}...
                    </p>
                    <div className="mb-2">
                      <span className="badge bg-secondary">{project.category}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">{project.completedDate}</small>
                      <div>
                        <button className="btn btn-sm btn-outline-primary me-1">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(project.id)}
                          disabled={actionLoading}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
              <h4>No Projects Found</h4>
              <p className="text-muted">Create your first project to get started.</p>
              <button
                className="custom-primary-btn"
                onClick={() => setShowModal(true)}
              >
                <i className="fas fa-plus me-2"></i>
                Add Project
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Project Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  {/* Basic Info */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Category *</label>
                      <select
                        className="form-select"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Mobile Development">Mobile Development</option>
                        <option value="Desktop Application">Desktop Application</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Short Description *</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Long Description *</label>
                    <textarea
                      className="form-control"
                      name="longDescription"
                      rows={5}
                      value={formData.longDescription}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>

                  {/* Features */}
                  <div className="mb-3">
                    <label className="form-label">Features</label>
                    {formData.features.map((feature, index) => (
                      <div key={index} className="input-group mb-2">
                        <input
                          type="text"
                          className="form-control"
                          value={feature}
                          onChange={(e) => handleArrayChange(index, e.target.value, 'features')}
                          placeholder="Enter feature"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => removeArrayItem(index, 'features')}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => addArrayItem('features')}
                    >
                      <i className="fas fa-plus"></i> Add Feature
                    </button>
                  </div>

                  {/* Technologies */}
                  <div className="mb-3">
                    <label className="form-label">Technologies</label>
                    {formData.technologies.map((tech, index) => (
                      <div key={index} className="input-group mb-2">
                        <input
                          type="text"
                          className="form-control"
                          value={tech}
                          onChange={(e) => handleArrayChange(index, e.target.value, 'technologies')}
                          placeholder="Enter technology"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => removeArrayItem(index, 'technologies')}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => addArrayItem('technologies')}
                    >
                      <i className="fas fa-plus"></i> Add Technology
                    </button>
                  </div>

                  {/* URLs and Date */}
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="form-label">Demo URL</label>
                      <input
                        type="url"
                        className="form-control"
                        name="demoUrl"
                        value={formData.demoUrl}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">GitHub URL</label>
                      <input
                        type="url"
                        className="form-control"
                        name="githubUrl"
                        value={formData.githubUrl}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Completed Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        name="completedDate"
                        value={formData.completedDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Client Remarks</label>
                    <textarea
                      className="form-control"
                      name="clientRemarks"
                      rows={3}
                      value={formData.clientRemarks}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  {/* File Uploads */}
                  <div className="mb-3">
                    <label className="form-label">Main Image *</label>
                    <input
                      type="file"
                      className="form-control"
                      name="mainImage"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Additional Images</label>
                    <input
                      type="file"
                      className="form-control"
                      name="images"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Videos</label>
                    <input
                      type="file"
                      className="form-control"
                      name="videos"
                      accept="video/*"
                      multiple
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="custom-secondary-btn"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="custom-primary-btn"
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Saving...
                      </>
                    ) : (
                      editingProject ? 'Update Project' : 'Create Project'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;