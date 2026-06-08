import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { isAuthenticated, getAuthHeader } from '../utils/auth';
import { hardcodedProducts } from '../data/products';
import './ProductDetail.css';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIdx, setSelectedImageIdx] = useState(0);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        // Try hardcoded first
        const hardcoded = hardcodedProducts.find(p => p.id === parseInt(id));
        if (hardcoded) {
            setProduct(hardcoded);
            setLoading(false);
            return;
        }
        // Fallback to API
        try {
            const response = await axios.get(`/api/products/${id}`);
            setProduct(response.data);
        } catch (err) {
            console.error('Failed to fetch product:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        try {
            await axios.post('/api/cart',
                { product_id: product.id, quantity },
                { headers: getAuthHeader() }
            );
            alert('Product added to cart!');
            navigate('/cart');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to add to cart');
        }
    };

    const renderStars = (rating = 0) => {
        const fullStars = Math.floor(rating);
        const hasHalf = rating - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
        return (
            <span className="pd-stars">
                {'★'.repeat(fullStars)}
                {hasHalf && <span className="pd-star-half">★</span>}
                {'☆'.repeat(emptyStars)}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="page">
                <div className="container">
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="page">
                <div className="container">
                    <div className="empty-state">
                        <h3>Product not found</h3>
                        <button onClick={() => navigate('/')} className="btn btn-primary mt-lg">
                            Back to Products
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const discountPct = product.discount || 0;
    const originalPrice = product.originalPrice || null;

    return (
        <div className="page">
            <div className="container">
                {/* Breadcrumb */}
                <div className="pd-breadcrumb">
                    <button onClick={() => navigate('/')} className="pd-back-link">
                        ← Back to Products
                    </button>
                    {product.category && (
                        <span className="pd-category-crumb">
                            &nbsp;/&nbsp;{product.category}
                        </span>
                    )}
                </div>

                <div className="pd-layout">
                    {/* Left: Product Image */}
                    <div className="pd-image-section">
                        <div className="pd-main-image-wrap">
                            {product.imageUrl ? (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="pd-main-image"
                                />
                            ) : (
                                <div className="pd-image-placeholder">
                                    <span style={{ fontSize: '8rem' }}>📦</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Center: Product Details */}
                    <div className="pd-details-section">
                        <h1 className="pd-title">{product.name}</h1>

                        {/* Rating */}
                        <div className="pd-rating-row">
                            {renderStars(product.rating)}
                            <span className="pd-rating-count">
                                {product.reviewCount ? product.reviewCount.toLocaleString() : '0'} ratings
                            </span>
                            <span className="pd-divider">|</span>
                            <span className="pd-search-page">Search this page</span>
                        </div>

                        <div className="pd-separator"></div>

                        {/* Price */}
                        <div className="pd-price-section">
                            {discountPct > 0 && (
                                <div className="pd-deal-badge">
                                    <span className="pd-deal-label">Deal of the Day</span>
                                </div>
                            )}
                            <div className="pd-price-row">
                                {discountPct > 0 && (
                                    <span className="pd-discount-pct">-{discountPct}%</span>
                                )}
                                <span className="pd-price">
                                    <span className="pd-rupee-symbol">₹</span>
                                    {Math.floor(product.price).toLocaleString('en-IN')}
                                </span>
                            </div>
                            {originalPrice && originalPrice > product.price && (
                                <div className="pd-mrp-row">
                                    M.R.P.: <span className="pd-mrp-strikethrough">₹{Math.floor(originalPrice).toLocaleString('en-IN')}</span>
                                </div>
                            )}
                            <p className="pd-tax-note">Inclusive of all taxes</p>
                            <p className="pd-fulfilled">Fulfilled by <strong>AmazeStore</strong></p>
                        </div>

                        <div className="pd-separator"></div>

                        {/* About */}
                        <div className="pd-about">
                            <h3 className="pd-about-title">About this item</h3>
                            <p className="pd-description">{product.description || 'No description available.'}</p>
                        </div>
                    </div>

                    {/* Right: Buy Box */}
                    <div className="pd-buy-box">
                        <div className="pd-buy-price">
                            <span className="pd-rupee-symbol">₹</span>
                            {Math.floor(product.price).toLocaleString('en-IN')}
                        </div>

                        <div className="pd-delivery-info">
                            <span className="pd-free-delivery">FREE delivery</span>
                            <span> Tomorrow</span>
                        </div>
                        <p className="pd-order-within">
                            Order within <span className="pd-order-time">10 hrs 15 mins</span>
                        </p>

                        {/* Stock */}
                        <div className="pd-stock-status">
                            {product.stock > 0 ? (
                                <span className="pd-in-stock">In Stock</span>
                            ) : (
                                <span className="pd-out-stock">Currently unavailable</span>
                            )}
                            {product.stock < 10 && product.stock > 0 && (
                                <p className="pd-low-stock">Only {product.stock} left in stock - order soon.</p>
                            )}
                        </div>

                        {product.stock > 0 && (
                            <div className="pd-buy-actions">
                                {/* Quantity */}
                                <div className="pd-quantity-row">
                                    <label className="pd-qty-label">Qty:</label>
                                    <select
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                                        className="pd-qty-select"
                                    >
                                        {[...Array(Math.min(10, product.stock)).keys()].map(i => (
                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="pd-add-cart-btn"
                                >
                                    Add to Cart
                                </button>
                                <button className="pd-buy-now-btn">
                                    Buy Now
                                </button>
                            </div>
                        )}

                        {/* Secure transaction */}
                        <div className="pd-secure">
                            <span className="pd-secure-icon">🔒</span>
                            <span>Secure transaction</span>
                        </div>

                        <div className="pd-seller-info">
                            <p><span className="pd-seller-label">Ships from</span> <span>AmazeStore</span></p>
                            <p><span className="pd-seller-label">Sold by</span> <span>AmazeStore</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
