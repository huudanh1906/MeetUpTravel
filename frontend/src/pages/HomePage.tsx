import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TourCard from '../components/TourCard';
import Filter from '../components/Filter';
import CustomSlider from '../components/CustomSlider';
import Alert from '../components/Alert';
import { Card, Spinner } from '@material-tailwind/react';
import 'font-awesome/css/font-awesome.min.css';
import API_BASE_URL from '../config/api-config';

// Định nghĩa interface Tour phù hợp với TourDTO từ backend
interface Tour {
    id: number;
    title: string;
    imageUrl: string; // Chú ý: API trả về imageUrl thay vì image
    price: number;
    duration: number; // Chú ý: API trả về duration là số ngày (number) 
    rating: number;
    maxPax: number;
    // Các trường khác từ API
    minPax?: number;
    location?: string;
    description?: string;
    images?: string[];
    categories?: string[];
    highlighted?: boolean;
    availableGuides?: string[];
}

// Filter interface
interface FilterOptions {
    category?: string;
    duration?: string;
    sortOrder?: string;
}

const HomePage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showButton, setShowButton] = useState(false);
    const [tours, setTours] = useState<Tour[]>([]);
    const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 8;
    const [showAlert, setShowAlert] = useState(false);
    const [searchResults, setSearchResults] = useState<Tour[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string | null>(null);
    const [currentFilters, setCurrentFilters] = useState<FilterOptions>({});

    // Function để fetch tours từ API
    const fetchTours = async (pageNum: number) => {
        try {
            setLoading(true);

            // Sử dụng fetch API để gọi API tours
            const response = await fetch(`${API_BASE_URL}/tours?page=${pageNum}&size=${pageSize}&sortBy=id`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (pageNum === 0) {
                setTours(data.content || []);
            } else {
                setTours(prevTours => [...prevTours, ...(data.content || [])]);
            }

            setHasMore(!data.last);
            setError(null);
        } catch (err) {
            console.error('Error fetching tours:', err);
            setError('Failed to load tours from server. Using sample data instead.');

            // Fallback to sample data if API fails
            if (pageNum === 0) {
                setTours([
                    {
                        id: 1,
                        title: 'FAST TRACK SERVICE - Note your flight detail when booking',
                        imageUrl: 'https://cdn.meetup.travel/dich-vu-don-tien-khach-fast-track.jpg',
                        price: 30,
                        duration: 0,
                        rating: 4.9,
                        maxPax: 100,
                        location: 'Various Airports',
                        availableGuides: ['English', 'Vietnamese']
                    },
                    {
                        id: 2,
                        title: 'Hanoi - Sapa Sleeper Bus by HK Buslines',
                        imageUrl: 'https://cdn.meetup.travel/z5899367009674-85fa7fd28783caac6742381bfa54d4bc.jpg',
                        price: 19,
                        duration: 0,
                        rating: 4.9,
                        maxPax: 40,
                        availableGuides: ['English']
                    }
                ]);
            }
        } finally {
            setLoading(false);
        }
    };

    // Function to search tours
    const searchTours = async (query: string, pageNum: number = 0) => {
        try {
            setIsSearching(true);
            setLoading(true);

            const response = await fetch(`${API_BASE_URL}/tours/search?query=${encodeURIComponent(query)}&page=${pageNum}&size=${pageSize}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (pageNum === 0) {
                setSearchResults(data.content || []);
            } else {
                setSearchResults(prevResults => [...prevResults, ...(data.content || [])]);
            }

            setHasMore(!data.last);
            setError(null);
        } catch (err) {
            console.error('Error searching tours:', err);
            setError('Failed to search tours. Please try again.');
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    // Parse query parameters and handle search
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get('query');

        if (query) {
            setSearchQuery(query);
            searchTours(query);
        } else {
            setSearchQuery(null);
            setIsSearching(false);
            setSearchResults([]);
            fetchTours(0); // Fetch all tours when no search query
        }
    }, [location.search]);

    // Reset search when clicking logo
    const handleLogoClick = () => {
        setSearchQuery(null);
        setIsSearching(false);
        setSearchResults([]);
        setPage(0);
        fetchTours(0);
    };

    // Hàm để load thêm tours
    const loadMoreTours = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchTours(nextPage);
        }
    };

    // Function to scroll to the top
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Show button when scrolled down
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch tours khi component mount
    useEffect(() => {
        fetchTours(0);
    }, []);

    // Hàm để chuyển đổi dữ liệu tour từ API sang định dạng phù hợp với TourCard
    const formatTourForCard = (tour: Tour) => {
        return {
            id: tour.id,
            title: tour.title,
            image: tour.imageUrl || '', // Sử dụng imageUrl từ API
            images: tour.images || [], // Thêm mảng images từ API
            price: Number(tour.price) || 0,
            duration: `${tour.duration} ${tour.duration === 1 ? 'day' : 'days'}`,
            rating: tour.rating,
            maxPax: tour.maxPax,
            minPax: tour.minPax || 1, // Thêm minPax
            languages: tour.availableGuides || ['English'] // Sử dụng availableGuides từ API
        };
    };

    // Apply filters when filters change
    useEffect(() => {
        let filtered = [];

        if (isSearching && searchResults.length > 0) {
            filtered = [...searchResults];
        } else {
            filtered = [...tours];
        }

        // Filter by category
        if (currentFilters.category && currentFilters.category !== 'all') {
            filtered = filtered.filter(tour =>
                tour.categories?.some(cat =>
                    cat.toLowerCase() === currentFilters.category?.toLowerCase()
                )
            );
        }

        // Filter by duration
        if (currentFilters.duration && currentFilters.duration !== 'all') {
            if (currentFilters.duration === 'more') {
                filtered = filtered.filter(tour => tour.duration > 5);
            } else {
                const days = parseInt(currentFilters.duration);
                filtered = filtered.filter(tour => tour.duration === days);
            }
        }

        // Apply sorting
        if (currentFilters.sortOrder) {
            switch (currentFilters.sortOrder) {
                case 'price_asc':
                    filtered.sort((a, b) => a.price - b.price);
                    break;
                case 'price_desc':
                    filtered.sort((a, b) => b.price - a.price);
                    break;
                case 'rating':
                    filtered.sort((a, b) => b.rating - a.rating);
                    break;
                default:
                    // Default sorting can be by ID or any other default order
                    filtered.sort((a, b) => a.id - b.id);
            }
        }

        setFilteredTours(filtered);
    }, [currentFilters, tours, searchResults, isSearching]);

    const handleFilterChange = useCallback((filters: FilterOptions) => {
        setCurrentFilters(filters);
    }, []);

    const closeAlert = () => {
        setShowAlert(false);
    };

    // Function to handle search from header
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setIsSearching(true);
        searchTours(query);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header onLogoClick={handleLogoClick} onSearch={handleSearch} />
            {showAlert && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Alert
                        open={showAlert}
                        onClose={closeAlert}
                        color="teal"
                        className="rounded-lg mt-2 mb-4"
                    >
                        This is an alert message
                    </Alert>
                </div>
            )}

            {/* Hero Banner - hide when searching */}
            {!isSearching && (
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <CustomSlider />
                </div>
            )}

            {/* Tour Section */}
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex-grow">
                {isSearching ? (
                    <h2 className="text-2xl font-bold mb-4">
                        Search Results for "{searchQuery}"
                        <button
                            onClick={() => {
                                navigate('/');
                                setSearchQuery(null);
                                setIsSearching(false);
                                setSearchResults([]);
                                setPage(0);
                                fetchTours(0);
                            }}
                            className="ml-4 text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-300"
                        >
                            Clear Search
                        </button>
                    </h2>
                ) : (
                    <h2 className="text-2xl font-bold mb-4">Tours</h2>
                )}

                {/* Filter Bar */}
                <Filter onFilterChange={handleFilterChange} />

                {/* Error message */}
                {error && (
                    <div className="text-orange-500 bg-orange-50 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {/* Search results count */}
                {isSearching && !loading && searchResults.length === 0 && !error && (
                    <div className="text-gray-600 bg-gray-100 p-3 rounded-lg mb-4">
                        No tours found matching "{searchQuery}". Try a different search term.
                    </div>
                )}

                {/* Loading indicator for initial load */}
                {loading && (isSearching ? searchResults.length === 0 : tours.length === 0) && (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
                    </div>
                )}

                {/* Tour Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-4">
                    {filteredTours.map(tour => (
                        <TourCard key={tour.id} tour={formatTourForCard(tour)} />
                    ))}
                </div>

                {/* See More Button */}
                <div className="flex flex-wrap justify-center gap-2 mt-2 py-10">
                    {loading && page > 0 ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500"></div>
                    ) : hasMore ? (
                        <button
                            onClick={() => {
                                const nextPage = page + 1;
                                setPage(nextPage);
                                if (isSearching && searchQuery) {
                                    searchTours(searchQuery, nextPage);
                                } else {
                                    fetchTours(nextPage);
                                }
                            }}
                            className="font-medium bg-teal-500 text-white px-6 py-2 rounded-full hover:opacity-90 transition"
                        >
                            See more
                        </button>
                    ) : filteredTours.length > 0 ? (
                        <span className="text-gray-500">No more tours to load</span>
                    ) : null}
                </div>
            </div>

            <Footer />

            {/* Scroll to Top Button */}
            {showButton && (
                <div className="fixed bottom-8 right-8">
                    <button
                        onClick={scrollToTop}
                        className="bg-white p-3 rounded-full shadow-lg hover:bg-teal-500 transition"
                    >
                        <img
                            src="https://meetup.travel/_next/static/media/arrow-top.5a42f86b.svg"
                            alt="Scroll to top"
                            className="w-4 h-4 transition-colors brightness-0 hover:filter hover:invert"
                        />
                    </button>
                </div>
            )}
        </div>
    );
};

export default HomePage;