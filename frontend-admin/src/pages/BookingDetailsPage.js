import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingsApi, toursApi } from '../services/api';

function BookingDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [tourDetails, setTourDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusUpdateMode, setStatusUpdateMode] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [paymentVerifyMode, setPaymentVerifyMode] = useState(false);
    const [paymentUpdateSuccess, setPaymentUpdateSuccess] = useState(false);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                setLoading(true);
                const bookingData = await bookingsApi.getById(id);
                setBooking(bookingData);
                setNewStatus(bookingData.status || '');

                // Fetch tour details if tourId exists
                if (bookingData.tourId) {
                    try {
                        const tourData = await toursApi.getById(bookingData.tourId);
                        setTourDetails(tourData);
                    } catch (tourErr) {
                        console.error('Error fetching tour details', tourErr);
                    }
                }
            } catch (err) {
                console.error('Error fetching booking details', err);
                setError('Failed to load booking details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [id]);

    const handleStatusUpdate = async () => {
        try {
            await bookingsApi.updateStatus(id, newStatus);
            setStatusUpdateMode(false);
            setUpdateSuccess(true);
            setTimeout(() => setUpdateSuccess(false), 3000);

            // Refresh booking data
            const updatedBooking = await bookingsApi.getById(id);
            setBooking(updatedBooking);
        } catch (err) {
            console.error('Error updating booking status', err);
            setError('Failed to update booking status. Please try again.');
        }
    };

    const handleDeleteBooking = async () => {
        setDeleteLoading(true);
        try {
            await bookingsApi.deleteBooking(id);
            navigate('/bookings', {
                state: { successMessage: 'Booking deleted successfully' }
            });
        } catch (err) {
            console.error('Error deleting booking', err);
            setError('Failed to delete booking. Please try again.');
            setDeleteLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleVerifyPayment = async (paymentId) => {
        try {
            await bookingsApi.verifyPayment(paymentId);
            setPaymentVerifyMode(false);
            setPaymentUpdateSuccess(true);
            setTimeout(() => setPaymentUpdateSuccess(false), 3000);

            // Refresh booking data
            const updatedBooking = await bookingsApi.getById(id);
            setBooking(updatedBooking);
        } catch (err) {
            console.error('Error verifying payment', err);
            setError('Failed to verify payment. Please try again.');
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    // Format full datetime
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return 'N/A';
        const date = new Date(dateTimeString);
        return date.toLocaleString();
    };

    // Format price
    const formatPrice = (price) => {
        if (price === undefined || price === null) return 'N/A';
        return `$${price.toFixed(2)}`;
    };

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

    // Calculate subtotal of pricing options
    const calculateSubtotal = (items) => {
        if (!items || !items.length) return 0;
        return items.reduce((total, item) => {
            const quantity = item.quantity || 1;
            return total + (item.price * quantity);
        }, 0);
    };

    if (loading) {
        return (
            <div className="py-6">
                <div className="text-center">Loading booking details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-6">
                <div className="rounded-md bg-red-50 p-4 mb-6">
                    <div className="text-sm text-red-700">{error}</div>
                </div>
                <button
                    onClick={() => navigate('/bookings')}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
                >
                    Back to Bookings
                </button>
            </div>
        );
    }

    return (
        <div className="py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={() => navigate('/bookings')}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
                    >
                        Back to Bookings
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                    >
                        Delete Booking
                    </button>
                </div>
            </div>

            {updateSuccess && (
                <div className="rounded-md bg-green-50 p-4 mb-6">
                    <div className="text-sm text-green-700">Booking status updated successfully!</div>
                </div>
            )}

            {paymentUpdateSuccess && (
                <div className="rounded-md bg-green-50 p-4 mb-6">
                    <div className="text-sm text-green-700">Payment verification completed successfully!</div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete this booking? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteBooking}
                                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded flex items-center"
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete Booking'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {booking && (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                    {/* Booking Header */}
                    <div className="px-4 py-5 sm:px-6 bg-gray-50 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Booking #{booking.id}
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Created on {formatDateTime(booking.bookingTime)}
                            </p>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-3">Status:</span>
                            {statusUpdateMode ? (
                                <div className="flex space-x-2">
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="PENDING">Pending</option>
                                        <option value="CONFIRMED">Confirmed</option>
                                        <option value="CANCELLED">Cancelled</option>
                                        <option value="COMPLETED">Completed</option>
                                    </select>
                                    <button
                                        onClick={handleStatusUpdate}
                                        disabled={!newStatus}
                                        className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded disabled:opacity-50"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setStatusUpdateMode(false);
                                            setNewStatus(booking.status || '');
                                        }}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                        {booking.status || 'UNKNOWN'}
                                    </span>
                                    <button
                                        onClick={() => setStatusUpdateMode(true)}
                                        className="ml-3 text-primary-600 hover:text-primary-900 text-xs"
                                    >
                                        Change
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Booking Details Grid */}
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Tour</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <div className="flex items-start">
                                        {booking.tourImageUrl && (
                                            <img src={booking.tourImageUrl} alt={booking.tourTitle} className="h-20 w-32 object-cover rounded mr-4" />
                                        )}
                                        <div>
                                            <div className="text-lg font-medium">{booking.tourTitle || 'N/A'}</div>
                                            <div className="text-gray-500">ID: {booking.tourId || 'N/A'}</div>
                                            {tourDetails && (
                                                <div className="text-gray-500 mt-1">
                                                    {tourDetails.category?.name || 'No category'} • {tourDetails.location || 'No location'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Customer</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <div>{booking.customerName || 'N/A'}</div>
                                    <div className="text-gray-500">{booking.customerEmail || 'N/A'}</div>
                                    <div className="text-gray-500">Whatsapp: {booking.whatsappNumber || 'N/A'}</div>
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Tour Dates</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <div>Departure: {formatDate(booking.departureDate)}</div>
                                    <div>End: {formatDate(booking.endDate)}</div>
                                    <div className="text-gray-500 mt-1">
                                        {booking.departureDate && booking.endDate && (
                                            <>
                                                Duration: {Math.ceil((new Date(booking.endDate) - new Date(booking.departureDate)) / (1000 * 60 * 60 * 24))} days
                                            </>
                                        )}
                                    </div>
                                </dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Pickup Information</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <div>Location: {booking.pickupLocation || 'N/A'}</div>
                                    <div>Address: {booking.pickupAddress || 'N/A'}</div>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            )}

            {/* Order Summary */}
            {booking && (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                    <div className="px-4 py-5 sm:px-6 bg-gray-50">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Order Summary
                        </h3>
                    </div>
                    <div className="border-t border-gray-200">
                        <div className="px-4 py-5 sm:px-6">
                            <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Item
                                            </th>
                                            <th scope="col" className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th scope="col" className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th scope="col" className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">

                                        {/* Pricing Options */}
                                        {booking.pricingOptions && booking.pricingOptions.map((option, index) => (
                                            <tr key={`pricing-${index}`}>
                                                <td className="py-4 text-sm text-gray-900">
                                                    <div className="font-medium">
                                                        {option.customerType === 'ADULT' ? 'Adult' :
                                                            option.customerType === 'CHILD_0_TO_2' ? 'Child (0-2 years)' :
                                                                option.customerType === 'CHILD_3_TO_10' ? 'Child (3-10 years)' :
                                                                    option.customerType || 'Standard Ticket'}
                                                    </div>
                                                    <div className="text-gray-500">
                                                        {option.roundTrip ? 'Round-trip' : 'One-way'} ticket
                                                    </div>
                                                </td>
                                                <td className="py-4 text-sm text-gray-500 text-center">
                                                    {option.quantity || 1}
                                                </td>
                                                <td className="py-4 text-sm text-gray-500 text-right">
                                                    {formatPrice(option.price)}
                                                </td>
                                                <td className="py-4 text-sm text-gray-900 text-right">
                                                    {formatPrice(option.subtotal || (option.price * (option.quantity || 1)))}
                                                </td>
                                            </tr>
                                        ))}

                                        {/* Additional Services */}
                                        {booking.additionalServices && booking.additionalServices.map((service, index) => (
                                            <tr key={`service-${index}`} className="bg-gray-50">
                                                <td className="py-4 text-sm text-gray-900">
                                                    <div className="font-medium">{service.serviceName || 'Additional Service'}</div>
                                                    <div className="text-gray-500">{service.serviceType || 'Extra service'}</div>
                                                </td>
                                                <td className="py-4 text-sm text-gray-500 text-center">
                                                    {service.quantity || 1}
                                                </td>
                                                <td className="py-4 text-sm text-gray-500 text-right">
                                                    {formatPrice(service.price)}
                                                </td>
                                                <td className="py-4 text-sm text-gray-900 text-right">
                                                    {formatPrice(service.subtotal || (service.price * (service.quantity || 1)))}
                                                </td>
                                            </tr>
                                        ))}

                                        {/* Subtotal and Total */}
                                        <tr className="bg-gray-50">
                                            <td colSpan="3" className="py-4 text-sm font-medium text-gray-900 text-right">
                                                Subtotal
                                            </td>
                                            <td className="py-4 text-sm text-gray-900 text-right">
                                                {formatPrice(calculateSubtotal(booking.pricingOptions) + calculateSubtotal(booking.additionalServices))}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3" className="py-4 text-base font-bold text-gray-900 text-right">
                                                Total
                                            </td>
                                            <td className="py-4 text-base font-bold text-gray-900 text-right">
                                                {formatPrice(booking.totalPrice)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Information */}
            {booking && (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                    <div className="px-4 py-5 sm:px-6 bg-gray-50">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Payment Information
                        </h3>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Payment ID</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {booking.paymentId || 'Not available'}
                                </dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Payment History</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {booking.payments && booking.payments.length > 0 ? (
                                        <div className="flow-root">
                                            <ul className="-mb-8">
                                                {booking.payments.map((payment, index) => (
                                                    <li key={index}>
                                                        <div className="relative pb-8">
                                                            {index !== booking.payments.length - 1 && (
                                                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                                            )}
                                                            <div className="relative flex space-x-3">
                                                                <div>
                                                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${payment.paymentStatus === 'COMPLETED' ? 'bg-green-500' : payment.paymentStatus === 'PENDING' ? 'bg-yellow-500' : 'bg-gray-500'}`}>
                                                                        {payment.paymentStatus === 'COMPLETED' ? (
                                                                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                            </svg>
                                                                        ) : (
                                                                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                                            </svg>
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                                    <div>
                                                                        <p className="text-sm text-gray-900">{payment.paymentMethod || 'Unknown method'}</p>
                                                                        <p className="text-sm text-gray-500">ID: {payment.id || 'Not available'}</p>
                                                                        <p className="text-sm text-gray-500">
                                                                            Status: <span className={`font-medium ${payment.paymentStatus === 'COMPLETED' ? 'text-green-600' : payment.paymentStatus === 'PENDING' ? 'text-yellow-600' : 'text-gray-600'}`}>
                                                                                {payment.paymentStatus}
                                                                            </span>
                                                                            {payment.paymentStatus === 'PENDING' && payment.paymentMethod === 'VietQR' && (
                                                                                <button
                                                                                    onClick={() => handleVerifyPayment(payment.id)}
                                                                                    className="ml-2 text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
                                                                                >
                                                                                    Verify Payment
                                                                                </button>
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                    <div className="text-right text-sm whitespace-nowrap">
                                                                        <p className="text-gray-900">{formatPrice(payment.amount)}</p>
                                                                        <p className="text-gray-500">{formatDateTime(payment.paymentTime)}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <div className="text-gray-500">No payment records found</div>
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            )}

            {/* Additional Notes */}
            {booking && (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 bg-gray-50">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Additional Notes
                        </h3>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="bg-white px-4 py-5 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 mb-2">Customer Notes</dt>
                                <dd className="mt-1 text-sm text-gray-900 border border-gray-200 rounded-md p-3 bg-gray-50">
                                    {booking.noteForMeetup || 'No notes provided by the customer.'}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookingDetailsPage; 