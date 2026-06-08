import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
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

// Footer Component
function Footer() {
    const footerStyle = {
        background: '#131921',
        color: '#ddd',
        padding: '0',
        marginTop: '40px',
        fontSize: '0.85rem',
    };

    const topStyle = {
        display: 'block',
        width: '100%',
        padding: '14px',
        background: '#37475a',
        color: '#fff',
        textAlign: 'center',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.82rem',
        fontWeight: '500',
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px 30px',
    };

    const colTitleStyle = {
        color: '#fff',
        fontWeight: '700',
        fontSize: '0.9rem',
        marginBottom: '12px',
    };

    const linkStyle = {
        display: 'block',
        color: '#ddd',
        textDecoration: 'none',
        padding: '3px 0',
        fontSize: '0.82rem',
        transition: 'color 0.2s',
    };

    const bottomStyle = {
        borderTop: '1px solid #3d4f5f',
        textAlign: 'center',
        padding: '20px',
        fontSize: '0.78rem',
        color: '#999',
    };

    return (
        <footer style={footerStyle}>
            <button style={topStyle} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Back to top
            </button>

            <div style={gridStyle}>
                <div>
                    <h4 style={colTitleStyle}>Get to Know Us</h4>
                    <Link to="/" style={linkStyle}>About AmazeStore</Link>
                    <a href="#" style={linkStyle}>Careers</a>
                    <a href="#" style={linkStyle}>Press Releases</a>
                    <a href="#" style={linkStyle}>AmazeStore Science</a>
                </div>
                <div>
                    <h4 style={colTitleStyle}>Connect with Us</h4>
                    <a href="#" style={linkStyle}>Facebook</a>
                    <a href="#" style={linkStyle}>Twitter</a>
                    <a href="#" style={linkStyle}>Instagram</a>
                </div>
                <div>
                    <h4 style={colTitleStyle}>Make Money with Us</h4>
                    <a href="#" style={linkStyle}>Sell on AmazeStore</a>
                    <a href="#" style={linkStyle}>Sell under AmazeStore Accelerator</a>
                    <a href="#" style={linkStyle}>Protect and Build Your Brand</a>
                    <a href="#" style={linkStyle}>AmazeStore Global Selling</a>
                </div>
                <div>
                    <h4 style={colTitleStyle}>Let Us Help You</h4>
                    <Link to="/orders" style={linkStyle}>Your Orders</Link>
                    <a href="#" style={linkStyle}>Returns Centre</a>
                    <a href="#" style={linkStyle}>Recalls and Product Safety Alerts</a>
                    <Link to="/cart" style={linkStyle}>Your Cart</Link>
                    <a href="#" style={linkStyle}>Customer Service</a>
                </div>
            </div>

            <div style={bottomStyle}>
                © {new Date().getFullYear()} AmazeStore. All rights reserved.
            </div>
        </footer>
    );
}

export default function App() {
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCategory, setSearchCategory] = useState('');

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

    const handleSearch = (query, category) => {
        setSearchQuery(query);
        setSearchCategory(category || '');
    };

    return (
        <Router>
            <div className="app">
                <Navbar cartCount={cartCount} onSearch={handleSearch} />

                <Routes>
                    <Route
                        path="/"
                        element={
                            <Home
                                searchQuery={searchQuery}
                                searchCategory={searchCategory}
                                onSearch={handleSearch}
                            />
                        }
                    />
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

                <Footer />
            </div>
        </Router>
    );
}
