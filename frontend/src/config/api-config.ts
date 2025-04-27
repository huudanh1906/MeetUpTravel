// Use environment variable if available, otherwise fallback to deployed backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://meetuptravel-backend.onrender.com/api';

export default API_BASE_URL; 