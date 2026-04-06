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
            <Link to={`/product/${product.id}`} className="product-image-link">
                <div className="product-image" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                    {product.imageUrl ? (
                        <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                    ) : (
                        <div className="product-image-placeholder" style={{ backgroundColor: '#f3f3f3', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '4rem' }}>📦</span>
                        </div>
                    )}
                </div>
            </Link>

            <div className="product-info" style={{ padding: '0 10px 10px' }}>
                <Link to={`/product/${product.id}`} style={{ color: '#007185', textDecoration: 'none' }}>
                    <h3 className="product-name" style={{ fontSize: '1rem', marginBottom: '5px', height: '2.4em', overflow: 'hidden' }}>{product.name}</h3>
                </Link>
                
                <div className="product-rating" style={{ color: '#ffa41c', marginBottom: '5px' }}>
                    ★★★★☆ <span style={{ color: '#007185', fontSize: '0.8rem' }}> (42)</span>
                </div>

                <div className="product-price" style={{ marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.8rem', position: 'relative', top: '-0.3em' }}>₹</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>{Math.floor(product.price)}</span>
                    <span style={{ fontSize: '0.8rem', position: 'relative', top: '-0.3em' }}>{(product.price % 1).toFixed(2).substring(1)}</span>
                </div>

                <div className="product-stock-info" style={{ fontSize: '12px', marginBottom: '10px' }}>
                    {product.stock < 10 && product.stock > 0 && (
                        <span style={{ color: '#B12704' }}>Only {product.stock} left in stock - order soon.</span>
                    )}
                    {product.stock === 0 && (
                        <span style={{ color: '#B12704', fontWeight: '700' }}>Currently unavailable.</span>
                    )}
                    {product.stock >= 10 && (
                        <span style={{ color: '#007600' }}>In Stock</span>
                    )}
                </div>

                <div className="product-actions" style={{ marginTop: 'auto' }}>
                    {onAddToCart && (
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="btn btn-primary w-full"
                            style={{ borderRadius: '20px' }}
                        >
                            Add to Cart
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
