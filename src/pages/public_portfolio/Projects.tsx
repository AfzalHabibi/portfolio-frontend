"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../../store/store"
import ProjectCard from "../../components/ProjectCard"
import Loader from "../../components/Loader"

const Projects: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("All")
  const { projects } = useSelector((state: RootState) => state.projects)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated")
        }
      })
    }, observerOptions)

    const animateElements = document.querySelectorAll(".animate-on-scroll")
    animateElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [loading])

  if (loading) {
    return <Loader />
  }

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))]
  const filteredProjects = filter === "All" ? projects : projects.filter((p) => p.category === filter)

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section" style={{ minHeight: "60vh" }}>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <div className="hero-content">
                <h1 className="hero-title">My Projects</h1>
                <p className="hero-description">
                  Explore my portfolio of web and mobile applications built with modern technologies. Each project
                  represents a unique challenge and innovative solution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="section-padding">
        <div className="container">
          {/* Filter Buttons */}
          <div className="row mb-5">
            <div className="col-12">
              <div className="d-flex justify-content-center flex-wrap gap-2 animate-on-scroll">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`btn ${filter === category ? "btn-primary-custom" : "btn-outline-custom"}`}
                    onClick={() => setFilter(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="row animate-on-scroll">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-5">
              <i className="fas fa-search fa-3x text-muted mb-3"></i>
              <h4 className="text-muted">No projects found</h4>
              <p className="text-muted">Try selecting a different category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding animate-on-scroll" style={{ background: "var(--secondary-bg)" }}>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="section-title">Have a Project in Mind?</h2>
              <p className="lead mb-4 text-muted">
                Let's discuss your ideas and bring them to life with cutting-edge technology and creative solutions.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <a href="/contact" className="btn-primary-custom">
                  <i className="fas fa-envelope me-2"></i>
                  Start a Project
                </a>
                <a href="#" className="btn-outline-custom">
                  <i className="fas fa-phone me-2"></i>
                  Schedule a Call
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Projects
