import React from "react"
import "../styles/main.css"

interface PublicLayoutProps {
  children: React.ReactNode
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return <>{children}</>
}

export default PublicLayout
