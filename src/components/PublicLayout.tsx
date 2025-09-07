import React from "react"
import ThemeToggle from "./ThemeToggle"
import "../styles/main.css"

interface PublicLayoutProps {
  children: React.ReactNode
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="public-portfolio">
      {children}
      <ThemeToggle />
    </div>
  )
}

export default PublicLayout
