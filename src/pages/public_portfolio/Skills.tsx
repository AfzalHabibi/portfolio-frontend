"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useSkills } from "../../hooks/useApi"
import SkillsComponent from "../../components/SkillsComponent"
import Loader from "../../components/Loader"

const Skills: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const { skills, loading: skillsLoading, loadSkills } = useSkills()

  useEffect(() => {
    // Load all skills including inactive ones for admin purposes
    loadSkills(false)
  }, [])

  useEffect(() => {
    if (!skillsLoading) {
      const timer = setTimeout(() => {
        setLoading(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [skillsLoading])

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

  const featuredSkills = skills.filter(skill => skill.isFeatured)
  const totalSkillItems = skills.reduce((acc, skill) => acc + skill.items.filter(item => item.isActive !== false).length, 0)
  const expertSkills = skills.reduce((acc, skill) => acc + skill.items.filter(item => item.proficiency === 'Expert' && item.isActive !== false).length, 0)
  const averageExperience = Math.round(
    skills.reduce((acc, skill) => {
      const skillExp = skill.items.reduce((itemAcc, item) => {
        const years = parseFloat(item.experience.replace(/[^\d.]/g, '')) || 0
        return itemAcc + years
      }, 0)
      return acc + skillExp
    }, 0) / Math.max(totalSkillItems, 1)
  )

  return (
    <div className="skills-page">
      {/* Hero Section */}
      <section className="hero-section skills-hero" id="skills-hero">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-8 mx-auto text-center">
              <div className="hero-content animate-on-scroll">
                <h1 className="hero-title">
                  My <span className="text-gradient">Technical Skills</span>
                </h1>
                <p className="hero-description">
                  Comprehensive overview of my technical expertise, programming languages, frameworks, 
                  and tools I've mastered throughout my professional journey. From front-end technologies 
                  to back-end development, database management, and DevOps practices.
                </p>
                <div className="hero-buttons">
                  <Link to="/contact" className="btn-primary-custom me-3">
                    <i className="fas fa-envelope me-2"></i>
                    Hire Me
                  </Link>
                  <a href="#skills-overview" className="btn-outline-custom">
                    <i className="fas fa-arrow-down me-2"></i>
                    Explore Skills
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Skills Section */}
      <section className="section-padding animate-on-scroll" id="all-skills">
        <div className="container">
          <h2 className="section-title">All Skills & Technologies</h2>
          <p className="section-subtitle text-center mb-5">
            Browse through all my technical skills, filter by category, and explore detailed information
          </p>
          <SkillsComponent showAllDetails={true} className="skills-page-component" />
        </div>
      </section>

      {/* Skills Journey Section */}
      <section className="section-padding animate-on-scroll" style={{ background: "var(--secondary-bg)" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="section-title">My Learning Journey</h2>
              <p className="section-subtitle mb-4">
                Continuous learning and adaptation to new technologies is at the core of my professional development. 
                I believe in staying current with industry trends and constantly expanding my skill set.
              </p>
              <div className="journey-stats mt-5">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="journey-stat">
                      <i className="fas fa-graduation-cap fa-2x text-primary mb-3"></i>
                      <h5>Continuous Learning</h5>
                      <p>Always exploring new technologies and best practices</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="journey-stat">
                      <i className="fas fa-project-diagram fa-2x text-primary mb-3"></i>
                      <h5>Practical Application</h5>
                      <p>Hands-on experience through real-world projects</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="journey-stat">
                      <i className="fas fa-users fa-2x text-primary mb-3"></i>
                      <h5>Knowledge Sharing</h5>
                      <p>Contributing to the developer community and mentoring others</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/contact" className="btn-primary-custom">
                  <i className="fas fa-handshake me-2"></i>
                  Let's Work Together
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Skills
