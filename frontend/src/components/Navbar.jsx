import { Link, useNavigate } from 'react-router-dom';
import { getUser, logout, isAdmin } from '../utils/auth';
import { useState, useEffect } from 'react';
import './Navbar.css';

const CATEGORIES = [
    'All',
    'Mobiles',
    'Computers',
    'Audio',
    'Cameras',
    'Wearables',
    'Accessories',
];

export default function Navbar({ cartCount = 0, onSearch, searchQuery = '', searchCategory = 'All' }) {
    const [user, setUser] = useState(null);
    const [localQuery, setLocalQuery] = useState(searchQuery);
    const [localCategory, setLocalCategory] = useState(searchCategory);
    const navigate = useNavigate();

    useEffect(() => {
        setUser(getUser());
    }, []);

    useEffect(() => {
        setLocalQuery(searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        setLocalCategory(searchCategory);
    }, [searchCategory]);

    const handleLogout = () => {
        logout();
        setUser(null);
        window.location.href = '/';
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(localQuery, localCategory);
        }
        navigate('/');
    };

    const handleCategoryChange = (e) => {
        const newCategory = e.target.value;
        setLocalCategory(newCategory);
        if (onSearch) {
            onSearch(localQuery, newCategory);
        }
        navigate('/');
    };

    return (
        <header className="amz-header">
            {/* ── Main Navigation Bar ── */}
            <nav className="amz-nav-main">
                <div className="amz-nav-main-inner">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="amz-logo"
                        aria-label="AmazeStore Home"
                        onClick={() => {
                            setLocalQuery('');
                            setLocalCategory('All');
                            if (onSearch) {
                                onSearch('', 'All');
                            }
                        }}
                    >
                        <span className="amz-logo-icon">🛒</span>
                        <span className="amz-logo-text">
                            Ebay<span className="amz-logo-highlight">Store</span>
                        </span>
                    </Link>

                    {/* Deliver To */}
                    <Link to="/" className="amz-deliver-to">
                        <span className="amz-deliver-label">Deliver to</span>
                        <span className="amz-deliver-location">
                            <span className="amz-location-icon">📍</span>
                            India
                        </span>
                    </Link>

                    {/* Search Bar */}
                    <form className="amz-search" onSubmit={handleSearchSubmit} role="search">
                        <select
                            className="amz-search-category"
                            value={localCategory}
                            onChange={handleCategoryChange}
                            aria-label="Search category"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        <input
                            className="amz-search-input"
                            type="text"
                            placeholder="Search AmazeStore"
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                            aria-label="Search"
                        />
                        <button className="amz-search-btn" type="submit" aria-label="Search">
                            <span className="amz-search-icon">🔍</span>
                        </button>
                    </form>

                    {/* Right-side Links */}
                    <div className="amz-nav-links">
                        {user ? (
                            <>
                                <div className="amz-nav-link" tabIndex={0}>
                                    <span className="amz-nav-line1">Hello, {user.name.split(' ')[0]}</span>
                                    <span className="amz-nav-line2">Account &amp; Lists</span>
                                </div>

                                <Link to="/orders" className="amz-nav-link">
                                    <span className="amz-nav-line1">Returns</span>
                                    <span className="amz-nav-line2">&amp; Orders</span>
                                </Link>

                                {isAdmin() && (
                                    <>
                                        <Link to="/admin/products" className="amz-nav-link amz-admin-link">
                                            <span className="amz-nav-line1">Admin</span>
                                            <span className="amz-nav-line2">Products</span>
                                        </Link>
                                        <Link to="/admin/orders" className="amz-nav-link amz-admin-link">
                                            <span className="amz-nav-line1">Admin</span>
                                            <span className="amz-nav-line2">Orders</span>
                                        </Link>
                                    </>
                                )}

                                <Link to="/cart" className="amz-cart-link">
                                    <div className="amz-cart-icon-wrap">
                                        <span className="amz-cart-count">{cartCount}</span>
                                        <svg className="amz-cart-svg" viewBox="0 0 40 40" aria-hidden="true">
                                            <path d="M36.5 31h-26l-4-22h-5v-3h7.5l4 22h21.5l3-14h-26l-.5-3h29z" fill="currentColor"/>
                                            <circle cx="14" cy="36" r="3" fill="currentColor"/>
                                            <circle cx="32" cy="36" r="3" fill="currentColor"/>
                                        </svg>
                                    </div>
                                    <span className="amz-cart-text">Cart</span>
                                </Link>

                                <button onClick={handleLogout} className="amz-signout-btn">
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="amz-nav-link">
                                    <span className="amz-nav-line1">Hello, sign in</span>
                                    <span className="amz-nav-line2">Account &amp; Lists</span>
                                </Link>

                                <Link to="/login" className="amz-nav-link">
                                    <span className="amz-nav-line1">Returns</span>
                                    <span className="amz-nav-line2">&amp; Orders</span>
                                </Link>

                                <Link to="/cart" className="amz-cart-link">
                                    <div className="amz-cart-icon-wrap">
                                        <span className="amz-cart-count">{cartCount}</span>
                                        <svg className="amz-cart-svg" viewBox="0 0 40 40" aria-hidden="true">
                                            <path d="M36.5 31h-26l-4-22h-5v-3h7.5l4 22h21.5l3-14h-26l-.5-3h29z" fill="currentColor"/>
                                            <circle cx="14" cy="36" r="3" fill="currentColor"/>
                                            <circle cx="32" cy="36" r="3" fill="currentColor"/>
                                        </svg>
                                    </div>
                                    <span className="amz-cart-text">Cart</span>
                                </Link>

                                <Link to="/register" className="amz-signup-btn">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* ── Secondary Navigation Bar ── */}
            <nav className="amz-nav-secondary">
                <div className="amz-nav-secondary-inner">
                    <Link to="/" className="amz-sub-link">Today's Deals</Link>
                    <Link to="/" className="amz-sub-link">Customer Service</Link>
                    <Link to="/" className="amz-sub-link">Electronics</Link>
                    <Link to="/" className="amz-sub-link">Fashion</Link>
                    <Link to="/" className="amz-sub-link">New Arrivals</Link>
                    <Link to="/" className="amz-sub-link">Best Sellers</Link>
                </div>
            </nav>
        </header>
    );
}
