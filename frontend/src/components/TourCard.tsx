import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaSun, FaUser } from 'react-icons/fa';
import CustomSliderTour from './CustomSliderTour';

// Ép kiểu các icon để tránh lỗi TS2786
const StarIcon = FaStar as any;
const SunIcon = FaSun as any;
const UserIcon = FaUser as any;

// Define the Tour type
interface Tour {
    id: number;
    title: string;
    image: string;
    images?: string[];
    price: number;
    duration: string;
    rating: number;
    maxPax: number;
    languages: string[];
    minPax?: number;
}

interface TourCardProps {
    tour: Tour;
    className?: string;
}

const TourCard: React.FC<TourCardProps> = ({ tour, className = '' }) => {
    // Xử lý để có mảng ảnh hợp lệ cho slider
    const tourImages = tour.images && Array.isArray(tour.images) 
        ? tour.images 
        : [];
        
    return (
        <Link to={`/tour/${tour.id}`} className={`group bg-gray-200 hover:bg-white block border rounded-2xl overflow-hidden shadow-xl hover:shadow-md transition w-full md:w-60 ${className}`}>
             <div className="relative">
                {/* Tour slider */}
                <div className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-105">
                    <CustomSliderTour 
                        mainImage={tour.image} 
                        images={tourImages} 
                    />
                </div>

                {/* Rating Badge */}
                <div className="font-medium absolute top-2 left-2 bg-white px-3 py-1 rounded-full text-[10px] flex items-center">
                    <img src="https://meetup.travel/_next/static/media/star.1375cc2d.svg" alt="Star Icon" className="w-3 h-3 mr-1" />
                    <span>{tour.rating}</span>
                </div>

                {/* Temperature Badge */}
                <div className="font-medium absolute top-2 left-16 bg-white px-3 py-1 rounded-full text-[10px] flex items-center">
                    <img src="https://meetup.travel/_next/static/media/clear-sky.1549853b.svg" alt="Sun Icon" className="w-3 h-3 mr-1" />
                    <span>28.01°C</span>
                </div>

                {/* Max Pax Badge */}
                <div className="font-medium absolute top-2 right-2 bg-white px-3 py-1 rounded-full text-[10px] flex items-center">
                    <img src="https://meetup.travel/_next/static/media/user.98178ff4.svg" alt="User Icon" className="w-3 h-3 mr-1" />
                    <span>{tour.minPax && tour.maxPax ? `${tour.minPax}-${tour.maxPax}` : `${tour.maxPax}`} pax</span>
                </div>

                {/* Price and Duration */}
                <div className="absolute bottom-5 right-2 bg-white group-hover:bg-primary px-3 py-1 rounded-full text-sm text-teal-500 group-hover:text-white font-bold">
                    ${tour.price}.00 | {tour.duration}
                </div>
            </div>

            {/* Tour Info */}
            <div className=" p-2">
                <h3 className="font-medium text-sm mb-2 line-clamp-2">{tour.title}</h3>

               {/* Tour Languages */}
               <div className="flex flex-wrap gap-2 mt-2">
                    {tour.languages.map((language, index) => (
                        <span
                            key={index}
                            className="font-medium bg-white group-hover:bg-gray-200 px-2 py-1 rounded-full text-[12px] text-gray-800 transition-colors"
                        >
                            {language} tour guide
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
};

export default TourCard;
