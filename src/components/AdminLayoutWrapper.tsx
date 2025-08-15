import React from "react"
import { useLocation } from "react-router-dom"
import "../styles/admin.css"

interface AdminLayoutWrapperProps {
  children: React.ReactNode
}

const AdminLayoutWrapper: React.FC<AdminLayoutWrapperProps> = ({ children }) => {
  const location = useLocation()

  return (
      <>
        {children}
      </>
  )
}

export default AdminLayoutWrapper
