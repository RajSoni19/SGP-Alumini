import React, { useEffect, useState } from 'react';
import convocation1 from '../assets/Photos/convocation1.png';
import convocation2 from '../assets/Photos/convocation2.png';
import campusLife1 from '../assets/Photos/campusLife1.png';
import campusLife2 from '../assets/Photos/campusLife2.png';
import event1 from '../assets/Photos/event1.png';
import event2 from '../assets/Photos/event2.png';
import celebration1 from '../assets/Photos/celebration1.png';
import celebration2 from '../assets/Photos/celebration2.png';
import alumni1 from '../assets/Photos/alumni1.png';
import alumni2 from '../assets/Photos/alumni2.png';
import cultural1 from '../assets/Photos/cultural1.png';
import cultural2 from '../assets/Photos/cultural2.png';
import sports1 from '../assets/Photos/sports1.png';
import sports2 from '../assets/Photos/sports2.png';
import workshop1 from '../assets/Photos/workshop1.png';
import workshop2 from '../assets/Photos/workshop2.png';
import techFest1 from '../assets/Photos/techFest1.png';
import techFest2 from '../assets/Photos/techFest2.png';
import graduation1 from '../assets/Photos/graduation1.png';
import headerBg from '../assets/uploads/head_covergrad.jpg';

const Gallery = () => {
    const imageData = [
        { src: convocation1, category: 'Convocation', title: 'Annual Convocation Ceremony' },
        { src: convocation2, category: 'Convocation', title: 'Graduation Day' },
        { src: campusLife1, category: 'Campus Life', title: 'Student Activities' },
        { src: campusLife2, category: 'Campus Life', title: 'Campus Environment' },
        { src: event1, category: 'Events', title: 'Annual Function' },
        { src: event2, category: 'Events', title: 'College Events' },
        { src: celebration1, category: 'Celebrations', title: 'Festival Celebrations' },
        { src: celebration2, category: 'Celebrations', title: 'Cultural Fest' },
        { src: alumni1, category: 'Alumni', title: 'Alumni Meet 2024' },
        { src: alumni2, category: 'Alumni', title: 'Alumni Gathering' },
        { src: cultural1, category: 'Cultural', title: 'Cultural Activities' },
        { src: cultural2, category: 'Cultural', title: 'Cultural Performance' },
        { src: sports1, category: 'Sports', title: 'Sports Meet' },
        { src: sports2, category: 'Sports', title: 'Athletic Events' },
        { src: workshop1, category: 'Workshops', title: 'Technical Workshop' },
        { src: workshop2, category: 'Workshops', title: 'Skill Development' },
        { src: techFest1, category: 'Tech Fest', title: 'Technical Exhibition' },
        { src: techFest2, category: 'Tech Fest', title: 'Innovation Fair' },
        { src: graduation1, category: 'Graduation', title: 'Graduation Ceremony' }
    ];

    const images = imageData.map(item => item.src);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => 
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length]);

    const handlePrevious = () => {
        setCurrentImageIndex((prevIndex) => 
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
        setIsPlaying(false);
    };

    const handleNext = () => {
        setCurrentImageIndex((prevIndex) => 
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
        setIsPlaying(false);
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const categories = ['All', ...new Set(imageData.map(item => item.category))];
    
    const filteredImages = selectedCategory === 'All' 
        ? imageData 
        : imageData.filter(item => item.category === selectedCategory);

    return (
        <>
            <header className="masthead" style={{ 
                backgroundImage: `url(${headerBg})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
            }}>
                <div className="container-fluid h-100">
                    <div className="row h-100 align-items-center justify-content-center text-center">
                        <div className="col-lg-8 align-self-end mb-4 page-title">
                            <h3 className="text-white">Photo Gallery</h3>
                            <hr className="divider my-4" />
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mt-5">
                {/* Slideshow Section */}
                <div className="row mb-5">
                    <div className="col-12">
                        <div className="card slideshow-card">
                            <div className="card-body p-0 position-relative" style={{ height: '500px', overflow: 'hidden' }}>
                                <img 
                                    key={currentImageIndex}
                                    src={images[currentImageIndex]} 
                                    alt={`${imageData[currentImageIndex].title}`}
                                    className="w-100 h-100 slideshow-image"
                                    style={{ objectFit: 'contain' }}
                                />
                                <div className="slide-category">
                                    <span className="badge bg-primary">{imageData[currentImageIndex].category}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="category-filters">
                            {categories.map((category, index) => (
                                <button
                                    key={index}
                                    className={`btn category-btn ${selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Grid Gallery Section */}
                <div className="row g-4">
                    {filteredImages.map((image, index) => (
                        <div key={index} className="col-md-4 col-sm-6 gallery-item">
                            <div 
                                className="card gallery-card h-100" 
                                onClick={() => {
                                    setCurrentImageIndex(imageData.indexOf(image));
                                    setIsPlaying(false);
                                }}
                            >
                                <div className="card-body p-0 position-relative">
                                    <img 
                                        src={image.src} 
                                        alt={image.title}
                                        className="w-100 h-100"
                                        style={{ 
                                            objectFit: 'cover',
                                            height: '250px',
                                            borderRadius: '4px'
                                        }}
                                    />
                                    <div className="image-overlay">
                                        <h6 className="mb-1">{image.title}</h6>
                                        <span className="badge bg-primary">{image.category}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>
                {`
                    .slideshow-card {
                        border: none;
                        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
                        border-radius: 12px;
                        overflow: hidden;
                        transition: transform 0.3s ease;
                    }
                    .slideshow-card:hover {
                        transform: translateY(-5px);
                    }
                    .gallery-card {
                        border: none;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                        border-radius: 8px;
                        transition: all 0.3s ease;
                        overflow: hidden;
                        cursor: pointer;
                    }
                    .gallery-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 8px 16px rgba(0,0,0,0.2);
                    }
                    .gallery-card:hover img {
                        transform: scale(1.05);
                    }
                    .gallery-item {
                        opacity: 0;
                        animation: fadeInUp 0.6s ease forwards;
                    }
                    .category-btn {
                        background: transparent;
                        border: 2px solid #007bff;
                        color: #007bff;
                        border-radius: 25px;
                        padding: 8px 20px;
                        transition: all 0.3s ease;
                        margin: 5px;
                    }
                    .category-btn:hover {
                        background: #007bff;
                        color: white;
                        transform: translateY(-2px);
                    }
                    .category-btn.active {
                        background: #007bff;
                        color: white;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 8px rgba(0,123,255,0.3);
                    }
                    .slide-category {
                        position: absolute;
                        top: 20px;
                        right: 20px;
                        z-index: 10;
                    }
                    .slide-category .badge {
                        font-size: 1rem;
                        padding: 8px 16px;
                        border-radius: 20px;
                        background: rgba(0,123,255,0.9);
                        backdrop-filter: blur(5px);
                    }
                    .slideshow-image {
                        opacity: 0;
                        animation: fadeIn 0.8s ease-in forwards;
                    }
                    .image-overlay {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background: rgba(0, 0, 0, 0.8);
                        color: white;
                        padding: 15px;
                        transform: translateY(100%);
                        transition: transform 0.3s ease;
                        text-align: center;
                        backdrop-filter: blur(5px);
                    }
                    .gallery-card:hover .image-overlay {
                        transform: translateY(0);
                    }
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: scale(1.05);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}
            </style>
        </>
    );
};

export default Gallery;