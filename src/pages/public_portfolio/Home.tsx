"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useProjects, useSettings } from "../../hooks/useApi"
import ProjectCard from "../../components/ProjectCard"
import Loader from "../../components/Loader"
import AnimatedText from "../../components/AnimatedText"
import TestimonialSlider from "../../components/TestimonialSlider"
import FeaturedSkillsComponent from "../../components/FeaturedSkillsComponent"

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const { projects, loading: projectsLoading } = useProjects()
  const { settings, loading: settingsLoading } = useSettings()

  useEffect(() => {
    // Wait for both projects and settings to load
    if (!projectsLoading && !settingsLoading) {
      const timer = setTimeout(() => {
        setLoading(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [projectsLoading, settingsLoading])

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

  const testimonials = [
    {
      id: "1",
      name: "Sarah Johnson",
      position: "CEO",
      company: "TechStart Inc.",
      text: "John delivered an exceptional e-commerce platform that exceeded our expectations. His attention to detail and technical expertise are outstanding. The project was completed on time and within budget.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "2",
      name: "Michael Chen",
      position: "Product Manager",
      company: "InnovateCorp",
      text: "Working with John was a pleasure. He understood our requirements perfectly and delivered a robust task management solution on time. His communication throughout the project was excellent.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      position: "Founder",
      company: "HealthTech Solutions",
      text: "The healthcare management system John developed has transformed our practice. The telemedicine features are particularly impressive and have helped us serve our patients better during challenging times.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "4",
      name: "David Thompson",
      position: "CTO",
      company: "StartupXYZ",
      text: "John's expertise in MERN stack development is exceptional. He built our entire platform from scratch and it's been running smoothly for over a year. Highly recommended for any complex web development project.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "5",
      name: "Lisa Wang",
      position: "Marketing Director",
      company: "Digital Agency Pro",
      text: "The mobile app John developed for our client exceeded all expectations. The user interface is intuitive, the performance is excellent, and our client has seen a 300% increase in user engagement.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section" id="about">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1 className="hero-title">Hi, I'm {settings.name}</h1>
                <AnimatedText
                  text={[
                    settings.title,
                    "Full Stack Developer",
                    "MERN Stack Expert",
                    "Mobile App Developer",
                    "Problem Solver",
                  ]}
                  animationType="typewriter"
                />
                <p className="hero-description">{settings.description}</p>
                <div className="hero-buttons">
                  <a href={settings.cvUrl} download className="btn-primary-custom me-3">
                    <i className="fas fa-download me-2"></i>
                    Download CV
                  </a>
                  <Link to="/contact" className="btn-outline-custom">
                    <i className="fas fa-envelope me-2"></i>
                    Hire Me
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <div className="position-relative">
                  <img
                    src="https://lh3.googleusercontent.com/a/ACg8ocLwG3d6nKX6VIRpbRqwXuDVu9VBsbiHutLzRWQ5zGTuvV2gyupE=s288-c-no"
                    alt="Profile"
                    className=" rounded-3 shadow-lg"
                    width={400}
                    style={{ maxWidth: "450px" }}
                  />
                  <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient rounded-3 opacity-25"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="section-padding animate-on-scroll" id="skills">
        <div className="container">
          <h2 className="section-title">My Skills & Expertise</h2>
          <p className="section-subtitle text-center mb-5">
            Comprehensive overview of my technical skills, experience levels, and professional accomplishments
          </p>
          <FeaturedSkillsComponent />
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section animate-on-scroll">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <div className="stat-label">Finished Projects</div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="stat-item">
                <span className="stat-number">20+</span>
                <div className="stat-label">Created Jobs</div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <div className="stat-label">Happy Customers</div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="stat-item">
                <span className="stat-number">10+</span>
                <div className="stat-label">Years Of Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="section-padding animate-on-scroll" id="projects">
        <div className="container">
          <h2 className="section-title">Featured Projects</h2>
          <div className="row">
            {projects.slice(0, 6).map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
          <div className="text-center mt-5">
            <Link to="/projects" className="btn-primary-custom">
              View All Projects
              <i className="fas fa-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Slider */}
      <section
        className="section-padding animate-on-scroll"
        id="testimonials"
        style={{ background: "var(--secondary-bg)" }}
      >
        <div className="container">
          <h2 className="section-title">Client Testimonials</h2>
          <TestimonialSlider testimonials={testimonials} autoPlay={true} autoPlayInterval={6000} />
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding animate-on-scroll" id="contact">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <div className="custom-card">
                <div className="card-content">
                  <h2 className="section-title">Let's Work Together</h2>
                  <p className="lead mb-4 text-muted">
                    Ready to bring your ideas to life? Let's discuss your project and create something amazing together.
                  </p>
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <Link to="/contact" className="btn-primary-custom">
                      <i className="fas fa-envelope me-2"></i>
                      Get In Touch
                    </Link>
                    <a href={settings.cvUrl} download className="btn-outline-custom">
                      <i className="fas fa-download me-2"></i>
                      Download CV
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="social-links d-flex justify-content-center mb-4 gap-1">
            <a href={settings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="theme-toggle">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href={settings.socialLinks.github} target="_blank" rel="noopener noreferrer" className="theme-toggle">
              <i className="fab fa-github"></i>
            </a>
            <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="theme-toggle">
              <i className="fab fa-twitter"></i>
            </a>
            <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="theme-toggle">
              <i className="fab fa-instagram"></i>
            </a>
            <a href={settings.socialLinks.behance} target="_blank" rel="noopener noreferrer" className="theme-toggle">
              <i className="fab fa-behance"></i>
            </a>
            <a href={settings.socialLinks.dribbble} target="_blank" rel="noopener noreferrer" className="theme-toggle">
              <i className="fab fa-dribbble"></i>
            </a>
          </div>

          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="custom-card">
                <div className="card-content">
                  <h5 className="text-gradient mb-3">Contact Information</h5>
                  <p className="mb-2">
                    <i className="fas fa-envelope me-2 text-primary"></i>
                    {settings.email}
                  </p>
                  <p className="mb-2">
                    <i className="fas fa-phone me-2 text-primary"></i>
                    {settings.phone}
                  </p>
                  <p className="mb-0">
                    <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                    {settings.location}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 mb-4">
              <div className="custom-card">
                <div className="card-content">
                  <h5 className="text-gradient mb-3">Quick Links</h5>
                  <ul className="list-unstyled">
                    <li>
                      <Link to="/" className="text-decoration-none text-muted">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link to="/projects" className="text-decoration-none text-muted">
                        Projects
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact" className="text-decoration-none text-muted">
                        Contact
                      </Link>
                    </li>
                    <li>
                      <a href={settings.cvUrl} download className="text-decoration-none text-muted">
                        Download CV
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-lg-4 mb-4">
              <div className="custom-card">
                <div className="card-content">
                  <h5 className="text-gradient mb-3">Services</h5>
                  <ul className="list-unstyled">
                    <li className="text-muted">Web Development</li>
                    <li className="text-muted">Mobile App Development</li>
                    <li className="text-muted">Backend Development</li>
                    <li className="text-muted">Database Design</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-4" style={{ borderColor: "var(--border-color)" }} />

          <div className="text-center">
            <p className="mb-0 text-muted">
              © {new Date().getFullYear()} {settings.name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
