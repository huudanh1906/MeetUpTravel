import React, { useState, useEffect } from 'react';
import { bookingsApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

function BookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [statusUpdateId, setStatusUpdateId] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const navigate = useNavigate();

    // Thêm state cho tìm kiếm và bộ lọc
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState({
        startDate: '',
        endDate: ''
    });
    const [isAdvancedFilterVisible, setIsAdvancedFilterVisible] = useState(false);
    const [filteredBookings, setFilteredBookings] = useState([]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await bookingsApi.getAll(page, 10);
            setBookings(response.content || []);
            setFilteredBookings(response.content || []);
            setTotalPages(response.totalPages || 1);
        } catch (err) {
            console.error('Error fetching bookings', err);
            setError('Failed to load bookings. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [page]);

    // Effect để xử lý tìm kiếm và lọc
    useEffect(() => {
        filterBookings();
    }, [searchTerm, statusFilter, dateFilter, bookings]);

    const filterBookings = () => {
        let filtered = [...bookings];

        // Lọc theo từ khóa tìm kiếm
        if (searchTerm) {
            const lowercasedSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(booking =>
                (booking.customerName && booking.customerName.toLowerCase().includes(lowercasedSearch)) ||
                (booking.customerEmail && booking.customerEmail.toLowerCase().includes(lowercasedSearch)) ||
                (booking.whatsappNumber && booking.whatsappNumber.includes(searchTerm)) ||
                (booking.tourTitle && booking.tourTitle.toLowerCase().includes(lowercasedSearch)) ||
                (booking.id && booking.id.toString().includes(searchTerm))
            );
        }

        // Lọc theo trạng thái
        if (statusFilter) {
            filtered = filtered.filter(booking => booking.status === statusFilter);
        }

        // Lọc theo ngày khởi hành
        if (dateFilter.startDate) {
            const startDate = new Date(dateFilter.startDate);
            filtered = filtered.filter(booking =>
                booking.departureDate && new Date(booking.departureDate) >= startDate
            );
        }

        if (dateFilter.endDate) {
            const endDate = new Date(dateFilter.endDate);
            endDate.setHours(23, 59, 59, 999); // Cuối ngày
            filtered = filtered.filter(booking =>
                booking.departureDate && new Date(booking.departureDate) <= endDate
            );
        }

        setFilteredBookings(filtered);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const handleDateFilterChange = (e) => {
        const { name, value } = e.target;
        setDateFilter(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setDateFilter({
            startDate: '',
            endDate: ''
        });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await bookingsApi.updateStatus(id, status);
            setStatusUpdateId(null);
            setNewStatus('');
            setUpdateSuccess(true);
            setTimeout(() => setUpdateSuccess(false), 3000);
            fetchBookings();
        } catch (err) {
            console.error('Error updating booking status', err);
            setError('Failed to update booking status. Please try again.');
        }
    };

    const handleViewDetails = (bookingId) => {
        navigate(`/bookings/${bookingId}`);
    };

    if (loading && bookings.length === 0) {
        return (
            <div className="py-6">
                <div className="text-center">Loading bookings...</div>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'CONFIRMED':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    // Format price
    const formatPrice = (price) => {
        if (price === undefined || price === null) return 'N/A';
        return `$${price.toFixed(2)}`;
    };

    return (
        <div>
            <div className="py-6">
                <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>

                {/* Thanh tìm kiếm */}
                <div className="mt-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-grow">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Search by name, email, ID..."
                                />
                                <div className="absolute left-3 top-2.5 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Lọc theo trạng thái */}
                        <div className="md:w-48">
                            <select
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Statuses</option>
                                <option value="PENDING">Pending</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="CANCELLED">Cancelled</option>
                                <option value="COMPLETED">Completed</option>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={dateFilter.startDate}
                                        onChange={handleDateFilterChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={dateFilter.endDate}
                                        onChange={handleDateFilterChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
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
                        Found {filteredBookings.length} bookings
                        {(searchTerm || statusFilter || dateFilter.startDate || dateFilter.endDate) &&
                            ' with current filters'}
                    </div>
                </div>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4 mb-6">
                    <div className="text-sm text-red-700">{error}</div>
                </div>
            )}

            {updateSuccess && (
                <div className="rounded-md bg-green-50 p-4 mb-6">
                    <div className="text-sm text-green-700">Booking status updated successfully!</div>
                </div>
            )}

            {/* Bookings Table */}
            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Booking ID
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tour
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Dates
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Pickup
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredBookings.map((booking) => (
                                        <tr key={booking.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {booking.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{booking.customerName || 'N/A'}</div>
                                                <div className="text-sm text-gray-500">{booking.customerEmail || 'N/A'}</div>
                                                <div className="text-sm text-gray-500">{booking.whatsappNumber || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{booking.tourTitle || 'N/A'}</div>
                                                <div className="text-sm text-gray-500">ID: {booking.tourId || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div>Dep: {formatDate(booking.departureDate)}</div>
                                                <div>End: {formatDate(booking.endDate)}</div>
                                                <div>Booked: {formatDate(booking.bookingTime)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div>{booking.pickupLocation || 'N/A'}</div>
                                                <div>{booking.pickupAddress || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatPrice(booking.totalPrice)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {statusUpdateId === booking.id ? (
                                                    <select
                                                        value={newStatus}
                                                        onChange={(e) => setNewStatus(e.target.value)}
                                                        className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                    >
                                                        <option value="">Select Status</option>
                                                        <option value="PENDING">Pending</option>
                                                        <option value="CONFIRMED">Confirmed</option>
                                                        <option value="CANCELLED">Cancelled</option>
                                                        <option value="COMPLETED">Completed</option>
                                                    </select>
                                                ) : (
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                                        {booking.status || 'UNKNOWN'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {statusUpdateId === booking.id ? (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleStatusUpdate(booking.id, newStatus)}
                                                            disabled={!newStatus}
                                                            className="text-primary-600 hover:text-primary-900 disabled:opacity-50"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setStatusUpdateId(null);
                                                                setNewStatus('');
                                                            }}
                                                            className="text-gray-600 hover:text-gray-900"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col space-y-2">
                                                        <button
                                                            onClick={() => {
                                                                setStatusUpdateId(booking.id);
                                                                setNewStatus(booking.status || '');
                                                            }}
                                                            className="text-primary-600 hover:text-primary-900"
                                                        >
                                                            Change Status
                                                        </button>
                                                        <button
                                                            onClick={() => handleViewDetails(booking.id)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            View Details
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredBookings.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No bookings found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
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
                                Showing <span className="font-medium">{filteredBookings.length > 0 ? page * 10 + 1 : 0}</span> to{' '}
                                <span className="font-medium">{page * 10 + filteredBookings.length}</span> of{' '}
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
        </div>
    );
}

export default BookingsPage; 