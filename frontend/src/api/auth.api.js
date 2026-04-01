import axios from 'axios';

const API_URL = '/api/auth';

const getToken = () => localStorage.getItem('token');

const setToken = (token) => localStorage.setItem('token', token);

const removeToken = () => localStorage.removeItem('token');

const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));

const removeUser = () => localStorage.removeItem('user');

export const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    if (response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
    }
    return response.data;
};

export const login = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
    }
    return response.data;
};
// Logout user
export const logout = () => {
    removeToken();
    removeUser();
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!getToken();
};

// Check if user is admin
export const isAdmin = () => {
    const user = getUser();
    return user && user.role === 'admin';
};

// Get auth header
export const getAuthHeader = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export { getToken, getUser };
