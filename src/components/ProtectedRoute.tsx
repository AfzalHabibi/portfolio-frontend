import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import type { RootState } from "../store/store"
import Loader from "./Loader"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    // Don't redirect if still loading
    if (loading) {
      return
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/admin/login")
    }
  }, [isAuthenticated, loading, navigate])

  // Show loading state while checking authentication
  if (loading) {
    return <Loader />
  }

  // If not authenticated, don't render the protected content
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

export default ProtectedRoute
