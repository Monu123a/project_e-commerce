import { Link } from 'react-router-dom';
import { getUser, logout, isAdmin } from '../utils/auth';
import { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar({ cartCount = 0 }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser(getUser());
    }, []);

    const handleLogout = () => {
        logout();
        setUser(null);
        window.location.href = '/';
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="navbar-brand">
                        <span className="brand-icon">⚡</span>
                        <span className="brand-text">TechStore</span>
                    </Link>

                    <div className="navbar-links">
                        <Link to="/" className="nav-link">Products</Link>

                        {user ? (
                            <>
                                <Link to="/cart" className="nav-link cart-link">
                                    Cart
                                    {cartCount > 0 && (
                                        <span className="cart-badge">{cartCount}</span>
                                    )}
                                </Link>
                                <Link to="/orders" className="nav-link">Orders</Link>

                                {isAdmin() && (
                                    <>
                                        <Link to="/admin/products" className="nav-link admin-link">
                                            Admin Products
                                        </Link>
                                        <Link to="/admin/orders" className="nav-link admin-link">
                                            Admin Orders
                                        </Link>
                                    </>
                                )}

                                <div className="user-menu">
                                    <span className="user-name">{user.name}</span>
                                    <button onClick={handleLogout} className="btn btn-sm btn-secondary">
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-sm btn-secondary">Login</Link>
                                <Link to="/register" className="btn btn-sm btn-primary">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
