import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { isAuthenticated, getAuthHeader } from '../utils/auth';
import './ProductDetail.css';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
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

    return (
        <div className="page">
            <div className="container">
                <button onClick={() => navigate('/')} className="btn btn-sm btn-secondary mb-lg">
                    ← Back to Products
                </button>

                <div className="product-detail-layout">
                    <div className="product-detail-image card">
                        <div className="product-image-large">
                            <span className="product-icon-large"></span>
                        </div>
                        {product.stock < 10 && product.stock > 0 && (
                            <span className="badge badge-warning stock-badge">Only {product.stock} left!</span>
                        )}
                        {product.stock === 0 && (
                            <span className="badge badge-error stock-badge">Out of Stock</span>
                        )}
                    </div>

                    <div className="product-detail-info card">
                        <h1 className="product-detail-name">{product.name}</h1>

                        <div className="product-detail-price">
                            <span className="price-label">Price</span>
                            <span className="price-value">₹{product.price}</span>
                        </div>

                        <div className="product-detail-description">
                            <h3>Description</h3>
                            <p>{product.description || 'No description available.'}</p>
                        </div>

                        <div className="product-detail-stock">
                            <h3>Availability</h3>
                            <p className={product.stock > 0 ? 'text-success' : 'text-error'}>
                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </p>
                        </div>

                        {product.stock > 0 && (
                            <div className="product-detail-actions">
                                <div className="quantity-selector">
                                    <label className="form-label">Quantity</label>
                                    <div className="quantity-controls">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="btn btn-sm btn-secondary"
                                        >
                                            −
                                        </button>
                                        <span className="quantity-display">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            className="btn btn-sm btn-secondary"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="btn btn-primary btn-lg w-full"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
