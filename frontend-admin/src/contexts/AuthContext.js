import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decoded.exp > currentTime) {
                    setCurrentUser(decoded);
                    setIsAuthenticated(true);

                    // Set authorization header for all subsequent requests
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                } else {
                    // Token expired
                    handleLogout();
                }
            } catch (error) {
                handleLogout();
            }
        }
        setLoading(false);
    }, []);

    const handleLogin = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });

            const userData = response.data;

            if (userData.role !== 'ADMIN') {
                throw new Error('Access denied. Admin privileges required.');
            }

            localStorage.setItem('token', userData.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;

            setCurrentUser(userData);
            setIsAuthenticated(true);

            navigate('/');
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Login failed'
            };
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setCurrentUser(null);
        setIsAuthenticated(false);
        navigate('/login');
    };

    const value = {
        currentUser,
        isAuthenticated,
        login: handleLogin,
        logout: handleLogout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}; 