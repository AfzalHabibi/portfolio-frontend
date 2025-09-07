import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useApi';
import Loader from '../../components/Loader';
import ImageGallery from '../../components/ImageGallery';
import '../../styles/imageGallery.css';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'gallery' | 'videos'>('overview');
  const { projects, selectedProject, loadProjectById, loading: projectsLoading } = useProjects();
  
  // Use selectedProject if available, otherwise find from projects array
  const project = selectedProject?.id === id ? selectedProject : projects.find(p => p.id === id);

  // Prepare gallery images and videos
  const galleryData = useMemo(() => {
    if (!project) return { images: [], videos: [], allMedia: [] };

    interface MediaItem {
      id: string;
      url: string;
      name: string;
      type: 'image' | 'video';
    }

    const images: MediaItem[] = [];
    const videos: MediaItem[] = [];
    const allMedia: MediaItem[] = [];

    // Add main image
    if (project.mainImage) {
      const mainImageItem: MediaItem = {
        id: 'main',
        url: project.mainImage,
        name: 'Main Project Image',
        type: 'image'
      };
      images.push(mainImageItem);
      allMedia.push(mainImageItem);
    }

    // Add additional images
    if (project.images && project.images.length > 0) {
      project.images.forEach((url, index) => {
        const imageItem: MediaItem = {
          id: `image-${index}`,
          url,
          name: `Project Image ${index + 1}`,
          type: 'image'
        };
        images.push(imageItem);
        allMedia.push(imageItem);
      });
    }

    // Add videos
    if (project.videos && project.videos.length > 0) {
      project.videos.forEach((url, index) => {
        const videoItem: MediaItem = {
          id: `video-${index}`,
          url,
          name: `Project Video ${index + 1}`,
          type: 'video'
        };
        videos.push(videoItem);
        allMedia.push(videoItem);
      });
    }

    return { images, videos, allMedia };
  }, [project]);

  useEffect(() => {
    if (id && !project && !projectsLoading) {
      loadProjectById(id);
    }
  }, [id, project, projectsLoading, loadProjectById]);

  useEffect(() => {
    if (!projectsLoading && (project || projects.length > 0)) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [projectsLoading, project, projects]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [loading]);

  if (loading) {
    return <Loader />;
  }

  if (!project) {
    return (
      <div className="container py-5 mt-5">
        <div className="text-center">
          <h2>Project Not Found</h2>
          <p>The project you're looking for doesn't exist.</p>
          <Link to="/projects" className="btn-primary-custom">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail-page">
      {/* Hero Section */}
      <section className="project-hero">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="project-hero-content">
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb" className="project-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">
                        <i className="fas fa-home"></i>
                        Home
                      </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="/projects">Projects</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {project.title}
                    </li>
                  </ol>
                </nav>

                {/* Project Header */}
                <div className="project-header">
                  <div className="project-meta">
                    <span className="project-category">{project.category}</span>
                    <span className="project-date">
                      <i className="fas fa-calendar-alt"></i>
                      {new Date(project.completedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <h1 className="project-title">{project.title}</h1>
                  <p className="project-subtitle">{project.description}</p>
                  
                  {/* Action Buttons */}
                  <div className="project-actions">
                    {project.demoUrl && (
                      <a 
                        href={project.demoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-project-primary"
                      >
                        <i className="fas fa-external-link-alt"></i>
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-project-secondary"
                      >
                        <i className="fab fa-github"></i>
                        View Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="project-content">
        <div className="container">
          <div className="row">
            {/* Main Content Area */}
            <div className="col-lg-8">
              {/* Tab Navigation */}
              <div className="project-tabs">
                <div className="tab-nav">
                  <button
                    className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    <i className="fas fa-info-circle"></i>
                    Overview
                  </button>
                  {galleryData.images.length > 0 && (
                    <button
                      className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
                      onClick={() => setActiveTab('gallery')}
                    >
                      <i className="fas fa-images"></i>
                      Gallery ({galleryData.images.length})
                    </button>
                  )}
                  {galleryData.videos.length > 0 && (
                    <button
                      className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
                      onClick={() => setActiveTab('videos')}
                    >
                      <i className="fas fa-video"></i>
                      Videos ({galleryData.videos.length})
                    </button>
                  )}
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="tab-pane active">
                      {/* Main Image */}
                      {project.mainImage && (
                        <div className="main-image-container">
                          <img
                            src={project.mainImage}
                            alt={project.title}
                            className="main-project-image"
                          />
                        </div>
                      )}

                      {/* Project Description */}
                      <div className="project-description-card">
                        <h3>About This Project</h3>
                        <p>{project.longDescription}</p>
                      </div>

                      {/* Features */}
                      {project.features && project.features.length > 0 && (
                        <div className="project-features-card">
                          <h3>Key Features</h3>
                          <div className="features-grid">
                            {project.features.map((feature, index) => (
                              <div key={index} className="feature-item">
                                <i className="fas fa-check-circle"></i>
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quick Gallery Preview */}
                      {galleryData.allMedia.length > 1 && (
                        <div className="quick-gallery-preview">
                          <div className="preview-header">
                            <h3>Media Gallery</h3>
                            <div className="preview-actions">
                              {galleryData.images.length > 0 && (
                                <button
                                  className="btn-preview"
                                  onClick={() => setActiveTab('gallery')}
                                >
                                  View Images ({galleryData.images.length})
                                </button>
                              )}
                              {galleryData.videos.length > 0 && (
                                <button
                                  className="btn-preview"
                                  onClick={() => setActiveTab('videos')}
                                >
                                  View Videos ({galleryData.videos.length})
                                </button>
                              )}
                            </div>
                          </div>
                          <ImageGallery
                            images={galleryData.allMedia}
                            maxPreviewCount={6}
                            className="overview-gallery"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Gallery Tab */}
                  {activeTab === 'gallery' && (
                    <div className="tab-pane active">
                      <div className="gallery-header">
                        <h3>Project Images</h3>
                        <p>Explore all project images in detail</p>
                      </div>
                      <ImageGallery
                        images={galleryData.images}
                        className="full-gallery"
                      />
                    </div>
                  )}

                  {/* Videos Tab */}
                  {activeTab === 'videos' && (
                    <div className="tab-pane active">
                      <div className="videos-header">
                        <h3>Project Videos</h3>
                        <p>Watch project demonstrations and walkthroughs</p>
                      </div>
                      <ImageGallery
                        images={galleryData.videos}
                        className="videos-gallery"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="project-sidebar">
                {/* Project Info Card */}
                <div className="sidebar-card project-info-card">
                  <h4>Project Details</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Category</span>
                      <span className="info-value">
                        <span className="category-badge">{project.category}</span>
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Completed</span>
                      <span className="info-value">
                        {new Date(project.completedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Status</span>
                      <span className="info-value">
                        <span className="status-badge completed">Completed</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Technologies Card */}
                <div className="sidebar-card technologies-card">
                  <h4>Technologies Used</h4>
                  <div className="tech-grid">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Client Remarks Card */}
                {project.clientRemarks && (
                  <div className="sidebar-card client-remarks-card">
                    <h4>Client Feedback</h4>
                    <blockquote className="client-quote">
                      <i className="fas fa-quote-left quote-icon"></i>
                      <p>"{project.clientRemarks}"</p>
                    </blockquote>
                  </div>
                )}

                {/* Action Card */}
                <div className="sidebar-card action-card">
                  <h4>Project Links</h4>
                  <div className="action-buttons">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn primary"
                      >
                        <i className="fas fa-external-link-alt"></i>
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn secondary"
                      >
                        <i className="fab fa-github"></i>
                        Source Code
                      </a>
                    )}
                    <Link to="/projects" className="action-btn outline">
                      <i className="fas fa-arrow-left"></i>
                      Back to Projects
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
