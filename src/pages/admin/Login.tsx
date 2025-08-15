"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { loginUser, clearError } from "../../store/slices/authSlice"
import type { AppDispatch, RootState } from "../../store/store"

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard")
    }
  }, [isAuthenticated, navigate])

  // Clear any existing errors when component mounts
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const result = await dispatch(loginUser(formData))
      if (loginUser.fulfilled.match(result)) {
        navigate("/admin/dashboard")
      }
    } catch (error) {
      // Error is handled by the Redux slice
      console.error("Login failed:", error)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--primary-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          borderRadius: "12px",
          padding: "2rem",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              background: "var(--accent-primary)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem auto",
              color: "white",
              fontSize: "1.5rem",
            }}
          >
            <i className="fas fa-user-shield"></i>
          </div>
          <h2 style={{ color: "var(--text-primary)", fontSize: "1.75rem", fontWeight: "700", margin: "0 0 0.5rem 0" }}>
            Admin Login
          </h2>
          <p style={{ color: "var(--text-muted)", margin: "0" }}>Sign in to manage your portfolio</p>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "8px",
              padding: "0.75rem",
              marginBottom: "1.5rem",
              color: "#ef4444",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                color: "var(--text-primary)",
                fontWeight: "500",
                marginBottom: "0.5rem",
                fontSize: "0.9rem",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "var(--secondary-bg)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                color: "var(--text-primary)",
                fontSize: "0.9rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                color: "var(--text-primary)",
                fontWeight: "500",
                marginBottom: "0.5rem",
                fontSize: "0.9rem",
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "var(--secondary-bg)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                color: "var(--text-primary)",
                fontSize: "0.9rem",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.875rem",
              background: loading ? "var(--secondary-bg)" : "var(--accent-primary)",
              border: "none",
              borderRadius: "8px",
              color: "white",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "var(--transition-fast)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Signing in...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Sign In
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <a
            href="/"
            style={{
              color: "var(--accent-primary)",
              textDecoration: "none",
              fontSize: "0.9rem",
              transition: "var(--transition-fast)",
            }}
          >
            <i className="fas fa-arrow-left me-1"></i>
            Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  )
}

export default Login
