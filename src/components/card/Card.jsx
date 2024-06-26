import React, { useState, useRef, useEffect } from 'react';
import './CardStyle.css';
import { getMousePosition } from '../../scripts/mousePosition';

function Card({ info, overlay }) {
    const [isExpanded, setIsExpanded] = useState(overlay);
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

    const renderDetail = () => {
        const lines = info.detail.split('\n');
        const content = [];
        
        lines.forEach((line, index) => {
            line = line.trim();
            if (line.startsWith('•')) {
                content.push(<li key={index}>{line.slice(1).trim()}</li>);
            } else {
                if (content.length > 0 && Array.isArray(content[content.length - 1])) {
                    content.push(<ul key={`ul-${index}`}>{content.pop()}</ul>);
                }
                content.push(<p key={index}>{line}</p>);
            }
        });

        if (content.length > 0 && Array.isArray(content[content.length - 1])) {
            content.push(<ul key={`ul-${lines.length}`}>{content.pop()}</ul>);
        }

        return content;
    };

    return (
        <div ref={cardRef} className={`${overlay ? '' : 'card-container'}`} style={{ '--x': `${mousePosition.x}px`, '--y': `${mousePosition.y}px` }}>
            <div className={`${overlay ? 'card-overlay' : 'card'}`}>
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
                        <div className="project-links">
                            {info.githubLink && (
                                <a href={info.githubLink} target="_blank" rel="noopener noreferrer" className="project-link github-link">
                                    GitHub
                                </a>
                            )}
                            {info.demoLink && (
                                <a href={info.demoLink} target="_blank" rel="noopener noreferrer" className="project-link demo-link">
                                    Demo
                                </a>
                            )}
                        </div>
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
                    <p className='card-main-desc'>{info.body}</p>
                    {isExpanded && renderDetail()}
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

                {!overlay && (
                    <div className="card-read-more">
                        <p onClick={toggleReadMore} className="read-more-btn">
                            {isExpanded ? 'Read Less' : 'Read More'}
                        </p>
                    </div>
                )}
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