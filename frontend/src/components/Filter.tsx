import React, { useState, useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import API_BASE_URL from '../config/api-config';

// Interface for category
interface Category {
    id: number;
    name: string;
}

interface FilterProps {
    onFilterChange: (filters: {
        category?: string;
        duration?: string;
        sortOrder?: string;
    }) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedDuration, setSelectedDuration] = useState<string>('all');
    const [selectedSort, setSelectedSort] = useState<string>('default');
    const [showMoreCategories, setShowMoreCategories] = useState(false);

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/categories/all`);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setCategories(data);
            } catch (err) {
                console.error('Error fetching categories:', err);
                // Fallback categories if API fails
                setCategories([
                    { id: 1, name: 'Culture' },
                    { id: 2, name: 'Adventure' },
                    { id: 3, name: 'Food tour' },
                    { id: 4, name: 'Diving' },
                    { id: 5, name: 'Motorbike' },
                    { id: 6, name: 'Trekking' },
                    { id: 7, name: 'Paragliding' },
                    { id: 8, name: 'Surf' },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Apply filters when any filter option changes
    useEffect(() => {
        onFilterChange({
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            duration: selectedDuration !== 'all' ? selectedDuration : undefined,
            sortOrder: selectedSort !== 'default' ? selectedSort : undefined,
        });
    }, [selectedCategory, selectedDuration, selectedSort]);

    // Handle category selection
    const handleCategorySelect = (categoryName: string) => {
        setSelectedCategory(categoryName);
    };

    // Handle duration selection
    const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDuration(e.target.value);
    };

    // Handle sort order change
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSort(e.target.value);
    };

    // Toggle showing more categories
    const toggleMoreCategories = () => {
        setShowMoreCategories(!showMoreCategories);
    };

    // Get display categories based on showMoreCategories state
    const displayCategories = [
        { id: 0, name: 'All' },
        ...categories
    ];

    const visibleCategories = showMoreCategories
        ? displayCategories
        : displayCategories.slice(0, 8);

    const hiddenCategoriesCount = displayCategories.length - 8;

    return (
        <div className="overflow-hidden pb-4">
            <div className="flex flex-wrap gap-1">
                {visibleCategories.map((category, index) => (
                    <button
                        key={index}
                        onClick={() => handleCategorySelect(category.name.toLowerCase())}
                        className={`text-gray-500 font-semibold px-2 py-2.5 rounded-lg text-xs whitespace-nowrap 
                        ${selectedCategory === category.name.toLowerCase() ? 'bg-teal-500 text-white' : 'bg-gray-100 hover:bg-teal-100'}`}
                    >
                        {category.name}
                    </button>
                ))}

                {/* More categories button */}
                {hiddenCategoriesCount > 0 && !showMoreCategories && (
                    <button
                        onClick={toggleMoreCategories}
                        className="text-gray-500 font-semibold px-2 py-2.5 rounded-lg text-xs bg-gray-100 border hover:bg-teal-100 border-gray-300"
                    >
                        +{hiddenCategoriesCount}
                    </button>
                )}

                {showMoreCategories && (
                    <button
                        onClick={toggleMoreCategories}
                        className="text-gray-500 font-semibold px-2 py-2.5 rounded-lg text-xs bg-gray-100 border hover:bg-teal-100 border-gray-300"
                    >
                        Show less
                    </button>
                )}

                {/* Duration Filter dropdown */}
                <div className="relative inline-flex items-center border border-gray-300 bg-gray-200 rounded-lg text-xs px-2 py-2.5">
                    <i className="fa fa-calendar mr-2"></i>

                    <select
                        className="text-gray-500 font-semibold appearance-none bg-transparent pr-6 outline-none text-xs"
                        onChange={handleDurationChange}
                        value={selectedDuration}
                    >
                        <option value="all">All</option>
                        <option value="1">1 day</option>
                        <option value="2">2 days</option>
                        <option value="3">3 days</option>
                        <option value="5">5 days</option>
                        <option value="more">More than 5 days</option>
                    </select>

                    <div className="pointer-events-none absolute right-2 text-gray-500 text-xs">
                        <i className="fa fa-chevron-down"></i>
                    </div>
                </div>

                {/* Sort order dropdown */}
                <div className="relative inline-flex items-center bg-gray-200 border border-gray-300 rounded-lg text-xs px-2 py-2.5">
                    <select
                        className="text-gray-500 font-semibold appearance-none bg-transparent pr-6 outline-none text-xs"
                        onChange={handleSortChange}
                        value={selectedSort}
                    >
                        <option value="default">All</option>
                        <option value="price_asc">Low - High Price</option>
                        <option value="price_desc">High - Low Price</option>
                        <option value="rating">Top Rated</option>
                    </select>
                    <div className="pointer-events-none absolute right-2 text-gray-500 text-xs">
                        <i className="fa fa-chevron-down"></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filter;