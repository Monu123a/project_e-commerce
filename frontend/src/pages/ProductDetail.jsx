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

                <div className="product-detail-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr minmax(200px, 1fr)', gap: '2rem', alignItems: 'start' }}>
                    <div className="product-detail-image" style={{ background: 'white', padding: '1rem', border: '1px solid #ddd' }}>
                        {product.imageUrl ? (
                            <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain' }}
                            />
                        ) : (
                            <div className="product-image-placeholder-large" style={{ backgroundColor: '#f3f3f3', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '10rem' }}>📦</span>
                            </div>
                        )}
                    </div>

                    <div className="product-detail-info">
                        <h1 className="product-detail-name" style={{ fontSize: '1.75rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>{product.name}</h1>
                        
                        <div className="product-rating" style={{ color: '#ffa41c', marginBottom: '0.5rem' }}>
                            ★★★★☆ <span style={{ color: '#007185', fontSize: '0.9rem' }}>42 ratings | Search this page</span>
                        </div>

                        <div className="product-detail-price" style={{ borderBottom: '1px solid #ddd', paddingBottom: '1rem', marginBottom: '1rem' }}>
                            <span className="price-label" style={{ fontSize: '0.9rem', color: '#565959' }}>Price: </span>
                            <span className="price-value" style={{ color: '#B12704', fontSize: '1.75rem', fontWeight: '500' }}>₹{product.price}</span>
                            <span style={{ fontSize: '0.96rem', color: '#565959', marginLeft: '0.5rem' }}>Fullfilled by AmazeStore</span>
                        </div>

                        <div className="product-detail-description">
                            <h3 style={{ fontSize: '1rem' }}>About this item</h3>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{product.description || 'No description available.'}</p>
                        </div>
                    </div>

                    <div className="product-detail-checkout card" style={{ padding: '1rem', border: '1px solid #ddd' }}>
                        <div className="price-tag" style={{ color: '#B12704', fontSize: '1.5rem', marginBottom: '0.5rem' }}>₹{product.price}</div>
                        <div className="delivery-info" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                            <span style={{ color: '#007185' }}>FREE delivery</span> Tomorrow. Order within 10 hrs 15 mins.
                        </div>

                        <div className="product-detail-stock" style={{ marginBottom: '1rem' }}>
                            <p className={product.stock > 0 ? 'text-success' : 'text-error'} style={{ fontWeight: '500', fontSize: '1.1rem' }}>
                                {product.stock > 0 ? 'In Stock' : 'Currently unavailable'}
                            </p>
                            {product.stock < 10 && product.stock > 0 && (
                                <p style={{ color: '#B12704', fontSize: '0.9rem' }}>Only {product.stock} left in stock - order soon.</p>
                            )}
                        </div>

                        {product.stock > 0 && (
                            <div className="product-detail-actions">
                                <div className="quantity-selector" style={{ marginBottom: '1rem' }}>
                                    <label className="form-label">Quantity: </label>
                                    <select 
                                        value={quantity} 
                                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                                        className="form-select"
                                        style={{ width: 'auto', borderRadius: '8px', padding: '0.2rem 0.5rem' }}
                                    >
                                        {[...Array(Math.min(10, product.stock)).keys()].map(i => (
                                            <option key={i+1} value={i+1}>{i+1}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="btn btn-primary w-full"
                                    style={{ borderRadius: '20px', marginBottom: '0.5rem', padding: '0.6rem' }}
                                >
                                    Add to Cart
                                </button>
                                <button
                                    className="btn btn-secondary w-full"
                                    style={{ backgroundColor: '#ffa41c', borderColor: '#f3a847', borderRadius: '20px', padding: '0.6rem' }}
                                >
                                    Buy Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
