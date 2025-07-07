"use client"

import type React from "react"
import { useState } from "react"
import TypeWriter from "./TypeWriter"

interface AnimatedTextProps {
  text: string | string[]
  animationType?: "colorCycle" | "gradient" | "typing" | "glow" | "typewriter"
  className?: string
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, animationType = "colorCycle", className = "" }) => {
  const [currentAnimation, setCurrentAnimation] = useState(animationType)

  const getAnimationClass = () => {
    switch (currentAnimation) {
      case "colorCycle":
        return "hero-subtitle-animated"
      case "gradient":
        return "hero-subtitle-gradient"
      case "typing":
        return "hero-subtitle-typing"
      case "glow":
        return "hero-subtitle-glow"
      case "typewriter":
        return "hero-subtitle"
      default:
        return "hero-subtitle-animated"
    }
  }

  const handleAnimationChange = () => {
    const animations = ["colorCycle", "gradient", "glow", "typewriter"]
    const currentIndex = animations.indexOf(currentAnimation)
    const nextIndex = (currentIndex + 1) % animations.length
    setCurrentAnimation(animations[nextIndex] as any)
  }

  if (currentAnimation === "typewriter" && Array.isArray(text)) {
    return (
      <div className={`${className} position-relative`}>
        <h2 className="hero-subtitle">
          <TypeWriter texts={text} speed={100} deleteSpeed={50} delayBetweenTexts={2000} />
        </h2>
        <button
          onClick={handleAnimationChange}
          className="btn btn-sm btn-outline-primary position-absolute"
          style={{ top: "-40px", right: "0" }}
          title="Change Animation"
        >
          <i className="fas fa-magic"></i>
        </button>
      </div>
    )
  }

  return (
    <div className={`${className} position-relative`}>
      <h2 className={getAnimationClass()}>{Array.isArray(text) ? text[0] : text}</h2>
      <button
        onClick={handleAnimationChange}
        className="btn btn-sm btn-outline-primary position-absolute"
        style={{ top: "-40px", right: "0" }}
        title="Change Animation"
      >
        <i className="fas fa-magic"></i>
      </button>
    </div>
  )
}

export default AnimatedText
