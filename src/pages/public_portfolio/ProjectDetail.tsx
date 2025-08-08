import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useApi';
import Loader from '../../components/Loader';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const { projects, selectedProject, loadProjectById, loading: projectsLoading } = useProjects();
  
  // Use selectedProject if available, otherwise find from projects array
  const project = selectedProject?.id === id ? selectedProject : projects.find(p => p.id === id);

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
    <div>
      {/* Hero Section */}
      <section className="hero-section" style={{ minHeight: '50vh' }}>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <div className="hero-content">
                <nav aria-label="breadcrumb" className="mb-4">
                  <ol className="breadcrumb justify-content-center">
                    <li className="breadcrumb-item">
                      <Link to="/" className="text-decoration-none">Home</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="/projects" className="text-decoration-none">Projects</Link>
                    </li>
                    <li className="breadcrumb-item active text-primary" aria-current="page">
                      {project.title}
                    </li>
                  </ol>
                </nav>
                <h1 className="hero-title">{project.title}</h1>
                <p className="hero-description">{project.description}</p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-primary-custom">
                      <i className="fas fa-external-link-alt me-2"></i>
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-outline-custom">
                      <i className="fab fa-github me-2"></i>
                      View Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="section-padding">
        <div className="container">
          <div className="row">
            {/* Image Gallery */}
            <div className="col-lg-8 mb-5">
              <div className="animate-on-scroll">
                <h3 className="mb-4">Project Gallery</h3>
                
                {/* Main Image */}
                <div className="mb-4">
                  <img 
                    src={project.images[selectedImage] || project.mainImage} 
                    alt={`${project.title} - Image ${selectedImage + 1}`}
                    className="img-fluid rounded-3 shadow-lg w-100"
                    style={{ height: '400px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => setShowGallery(true)}
                  />
                </div>

                {/* Thumbnail Gallery */}
                <div className="image-gallery">
                  {project.images.slice(0, 4).map((image, index) => (
                    <img
                      key={index}
                      src={image || "/placeholder.svg"}
                      alt={`${project.title} - Thumbnail ${index + 1}`}
                      className={`gallery-image ${selectedImage === index ? 'border border-primary border-3' : ''}`}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>

                {project.images.length > 4 && (
                  <div className="text-center mt-3">
                    <button 
                      className="btn-outline-custom"
                      onClick={() => setShowGallery(true)}
                    >
                      <i className="fas fa-images me-2"></i>
                      View All Images ({project.images.length})
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Project Info */}
            <div className="col-lg-4">
              <div className="animate-on-scroll">
                <div className="custom-card mb-4">
                  <h4 className="mb-3">Project Information</h4>
                  <div className="mb-3">
                    <strong>Category:</strong>
                    <span className="ms-2 badge bg-primary">{project.category}</span>
                  </div>
                  <div className="mb-3">
                    <strong>Completed:</strong>
                    <span className="ms-2">{new Date(project.completedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="mb-3">
                    <strong>Technologies:</strong>
                    <div className="mt-2 d-flex flex-wrap gap-1">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="tech-tag mb-1">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {project.clientRemarks && (
                  <div className="custom-card">
                    <h4 className="mb-3">Client Feedback</h4>
                    <blockquote className="blockquote">
                      <p className="mb-0 fst-italic">"{project.clientRemarks}"</p>
                    </blockquote>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Project Description */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="animate-on-scroll">
                <h3 className="mb-4">About This Project</h3>
                <div className="custom-card">
                  <p className="lead">{project.longDescription}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="animate-on-scroll">
                <h3 className="mb-4">Key Features</h3>
                <div className="row">
                  {project.features.map((feature, index) => (
                    <div key={index} className="col-lg-6 mb-3">
                      <div className="d-flex align-items-start">
                        <i className="fas fa-check-circle text-primary me-3 mt-1"></i>
                        <span>{feature}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center animate-on-scroll">
                <Link to="/projects" className="btn-outline-custom">
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Projects
                </Link>
                
                <div className="d-flex gap-2">
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-primary-custom">
                      <i className="fas fa-external-link-alt me-2"></i>
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-outline-custom">
                      <i className="fab fa-github me-2"></i>
                      Source Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Modal */}
      {showGallery && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content bg-transparent border-0">
              <div className="modal-header border-0">
                <h5 className="modal-title text-white">Project Gallery</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowGallery(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="text-center">
                  <img 
                    src={project.images[selectedImage] || "/placeholder.svg"} 
                    alt={`${project.title} - Gallery Image ${selectedImage + 1}`}
                    className="img-fluid rounded"
                    style={{ maxHeight: '70vh' }}
                  />
                </div>
                <div className="d-flex justify-content-center mt-3 gap-2 flex-wrap">
                  {project.images.map((image, index) => (
                    <img
                      key={index}
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className={`rounded cursor-pointer ${selectedImage === index ? 'border border-primary border-3' : ''}`}
                      style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
