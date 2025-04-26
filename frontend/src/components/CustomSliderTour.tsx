// src/components/CustomSliderTour.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface CustomSliderTourProps {
    images: string[];
    mainImage?: string;
}

const CustomSliderTour: React.FC<CustomSliderTourProps> = ({ images, mainImage }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // Kết hợp ảnh chính và các ảnh phụ
    const allImages = mainImage 
        ? [mainImage, ...images.filter(img => img !== mainImage)]
        : images.length > 0 
            ? images 
            : ['https://cdn.meetup.travel/dich-vu-don-tien-khach-fast-track.jpg']; // Ảnh mặc định nếu không có ảnh nào

    const [isDragging, setIsDragging] = useState(false);
    const [dragStarted, setDragStarted] = useState(false);
    const startX = useRef(0);
    const currentX = useRef(0);
    const diffX = useRef(0);
    const slideWidth = useRef(0);
    const sliderRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);
    const lastTimeRef = useRef(0);

    // Transition settings
    const TRANSITION_DURATION = '0.4s';
    const TRANSITION_EASE = 'cubic-bezier(0.25, 0.1, 0.25, 1.0)';

    const nextSlide = useCallback(() => {
        if (currentIndex < allImages.length - 1) {
            setCurrentIndex(prevIndex => prevIndex + 1);
        } else {
            // Khi đã ở slide cuối, reset về slide đầu với hiệu ứng
            setCurrentIndex(0);
        }
    }, [currentIndex, allImages.length]);

    const prevSlide = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prevIndex => prevIndex - 1);
        } else {
            // Khi đã ở slide đầu, chuyển về slide cuối với hiệu ứng
            setCurrentIndex(allImages.length - 1);
        }
    }, [currentIndex, allImages.length]);

    // Reset slider position
    const resetSliderPosition = useCallback(() => {
        if (sliderRef.current) {
            sliderRef.current.style.transition = `transform ${TRANSITION_DURATION} ${TRANSITION_EASE}`;
            sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    }, [currentIndex]);

    // Animation frame cho di chuyển mượt mà hơn
    const animateDrag = useCallback((timestamp: number) => {
        if (!isDragging) return;
        
        // Throttle để tránh quá nhiều render
        if (timestamp - lastTimeRef.current < 16) { // ~60fps
            animationRef.current = requestAnimationFrame(animateDrag);
            return;
        }
        
        lastTimeRef.current = timestamp;
        
        if (sliderRef.current) {
            // Hệ số giảm hiệu ứng kéo khi ra ngoài biên
            const dampingFactor = 0.5;
            let translateValue = -currentIndex * 100 + (diffX.current / slideWidth.current * 100);
            
            // Nếu đang kéo vượt quá giới hạn đầu/cuối, áp dụng hiệu ứng giảm
            if ((currentIndex === 0 && diffX.current > 0) || 
                (currentIndex === allImages.length - 1 && diffX.current < 0)) {
                translateValue = -currentIndex * 100 + (diffX.current / slideWidth.current * 100 * dampingFactor);
            }
            
            sliderRef.current.style.transform = `translateX(${translateValue}%)`;
        }
        
        animationRef.current = requestAnimationFrame(animateDrag);
    }, [isDragging, currentIndex, allImages.length]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        // Đặt lại state
        setIsDragging(true);
        setDragStarted(true);
        startX.current = e.clientX;
        currentX.current = e.clientX;
        diffX.current = 0;
        
        // Lưu chiều rộng của slider
        if (sliderRef.current) {
            slideWidth.current = sliderRef.current.clientWidth;
            // Xóa transition để slide theo chuột mượt mà
            sliderRef.current.style.transition = 'none';
        }
        
        // Bắt đầu animation frame
        if (animationRef.current === null) {
            animationRef.current = requestAnimationFrame(animateDrag);
        }
        
        // Ngăn chặn highlight text trong quá trình kéo
        e.preventDefault();
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        
        currentX.current = e.clientX;
        diffX.current = currentX.current - startX.current;
        
        // Animation frame sẽ xử lý cập nhật transform
    };

    const handleMouseUp = () => {
        if (!isDragging) return;
        
        setIsDragging(false);
        
        // Hủy animation frame
        if (animationRef.current !== null) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        
        // Chỉ xử lý khi đã bắt đầu kéo
        if (dragStarted) {
            const minSwipeDistance = slideWidth.current * 0.15; // 15% chiều rộng slider
            
            if (Math.abs(diffX.current) > minSwipeDistance) {
                if (diffX.current > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            } else {
                resetSliderPosition();
            }
            
            setDragStarted(false);
        }
    };

    // Xử lý cho màn hình cảm ứng
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        // Đặt lại state
        setIsDragging(true);
        setDragStarted(true);
        startX.current = e.touches[0].clientX;
        currentX.current = e.touches[0].clientX;
        diffX.current = 0;
        
        // Lưu chiều rộng của slider
        if (sliderRef.current) {
            slideWidth.current = sliderRef.current.clientWidth;
            // Xóa transition để slide theo ngón tay mượt mà
            sliderRef.current.style.transition = 'none';
        }
        
        // Bắt đầu animation frame
        if (animationRef.current === null) {
            animationRef.current = requestAnimationFrame(animateDrag);
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        
        // Ngăn không cho trang cuộn khi kéo slider
        e.preventDefault();
        
        currentX.current = e.touches[0].clientX;
        diffX.current = currentX.current - startX.current;
        
        // Animation frame sẽ xử lý cập nhật transform
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        
        setIsDragging(false);
        
        // Hủy animation frame
        if (animationRef.current !== null) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        
        // Chỉ xử lý khi đã bắt đầu kéo
        if (dragStarted) {
            const minSwipeDistance = slideWidth.current * 0.15; // 15% chiều rộng slider
            
            if (Math.abs(diffX.current) > minSwipeDistance) {
                if (diffX.current > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            } else {
                resetSliderPosition();
            }
            
            setDragStarted(false);
        }
    };

    // Áp dụng transform mượt mà khi currentIndex thay đổi
    useEffect(() => {
        resetSliderPosition();
    }, [currentIndex, resetSliderPosition]);

    // Cleanup animation frame khi unmount
    useEffect(() => {
        return () => {
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <div 
            className="relative overflow-hidden touch-pan-y" // Thêm overflow-hidden để ẩn các hình ảnh ngoài vùng nhìn
            onMouseDown={handleMouseDown} 
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp} 
            onMouseLeave={handleMouseUp} // Xử lý khi chuột rời khỏi slider
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div 
                ref={sliderRef}
                className="flex will-change-transform" 
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {allImages.map((image, index) => (
                    <img 
                        key={index}
                        src={image} 
                        alt={`Slide ${index}`} 
                        className="w-full h-64 object-cover rounded-2xl"
                        style={{ flex: '0 0 100%' }}
                        draggable="false" // Ngăn không cho kéo thả hình ảnh
                    />
                ))}
            </div>
            {allImages.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
                    {allImages.map((_, index) => (
                        <button
                            key={index}
                            className={`h-1 ${currentIndex === index ? 'w-4 bg-yellow-400' : 'w-1 bg-white'} rounded-md transition-all duration-300`}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </div>
            )}
            {allImages.length > 1 && (
                <>
                    <button 
                        onClick={prevSlide} 
                        className="absolute left-0 top-0 h-full w-1/4 opacity-0 z-10 cursor-pointer"
                        aria-label="Previous slide"
                    />
                    <button 
                        onClick={nextSlide} 
                        className="absolute right-0 top-0 h-full w-1/4 opacity-0 z-10 cursor-pointer"
                        aria-label="Next slide"
                    />
                </>
            )}
        </div>
    );
};

export default CustomSliderTour;