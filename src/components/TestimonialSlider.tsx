"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"

interface Testimonial {
  id: string
  name: string
  position: string
  company: string
  text: string
  avatar?: string
  rating: number
}

interface TestimonialSliderProps {
  testimonials: Testimonial[]
  autoPlay?: boolean
  autoPlayInterval?: number
}

const TestimonialSlider: React.FC<TestimonialSliderProps> = ({
  testimonials,
  autoPlay = true,
  autoPlayInterval = 5000,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length)
  }, [testimonials.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [testimonials.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(nextSlide, autoPlayInterval)
    return () => clearInterval(interval)
  }, [isPlaying, nextSlide, autoPlayInterval])

  // Touch/swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide()
      } else if (e.key === "ArrowRight") {
        nextSlide()
      } else if (e.key === " ") {
        e.preventDefault()
        setIsPlaying(!isPlaying)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [prevSlide, nextSlide, isPlaying])

  if (testimonials.length === 0) return null

  return (
    <div className="testimonial-slider-container">
      <div
        className="testimonial-slider"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(autoPlay)}
      >
        {/* Slider Track */}
        <div
          className="testimonial-track"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id} className="testimonial-slide">
              <div className="testimonial-card-slider">
                <div className="testimonial-content">
                  {/* Quote Icon */}
                  <div className="quote-icon">
                    <i className="fas fa-quote-left"></i>
                  </div>

                  {/* Rating */}
                  <div className="testimonial-rating mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="testimonial-text">"{testimonial.text}"</p>

                  {/* Author Info */}
                  <div className="testimonial-author-info">
                    {testimonial.avatar && (
                      <div className="author-avatar">
                        <img src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                      </div>
                    )}
                    <div className="author-details">
                      <h5 className="author-name">{testimonial.name}</h5>
                      <p className="author-position">
                        {testimonial.position} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          className="slider-nav slider-nav-prev"
          onClick={prevSlide}
          aria-label="Previous testimonial"
          disabled={testimonials.length <= 1}
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        <button
          className="slider-nav slider-nav-next"
          onClick={nextSlide}
          aria-label="Next testimonial"
          disabled={testimonials.length <= 1}
        >
          <i className="fas fa-chevron-right"></i>
        </button>

        {/* Play/Pause Button */}
        <button
          className="slider-play-pause"
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          title={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="slider-dots">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`slider-dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="slider-progress">
        <div
          className="slider-progress-bar"
          style={{
            width: `${((currentSlide + 1) / testimonials.length) * 100}%`,
          }}
        />
      </div>
    </div>
  )
}

export default TestimonialSlider
