import axios from 'axios';

// Use environment variable if available, otherwise fallback to deployed backend
export const API_URL = process.env.REACT_APP_API_URL || 'https://meetuptravel-backend.onrender.com/api';

// Tours API
export const toursApi = {
    getAll: async (page = 0, size = 10) => {
        try {
            const response = await axios.get(`${API_URL}/tours?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/tours/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (tourData) => {
        try {
            const response = await axios.post(`${API_URL}/tours`, tourData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id, tourData) => {
        try {
            const response = await axios.put(`${API_URL}/tours/${id}`, tourData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id) => {
        try {
            await axios.delete(`${API_URL}/tours/${id}`);
            return true;
        } catch (error) {
            throw error;
        }
    },

    getHighlights: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/tours/${id}/highlights`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getIncludedServices: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/tours/${id}/included-services`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getExcludedServices: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/tours/${id}/excluded-services`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getPickupPoints: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/tours/${id}/pickup-points`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAdditionalServices: async (tourId) => {
        try {
            const response = await axios.get(`${API_URL}/tours/${tourId}/additional-services`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createAdditionalService: async (tourId, serviceData) => {
        try {
            const response = await axios.post(`${API_URL}/tours/${tourId}/additional-services`, serviceData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateAdditionalService: async (tourId, serviceId, serviceData) => {
        try {
            const response = await axios.put(`${API_URL}/tours/${tourId}/additional-services/${serviceId}`, serviceData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    addAdditionalService: async (tourId, serviceId) => {
        try {
            const response = await axios.post(`${API_URL}/tours/${tourId}/additional-services/${serviceId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    removeAdditionalService: async (tourId, serviceId, deleteService = false) => {
        try {
            await axios.delete(`${API_URL}/tours/${tourId}/additional-services/${serviceId}?deleteService=${deleteService}`);
            return true;
        } catch (error) {
            throw error;
        }
    }
};

// Tour Pricing API
export const tourPricingApi = {
    getByTourId: async (tourId) => {
        try {
            const response = await axios.get(`${API_URL}/tour-pricing/tour/${tourId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getByTourIdAndRoundTrip: async (tourId, isRoundTrip) => {
        try {
            const response = await axios.get(`${API_URL}/tour-pricing/tour/${tourId}/round-trip/${isRoundTrip}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/tour-pricing/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (tourId, pricingData) => {
        try {
            const response = await axios.post(`${API_URL}/tour-pricing/tour/${tourId}`, pricingData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id, pricingData) => {
        try {
            const response = await axios.put(`${API_URL}/tour-pricing/${id}`, pricingData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id) => {
        try {
            await axios.delete(`${API_URL}/tour-pricing/${id}`);
            return true;
        } catch (error) {
            throw error;
        }
    }
};

// Tour Reviews API
export const tourReviewsApi = {
    getByTourId: async (tourId) => {
        try {
            const response = await axios.get(`${API_URL}/tour-reviews/tour/${tourId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getByTourIdAndPlatform: async (tourId, platform) => {
        try {
            const response = await axios.get(`${API_URL}/tour-reviews/tour/${tourId}/platform/${platform}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/tour-reviews/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (tourId, reviewData) => {
        try {
            const response = await axios.post(`${API_URL}/tour-reviews/tour/${tourId}`, reviewData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id, reviewData) => {
        try {
            const response = await axios.put(`${API_URL}/tour-reviews/${id}`, reviewData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id) => {
        try {
            await axios.delete(`${API_URL}/tour-reviews/${id}`);
            return true;
        } catch (error) {
            throw error;
        }
    },

    countByTourId: async (tourId) => {
        try {
            const response = await axios.get(`${API_URL}/tour-reviews/count/tour/${tourId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

// Additional Services API
export const additionalServicesApi = {
    getAll: async () => {
        try {
            const response = await axios.get(`${API_URL}/additional-services`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/additional-services/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (serviceData) => {
        try {
            const response = await axios.post(`${API_URL}/additional-services`, serviceData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id, serviceData) => {
        try {
            const response = await axios.put(`${API_URL}/additional-services/${id}`, serviceData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id) => {
        try {
            await axios.delete(`${API_URL}/additional-services/${id}`);
            return true;
        } catch (error) {
            throw error;
        }
    }
};

// Bookings API
export const bookingsApi = {
    getAll: async (page = 0, size = 10) => {
        try {
            const response = await axios.get(`${API_URL}/bookings?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/bookings/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateStatus: async (id, status) => {
        try {
            const response = await axios.put(`${API_URL}/bookings/${id}/status?status=${status}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateBooking: async (id, bookingData) => {
        try {
            const response = await axios.put(`${API_URL}/bookings/${id}`, bookingData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteBooking: async (id) => {
        try {
            await axios.delete(`${API_URL}/bookings/${id}`);
            return true;
        } catch (error) {
            throw error;
        }
    },

    verifyPayment: async (paymentId) => {
        try {
            const response = await axios.post(`${API_URL}/payments/${paymentId}/verify`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getYearlyStats: async (year) => {
        try {
            const response = await axios.get(`${API_URL}/bookings/stats/yearly${year ? `?year=${year}` : ''}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

// Users API
export const usersApi = {
    getAll: async (page = 0, size = 10) => {
        try {
            const response = await axios.get(`${API_URL}/users?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/users/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

// Categories API
export const categoriesApi = {
    getAll: async (page = 0, size = 10) => {
        try {
            const response = await axios.get(`${API_URL}/categories?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAllList: async () => {
        try {
            const response = await axios.get(`${API_URL}/categories/all`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/categories/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (categoryData) => {
        try {
            const response = await axios.post(`${API_URL}/categories`, categoryData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id, categoryData) => {
        try {
            const response = await axios.put(`${API_URL}/categories/${id}`, categoryData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id) => {
        try {
            await axios.delete(`${API_URL}/categories/${id}`);
            return true;
        } catch (error) {
            throw error;
        }
    }
}; 