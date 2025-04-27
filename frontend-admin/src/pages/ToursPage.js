import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toursApi, categoriesApi } from '../services/api';
import { PencilIcon, TrashIcon, PlusIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

function ToursPage() {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [deleteModal, setDeleteModal] = useState({ show: false, tourId: null });
    const navigate = useNavigate();

    // Thêm state cho tìm kiếm và bộ lọc
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categories, setCategories] = useState([]);
    const [durationFilter, setDurationFilter] = useState('');
    const [isAdvancedFilterVisible, setIsAdvancedFilterVisible] = useState(false);
    const [filteredTours, setFilteredTours] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const fetchTours = async () => {
        try {
            setLoading(true);
            const response = await toursApi.getAll(page, 10);
            console.log('Admin API Response:', response); // Log the response

            if (response && Array.isArray(response.content)) {
                // Spring Data pagination format
                setTours(response.content);
                setFilteredTours(response.content);
                setTotalPages(response.totalPages || 1);
            } else if (response && Array.isArray(response)) {
                // Direct array format
                setTours(response);
                setFilteredTours(response);
                setTotalPages(Math.ceil(response.length / 10) || 1);
            } else {
                // Fallback for unexpected response format
                console.error('Unexpected API response format:', response);
                setTours([]);
                setFilteredTours([]);
                setTotalPages(1);
                setError('Received unexpected data format from the server.');
            }
        } catch (err) {
            console.error('Error fetching tours', err);
            setError('Failed to load tours. Please try again later.');
            setTours([]);
            setFilteredTours([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            setLoadingCategories(true);
            const response = await categoriesApi.getAllList();
            setCategories(response || []);
        } catch (err) {
            console.error('Error fetching categories', err);
        } finally {
            setLoadingCategories(false);
        }
    };

    useEffect(() => {
        fetchTours();
        fetchCategories();
    }, [page]);

    // Effect để xử lý tìm kiếm và lọc
    useEffect(() => {
        filterTours();
    }, [searchTerm, categoryFilter, durationFilter, tours]);

    const filterTours = () => {
        let filtered = [...tours];

        // Lọc theo từ khóa tìm kiếm
        if (searchTerm) {
            const lowercasedSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(tour =>
                (tour.title && tour.title.toLowerCase().includes(lowercasedSearch)) ||
                (tour.location && tour.location.toLowerCase().includes(lowercasedSearch)) ||
                (tour.description && tour.description.toLowerCase().includes(lowercasedSearch)) ||
                (tour.id && tour.id.toString().includes(searchTerm))
            );
        }

        // Lọc theo category
        if (categoryFilter) {
            filtered = filtered.filter(tour =>
                tour.categories && tour.categories.includes(categoryFilter)
            );
        }

        // Lọc theo thời gian (số ngày)
        if (durationFilter) {
            const [min, max] = durationFilter.split('-').map(Number);
            if (!isNaN(min) && !isNaN(max)) {
                filtered = filtered.filter(tour =>
                    tour.duration >= min && tour.duration <= max
                );
            } else if (!isNaN(min) && durationFilter.includes('+')) {
                filtered = filtered.filter(tour => tour.duration >= min);
            }
        }

        setFilteredTours(filtered);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryFilterChange = (e) => {
        setCategoryFilter(e.target.value);
    };

    const handleDurationFilterChange = (e) => {
        setDurationFilter(e.target.value);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setCategoryFilter('');
        setDurationFilter('');
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    const handleDelete = async (id) => {
        try {
            await toursApi.delete(id);
            setDeleteModal({ show: false, tourId: null });
            fetchTours();
        } catch (err) {
            console.error('Error deleting tour', err);
            setError('Failed to delete tour. Please try again later.');
        }
    };

    if (loading && tours.length === 0) {
        return (
            <div className="py-6">
                <div className="text-center">Loading tours...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="py-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Tours Management</h1>
                <Link
                    to="/tours/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Add New Tour
                </Link>
            </div>

            {/* Thêm thanh tìm kiếm và bộ lọc */}
            <div className="mt-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Search by title, location..."
                            />
                            <div className="absolute left-3 top-2.5 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Lọc theo category */}
                    <div className="md:w-48">
                        <select
                            value={categoryFilter}
                            onChange={handleCategoryFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => setIsAdvancedFilterVisible(!isAdvancedFilterVisible)}
                        className="md:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        {isAdvancedFilterVisible ? 'Hide Filters' : 'More Filters'}
                    </button>
                </div>

                {/* Bộ lọc nâng cao */}
                {isAdvancedFilterVisible && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
                                <select
                                    value={durationFilter}
                                    onChange={handleDurationFilterChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Any Duration</option>
                                    <option value="1-3">1-3 days</option>
                                    <option value="4-7">4-7 days</option>
                                    <option value="8-14">8-14 days</option>
                                    <option value="15+">15+ days</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 text-red-600 hover:text-red-800 font-medium"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Hiển thị số lượng kết quả sau khi lọc */}
                <div className="mt-4 text-sm text-gray-500">
                    Found {filteredTours.length} tours
                    {(searchTerm || categoryFilter || durationFilter) &&
                        ' with current filters'}
                </div>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4 mb-6">
                    <div className="text-sm text-red-700">{error}</div>
                </div>
            )}

            {/* Tour List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {filteredTours.map((tour) => (
                        <li key={tour.id}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col sm:flex-row sm:items-center">
                                        <p className="text-sm font-medium text-primary-600 truncate">{tour.title}</p>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                            <span className="mr-1.5 flex-shrink-0 font-medium">
                                                ${tour.price}
                                            </span>
                                            <span className="mx-2">•</span>
                                            <span>{tour.duration} days</span>
                                            <span className="mx-2">•</span>
                                            <span>{tour.location}</span>
                                        </div>
                                    </div>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <button
                                            onClick={() => navigate(`/tours/${tour.id}/additional-services`)}
                                            className="text-primary-600 hover:text-primary-900 mr-4"
                                        >
                                            Services
                                        </button>
                                        <button
                                            onClick={() => navigate(`/tours/${tour.id}/pricing`)}
                                            className="text-primary-600 hover:text-primary-900 mr-4"
                                        >
                                            Pricing
                                        </button>
                                        <button
                                            onClick={() => navigate(`/tours/${tour.id}/edit`)}
                                            className="text-primary-600 hover:text-primary-900 mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteModal({ show: true, tourId: tour.id })}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            {tour.minPax} - {tour.maxPax} travelers
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                        <p>
                                            Rating: {tour.rating} ★
                                        </p>
                                        {tour.categories && tour.categories.length > 0 && (
                                            <div className="ml-4 flex flex-wrap gap-1">
                                                {tour.categories.map((category, idx) => (
                                                    <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {category}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {tour.featured && (
                                            <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                    {filteredTours.length === 0 && !loading && (
                        <li className="px-4 py-6 text-center text-gray-500">No tours found</li>
                    )}
                </ul>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 0}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= totalPages - 1}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{filteredTours.length > 0 ? page * 10 + 1 : 0}</span> to{' '}
                                <span className="font-medium">{page * 10 + filteredTours.length}</span> of{' '}
                                <span className="font-medium">
                                    {totalPages * 10}
                                </span>{' '}
                                results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => handlePageChange(0)}
                                    disabled={page === 0}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">First</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i)}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === i
                                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(totalPages - 1)}
                                    disabled={page >= totalPages - 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Last</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Delete Tour
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to delete this tour? This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={() => handleDelete(deleteModal.tourId)}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Delete
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeleteModal({ show: false, tourId: null })}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ToursPage; 