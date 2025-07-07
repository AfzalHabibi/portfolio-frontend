import type React from "react"
import { Link } from "react-router-dom"
import type { Project } from "../types"

interface ProjectCardProps {
  project: Project
  index?: number
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index = 0 }) => {
  return (
    <div className="col-lg-4 col-md-6 mb-4 animate-stagger" style={{ "--stagger-delay": index } as React.CSSProperties}>
      <div className="project-card card-hover-effect">
        <div className="position-relative overflow-hidden">
          <img src={project.mainImage || "/placeholder.svg"} alt={project.title} className="project-image" />
          <div className="position-absolute top-0 end-0 p-3">
            <span className="badge bg-primary">{project.category}</span>
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
                  className="text-decoration-none"
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
                  className="text-decoration-none"
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
