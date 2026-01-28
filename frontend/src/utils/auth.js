
// Authentication utility functions
// These help manage the user's login session

// Get auth token from localStorage
export const getToken = () => localStorage.getItem('token');

// Set auth token in localStorage
export const setToken = (token) => localStorage.setItem('token', token);

// Remove auth token
export const removeToken = () => localStorage.removeItem('token');

// Get current user from localStorage
export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Set current user
export const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));

// Remove current user
export const removeUser = () => localStorage.removeItem('user');

// Logout user (clears everything)
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

// Get auth header for Axios requests
export const getAuthHeader = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};
