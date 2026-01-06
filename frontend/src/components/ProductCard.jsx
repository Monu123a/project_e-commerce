import { Link } from 'react-router-dom';
import './ProductCard.css';

export default function ProductCard({ product, onAddToCart }) {
    const handleAddToCart = () => {
        if (onAddToCart) {
            onAddToCart(product.id);
        }
    };

    return (
        <div className="product-card card fade-in">
            <div className="product-image">
                <div className="product-image-placeholder">
                    <span className="product-icon"></span>
                </div>
                {product.stock < 10 && product.stock > 0 && (
                    <span className="badge badge-warning stock-badge">Low Stock</span>
                )}
                {product.stock === 0 && (
                    <span className="badge badge-error stock-badge">Out of Stock</span>
                )}
            </div>

            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>

                <div className="product-footer">
                    <div className="product-price">
                        <span className="price-label">Price</span>
                        <span className="price-value">₹{product.price}</span>
                    </div>

                    <div className="product-actions">
                        <Link to={`/product/${product.id}`} className="btn btn-sm btn-secondary">
                            View Details
                        </Link>
                        {onAddToCart && (
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="btn btn-sm btn-primary"
                            >
                                Add to Cart
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
