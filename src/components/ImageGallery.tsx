import React, { useState, useCallback } from 'react';

interface ImageItem {
  id: string;
  url: string;
  name?: string;
  type?: 'image' | 'video';
}

interface ImageGalleryProps {
  images: ImageItem[];
  className?: string;
  showLightbox?: boolean;
  maxPreviewCount?: number;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  className = '',
  showLightbox = true,
  maxPreviewCount = 6
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = useCallback((index: number) => {
    if (!showLightbox) return;
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  }, [showLightbox]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    }
  }, [closeLightbox, nextImage, prevImage]);

  if (!images || images.length === 0) {
    return null;
  }

  const visibleImages = images.slice(0, maxPreviewCount);
  const remainingCount = Math.max(0, images.length - maxPreviewCount);

  return (
    <>
      <div className={`image-gallery ${className}`}>
        <div className="gallery-grid">
          {visibleImages.map((image, index) => (
            <div
              key={image.id}
              className="gallery-item"
              onClick={() => openLightbox(index)}
            >
              {image.type === 'video' ? (
                <div className="video-thumbnail">
                  <video
                    src={image.url}
                    className="gallery-media"
                    muted
                    playsInline
                  />
                  <div className="video-overlay">
                    <i className="fas fa-play"></i>
                  </div>
                </div>
              ) : (
                <img
                  src={image.url}
                  alt={image.name || `Gallery image ${index + 1}`}
                  className="gallery-media"
                  loading="lazy"
                />
              )}
              
              {/* Show remaining count on last visible item */}
              {index === visibleImages.length - 1 && remainingCount > 0 && (
                <div className="remaining-count">
                  <span>+{remainingCount}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && showLightbox && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <i className="fas fa-times"></i>
            </button>

            {images.length > 1 && (
              <>
                <button
                  className="lightbox-nav lightbox-prev"
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button
                  className="lightbox-nav lightbox-next"
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </>
            )}

            <div className="lightbox-media-container">
              {images[currentImageIndex]?.type === 'video' ? (
                <video
                  src={images[currentImageIndex].url}
                  className="lightbox-media"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={images[currentImageIndex]?.url}
                  alt={images[currentImageIndex]?.name || `Gallery image ${currentImageIndex + 1}`}
                  className="lightbox-media"
                />
              )}
            </div>

            <div className="lightbox-info">
              <h4>{images[currentImageIndex]?.name || `Image ${currentImageIndex + 1}`}</h4>
              <p>{currentImageIndex + 1} of {images.length}</p>
            </div>

            {/* Thumbnail navigation */}
            {images.length > 1 && (
              <div className="lightbox-thumbnails">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    className={`thumbnail-btn ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    {image.type === 'video' ? (
                      <div className="thumbnail-video">
                        <video src={image.url} muted />
                        <i className="fas fa-play"></i>
                      </div>
                    ) : (
                      <img
                        src={image.url}
                        alt={`Thumbnail ${index + 1}`}
                        loading="lazy"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
