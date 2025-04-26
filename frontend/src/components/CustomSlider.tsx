// src/components/CustomSlider.tsx
import React, { useState, useRef, useEffect } from 'react';

const CustomSlider: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [
        'https://meetup.travel/assets/images/tour-banner-1.png',
        'https://meetup.travel/assets/images/tour-banner-2.png',
        'https://meetup.travel/assets/images/tour-banner-3.png',
        'https://meetup.travel/assets/images/tour-banner-4.png',
        'https://meetup.travel/assets/images/tour-banner-5.png',
    ];

    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        // Clear automatic slider when user interacts
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        
        setIsDragging(true);
        startX.current = e.clientX;
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        
        const diffX = e.clientX - startX.current;
        if (diffX > 100) {
            prevSlide();
            setIsDragging(false);
            startX.current = e.clientX;
        } else if (diffX < -100) {
            nextSlide();
            setIsDragging(false);
            startX.current = e.clientX;
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        
        // Restart automatic slider after user interaction
        if (!isHovered) {
            intervalRef.current = setInterval(nextSlide, 8000);
        }
    };

    // Touch events for mobile
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        // Clear automatic slider when user interacts
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        
        setIsDragging(true);
        startX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        
        const diffX = e.touches[0].clientX - startX.current;
        if (diffX > 100) {
            prevSlide();
            setIsDragging(false);
            startX.current = e.touches[0].clientX;
        } else if (diffX < -100) {
            nextSlide();
            setIsDragging(false);
            startX.current = e.touches[0].clientX;
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        
        // Restart automatic slider after user interaction
        if (!isHovered) {
            intervalRef.current = setInterval(nextSlide, 8000);
        }
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        // Clear the interval when mouse enters to pause auto-sliding
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        handleMouseUp();
        // Resume auto-sliding when mouse leaves
        if (!intervalRef.current) {
            intervalRef.current = setInterval(nextSlide, 2000);
        }
    };

    // Auto-slide effect
    useEffect(() => {
        intervalRef.current = setInterval(nextSlide, 2000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <div className="relative">
            <div 
                ref={sliderRef}
                className="relative overflow-hidden rounded-2xl"
                onMouseDown={handleMouseDown} 
                onMouseUp={handleMouseUp} 
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div 
                    className="flex transition-transform duration-700 ease-in-out" 
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {images.map((image, index) => (
                        <div key={index} className="flex-shrink-0 w-full relative">
                            <img 
                                src={image} 
                                alt={`Slide ${index}`} 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                        </div>
                    ))}
                </div>
                
                {/* Centered dot indicators */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex justify-center">
                    <div className="bg-opacity-25 rounded-full px-3 py-1 flex space-x-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                className={`h-1.5 w-1 rounded-full transition-all duration-300 ease-in-out ${
                                    currentIndex === index ? 'w-8 bg-yellow-400' : 'w-2 bg-white'
                                }`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                </div>
                
               
                
            
            </div>
        </div>
    );
};

export default CustomSlider;