import type React from "react"
import { Link } from "react-router-dom"
import type { Project } from "../types"

interface ProjectCardProps {
  project: Project
  index?: number
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index = 0 }) => {
  // Calculate total media count
  const totalImages = (project.images?.length || 0) + (project.mainImage ? 1 : 0);
  const totalVideos = project.videos?.length || 0;
  const totalMedia = totalImages + totalVideos;

  return (
    <div className="col-lg-4 col-md-6 mb-4 animate-stagger" style={{ "--stagger-delay": index } as React.CSSProperties}>
      <div className="project-card card-hover-effect-2">
        <div className="position-relative overflow-hidden">
          <img 
            src={project.mainImage || "https://thumbs.dreamstime.com/b/abstract-design-website-hero-section-background-features-vibrant-blue-fluid-lines-geometric-shapes-circles-351935047.jpg"} 
            alt={project.title} 
            className="project-image" 
          />
          
          {/* Category Badge */}
          <div className="position-absolute top-0 end-0 p-3">
            <span className="badge bg-primary">{project.category}</span>
          </div>
          
          {/* Media Count Badge */}
          {totalMedia > 1 && (
            <div className="position-absolute top-0 start-0 p-3">
              <div className="media-count-badge">
                <i className="fas fa-images"></i>
                <span>{totalMedia}</span>
                {totalVideos > 0 && (
                  <div className="video-indicator">
                    <i className="fas fa-video"></i>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Project Overlay */}
          <div className="project-overlay">
            <Link to={`/projects/${project.id}`} className="view-project-btn">
              <i className="fas fa-eye"></i>
              View Project
            </Link>
          </div>
        </div>

        <div className="project-content">
          <h3 className="project-title">{project.title}</h3>
          <p className="project-description">{project.description}</p>

          <div className="project-tech">
            {project.technologies.slice(0, 3).map((tech, techIndex) => (
              <span key={techIndex} className="tech-tag">
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && <span className="tech-tag">+{project.technologies.length - 3}</span>}
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <Link to={`/projects/${project.id}`} className="btn-outline-custom">
              View Details
            </Link>

            <div className="d-flex gap-2">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none project-link"
                  title="Live Demo"
                >
                  <i className="fas fa-external-link-alt text-primary"></i>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none project-link"
                  title="GitHub Repository"
                >
                  <i className="fab fa-github text-primary"></i>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
