"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../store/store"
import ThemeToggle from "./ThemeToggle"

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { settings } = useSelector((state: RootState) => state.settings)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className={`navbar navbar-expand-lg navbar-custom fixed-top ${isScrolled ? "scrolled" : ""}`}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="./images/main-logo.png" width={70} alt="" />
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"} text-white`}></i>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/") ? "active" : ""}`} to="/" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/projects") ? "active" : ""}`}
                to="/projects"
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/skills") ? "active" : ""}`}
                to="/skills"
                onClick={() => setIsMenuOpen(false)}
              >
                Skills
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/contact") ? "active" : ""}`}
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <a
                className="nav-link btn-primary-custom ms-2"
                href={settings.cvUrl}
                download
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-download me-2"></i>
                Download CV
              </a>
            </li>
            <li className="nav-item">
              <ThemeToggle />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
