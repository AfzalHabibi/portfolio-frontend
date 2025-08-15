import React from "react"
import "../styles/admin.css"

interface AdminLayoutWrapperProps {
  children: React.ReactNode
}

const AdminLayoutWrapper: React.FC<AdminLayoutWrapperProps> = ({ children }) => {
  return <>{children}</>
}

export default AdminLayoutWrapper
