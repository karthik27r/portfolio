import React, { useState, useRef, useEffect } from 'react';
import './CardStyle.css';
import { getMousePosition } from '../../scripts/mousePosition';

function Card({ info }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === info.carousel.length - 1 ? 0 : prevIndex + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? info.carousel.length - 1 : prevIndex - 1));
  };

  const cardRef = useRef();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const mousePos = getMousePosition(cardRef, e, 'pixel');
      if (mousePos) {
        setMousePosition({ x: mousePos.x, y: mousePos.y });
      }
    };

    if (cardRef.current) {
      cardRef.current.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (cardRef.current) {
        cardRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [cardRef.current]);

  return (
    <div ref={cardRef} className="card-container" style={{ '--x': `${mousePosition.x}px`, '--y': `${mousePosition.y}px` }}>
      <div className="card">
        <div className="card-header">
          <div className="title-role-group">
            <h2 className="card-title">{info.title}</h2>
            {info.role && (
              <div className="card-work-section">
                {info.role && <p className="card-role">{info.role}</p>}
                {info.time && (
                  <>
                    <p className="card-work-divider">|</p>
                    <p className="card-time">{info.time}</p>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="card-tags">
            {info.tags && info.tags.map((tag, index) => (
              <span key={index} className="tag" style={{ backgroundColor: tag.color, color: tag.textColor }}>
                {tag.name}
              </span>
            ))}
          </div>
          {info.companyLogo && (
            <img src={info.companyLogo} alt="Company Logo" className="company-logo" href={info.companyLink ? info.companyLink : ''} />
          )}
        </div>

        <div className={`card-body ${isExpanded ? 'expanded' : ''}`}>
          <p>{info.body}</p>
          {isExpanded && <p>{info.detail}</p>}
          {isExpanded && info.carousel && (
            <div className="gallery">
              <div className="gallery-content">
                <div className="gallery-item">
                  <img
                    src={info.carousel[currentImageIndex].carouselImage}
                    alt={info.carousel[currentImageIndex].carouselText || 'Image'}
                  />
                </div>
                <div className='gallery-navigation'>
                  <div className="dots">
                    {info.carousel.map((item, index) => (
                      <span
                        key={index}
                        className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        {index === currentImageIndex && (
                          <p className="carousel-text">{item.carouselText}</p>
                        )}
                      </span>
                    ))}
                  </div>
                  <div className='gallery-navigation-arrows'>
                    <button onClick={prevImage} className="gallery-control left-control">&#10094;</button>
                    <button onClick={nextImage} className="gallery-control right-control">&#10095;</button>
                  </div>


                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card-read-more">
          <p onClick={toggleReadMore} className="read-more-btn">
            {isExpanded ? 'Read Less' : 'Read More'}
          </p>
        </div>
        {info.thumbnails && (
          <div className="card-thumbnails">
            {info.thumbnails.map((item, index) => (
              <img key={index} src={item.image} alt="Tech Logo" className="thumbnail-item" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;