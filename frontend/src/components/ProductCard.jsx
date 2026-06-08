import { Link } from 'react-router-dom';
import './ProductCard.css';

export default function ProductCard({ product, onAddToCart }) {
    const handleAddToCart = () => {
        if (onAddToCart) {
            onAddToCart(product.id);
        }
    };

    // Build star rating display
    const renderStars = (rating = 0) => {
        const fullStars = Math.floor(rating);
        const hasHalf = rating - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
        return (
            <span className="pc-stars" aria-label={`${rating} out of 5 stars`}>
                {'★'.repeat(fullStars)}
                {hasHalf && <span className="pc-star-half">★</span>}
                {'☆'.repeat(emptyStars)}
            </span>
        );
    };

    // Badge colour map
    const badgeClassMap = {
        'Best Seller': 'pc-badge--bestseller',
        "Amazon's Choice": 'pc-badge--choice',
        'Limited Deal': 'pc-badge--limited',
        'Great Deal': 'pc-badge--great',
    };

    const discountPct = product.discount || (product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0);

    const originalPrice = product.originalPrice || (discountPct
        ? Math.round(product.price / (1 - discountPct / 100))
        : null);

    return (
        <div className="pc-card fade-in">
            {/* Badge */}
            {product.badge && (
                <span className={`pc-badge ${badgeClassMap[product.badge] || 'pc-badge--great'}`}>
                    {product.badge}
                </span>
            )}

            {/* Image */}
            <Link to={`/product/${product.id}`} className="pc-image-link">
                <div className="pc-image-container">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="pc-image"
                            loading="lazy"
                        />
                    ) : (
                        <div className="pc-image-placeholder">
                            <span className="pc-placeholder-icon">📦</span>
                        </div>
                    )}
                </div>
            </Link>

            {/* Info */}
            <div className="pc-info">
                {/* Name */}
                <Link to={`/product/${product.id}`} className="pc-name-link">
                    <h3 className="pc-name">{product.name}</h3>
                </Link>

                {/* Rating */}
                <div className="pc-rating">
                    {renderStars(product.rating || 0)}
                    <Link to={`/product/${product.id}`} className="pc-review-count">
                        {product.reviewCount != null ? product.reviewCount.toLocaleString() : '0'}
                    </Link>
                </div>

                {/* Price */}
                <div className="pc-price-row">
                    {discountPct > 0 && (
                        <span className="pc-discount-badge">-{discountPct}%</span>
                    )}
                    <span className="pc-price">
                        <span className="pc-rupee">₹</span>
                        <span className="pc-price-whole">{Math.floor(product.price).toLocaleString('en-IN')}</span>
                    </span>
                </div>

                {originalPrice && originalPrice > product.price && (
                    <div className="pc-mrp">
                        M.R.P: <span className="pc-mrp-value">₹{Math.floor(originalPrice).toLocaleString('en-IN')}</span>
                    </div>
                )}

                {/* Delivery */}
                <p className="pc-delivery">
                    <span className="pc-free">FREE delivery</span> by AmazeStore
                </p>

                {/* Stock */}
                <div className="pc-stock">
                    {product.stock === 0 && (
                        <span className="pc-stock--unavailable">Currently unavailable.</span>
                    )}
                    {product.stock > 0 && product.stock < 10 && (
                        <span className="pc-stock--low">Only {product.stock} left in stock – order soon.</span>
                    )}
                    {product.stock >= 10 && (
                        <span className="pc-stock--instock">In Stock</span>
                    )}
                </div>

                {/* Add to Cart */}
                <div className="pc-actions">
                    {onAddToCart && (
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="pc-add-btn"
                        >
                            Add to Cart
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
