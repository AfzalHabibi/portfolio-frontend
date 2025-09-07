import React from "react"
import "../styles/main.css"

interface PublicLayoutProps {
  children: React.ReactNode
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="public-portfolio">
      {children}
    </div>
  )
}

export default PublicLayout
