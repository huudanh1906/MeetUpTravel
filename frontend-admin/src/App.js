import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ToursPage from './pages/ToursPage';
import BookingsPage from './pages/BookingsPage';
import BookingDetailsPage from './pages/BookingDetailsPage';
import UsersPage from './pages/UsersPage';
import CategoriesPage from './pages/CategoriesPage';
import TourForm from './pages/TourForm';
import TourPricingPage from './pages/TourPricingPage';
import TourAdditionalServicesPage from './pages/TourAdditionalServicesPage';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected route component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route path="/" element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="tours" element={<ToursPage />} />
                    <Route path="tours/new" element={<TourForm />} />
                    <Route path="tours/:id/edit" element={<TourForm />} />
                    <Route path="tours/:tourId/pricing" element={<TourPricingPage />} />
                    <Route path="tours/:tourId/additional-services" element={<TourAdditionalServicesPage />} />
                    <Route path="categories" element={<CategoriesPage />} />
                    <Route path="bookings" element={<BookingsPage />} />
                    <Route path="bookings/:id" element={<BookingDetailsPage />} />
                    <Route path="users" element={<UsersPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AuthProvider>
    );
}

export default App; 