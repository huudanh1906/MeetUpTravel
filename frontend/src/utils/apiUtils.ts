import API_BASE_URL, { fetchData } from '../config/api-config';

// Logger để debug các API calls
export const logApiCall = (endpoint: string, data: any = null) => {
    console.group(`API Call: ${endpoint}`);
    console.log('URL:', `${API_BASE_URL}${endpoint}`);
    if (data) console.log('Data:', data);
    console.groupEnd();
};

// Hàm wrapper cho fetch API với logging
export const callApi = async (
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data: any = null
) => {
    logApiCall(endpoint, data);

    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        credentials: 'include',
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const result = await fetchData(endpoint, options);
        console.log(`API Result (${endpoint}):`, result);
        return result;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        return null;
    }
};

// Hàm tiện ích để lấy chi tiết tour
export const getTourDetails = async (tourId: string | number) => {
    const tour = await callApi(`/tours/${tourId}`);
    if (!tour) return null;

    // Bổ sung dữ liệu từ các API endpoint khác
    try {
        const highlights = await callApi(`/tours/${tourId}/highlights`);
        const includedServices = await callApi(`/tours/${tourId}/included-services`);
        const excludedServices = await callApi(`/tours/${tourId}/excluded-services`);
        const pickupPoints = await callApi(`/tours/${tourId}/pickup-points`);
        const additionalServices = await callApi(`/tours/${tourId}/additional-services`);

        // Gộp dữ liệu
        return {
            ...tour,
            highlights: highlights || [],
            includedServices: includedServices || [],
            excludedServices: excludedServices || [],
            pickupPoints: pickupPoints || [],
            additionalServices: additionalServices || []
        };
    } catch (error) {
        console.error('Error fetching tour details:', error);
        return tour; // Trả về thông tin tour cơ bản nếu có lỗi
    }
};

// Hàm tiện ích để tạo booking
export const createBooking = async (bookingData: any) => {
    return callApi('/bookings', 'POST', bookingData);
};

// Hàm tiện ích để xác nhận thanh toán
export const confirmPayment = async (bookingId: number | string, method: string = 'vietqr') => {
    return callApi(`/bookings/${bookingId}/confirm-${method}-payment`, 'POST');
}; 