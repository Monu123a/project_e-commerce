import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import { isAuthenticated, isAdmin, getAuthHeader } from './utils/auth';

// Protected Route Component
function ProtectedRoute({ children }) {
    return isAuthenticated() ? children : <Navigate to="/login" />;
}

// Admin Route Component
function AdminRoute({ children }) {
    return isAuthenticated() && isAdmin() ? children : <Navigate to="/" />;
}

export default function App() {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        if (isAuthenticated()) {
            fetchCartCount();
        }
    }, []);

    const fetchCartCount = async () => {
        try {
            const response = await axios.get('/api/cart', {
                headers: getAuthHeader()
            });
            setCartCount(response.data.items.length);
        } catch (err) {
            console.error('Failed to fetch cart count:', err);
        }
    };

    return (
        <Router>
            <div className="app">
                <Navbar cartCount={cartCount} />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute>
                                <Cart />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute>
                                <Orders />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/products"
                        element={
                            <AdminRoute>
                                <AdminProducts />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/orders"
                        element={
                            <AdminRoute>
                                <AdminOrders />
                            </AdminRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}
