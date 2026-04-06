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
                        <span className="brand-icon">🛒</span>
                        <span className="brand-text">AmazeStore</span>
                    </Link>

                    <div className="navbar-links">
                        <Link to="/" className="nav-link">
                            <span className="user-name">Hello,</span>
                            <b>Explore</b>
                        </Link>

                        {user ? (
                            <>
                                <div className="nav-link">
                                    <span className="user-name">Hello, {user.name.split(' ')[0]}</span>
                                    <b>Account & Lists</b>
                                </div>
                                
                                <Link to="/orders" className="nav-link">
                                    <span className="user-name">Returns</span>
                                    <b>& Orders</b>
                                </Link>

                                {isAdmin() && (
                                    <>
                                        <Link to="/admin/products" className="nav-link admin-link">
                                            Admin
                                            <b>Products</b>
                                        </Link>
                                        <Link to="/admin/orders" className="nav-link admin-link">
                                            Admin
                                            <b>Orders</b>
                                        </Link>
                                    </>
                                )}

                                <Link to="/cart" className="nav-link cart-link">
                                    <span className="cart-badge">{cartCount}</span>
                                    <b>Cart</b>
                                </Link>

                                <button onClick={handleLogout} className="btn btn-sm btn-secondary" style={{ marginLeft: '10px' }}>
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="nav-link">
                                    <span className="user-name">Hello, sign in</span>
                                    <b>Account & Lists</b>
                                </Link>
                                <Link to="/register" className="btn btn-sm btn-primary">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
