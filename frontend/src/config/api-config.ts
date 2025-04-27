// Use environment variable if available, otherwise fallback to deployed backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Helper function to safely fetch API data
export const fetchData = async (endpoint: string, options = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            ...options
        });

        if (!response.ok) {
            console.error(`API error: ${response.status} on ${endpoint}`);
            return null;
        }

        const text = await response.text();
        if (!text || text.trim() === '') return null;

        try {
            return JSON.parse(text);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            return null;
        }
    } catch (error) {
        console.error(`Network error on ${endpoint}:`, error);
        return null;
    }
};

export default API_BASE_URL; 