import { useState, useEffect } from 'react'
import './ImageCarousel.css'

function ImageCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  const images = [
    {
      id: 1,
      src: '/img.jpeg',
      alt: 'Warehouse Slide 1'
    },
    {
      id: 2,
      src: '/img1.jpeg',
      alt: 'Warehouse Slide 2'
    },
    {
      id: 3,
      src: '/img3.jpeg',
      alt: 'Warehouse Slide 3'
    },
    {
      id: 4,
      src: '/img4.jpeg',
      alt: 'Warehouse Slide 4'
    }
  ]

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlay, images.length])

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setIsAutoPlay(false)
    // Resume autoplay after 10 seconds
    setTimeout(() => setIsAutoPlay(true), 10000)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length)
    setIsAutoPlay(false)
    setTimeout(() => setIsAutoPlay(true), 10000)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
    setIsAutoPlay(false)
    setTimeout(() => setIsAutoPlay(true), 10000)
  }

  return (
    <div className="image-carousel-container">
      {/* Slides */}
      <div className="carousel-slides-wrapper">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="carousel-image"
            />
            {/* Gradient overlay */}
            <div className="carousel-overlay"></div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <button 
        className="carousel-btn prev-btn"
        onClick={prevSlide}
        title="Previous slide"
      >
        ‹
      </button>

      <button 
        className="carousel-btn next-btn"
        onClick={nextSlide}
        title="Next slide"
      >
        ›
      </button>

      {/* Dot Indicators */}
      <div className="carousel-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            title={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Info Section */}
      <div className="carousel-info">
        <div className="info-badge">
          <span className="badge-number">{currentSlide + 1}</span>
          <span className="badge-total">/ {images.length}</span>
        </div>
      </div>
    </div>
  )
}

export default ImageCarousel
