import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Check } from 'lucide-react';

interface LocationState {
    bookingId: number;
    tourName: string;
    departureDate: Date;
    customerName: string;
    totalPrice: number;
    paymentMethod?: string;
}

const BookingConfirmationPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as LocationState;

    // Move useEffect outside the conditional
    useEffect(() => {
        if (!state) {
            navigate('/');
        }
    }, [navigate, state]);

    // Early return if no state
    if (!state) {
        return null;
    }

    const { bookingId, tourName, departureDate, customerName, totalPrice, paymentMethod } = state;

    const formatDate = (date: Date | null) => {
        if (!date) return 'Not selected';
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex items-center justify-center mb-8">
                        <div className="bg-teal-100 rounded-full p-3 mr-4">
                            <Check className="h-10 w-10 text-teal-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">Booking Confirmed!</h1>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Booking ID</p>
                                <p className="font-semibold">{bookingId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Customer Name</p>
                                <p className="font-semibold">{customerName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Tour</p>
                                <p className="font-semibold">{tourName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Departure Date</p>
                                <p className="font-semibold">{formatDate(departureDate)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="font-semibold">${totalPrice.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Payment Status</p>
                                <p className="font-semibold">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {paymentMethod === 'VietQR' ? 'Paid with VietQR' : 'Processing'}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <p className="text-gray-600 mb-4">
                            Thank you for booking with Meetup Travel. We have sent a confirmation email with all the details.
                        </p>
                        <p className="text-gray-600">
                            Our team will contact you shortly via WhatsApp to confirm your booking and provide additional information.
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default BookingConfirmationPage; 