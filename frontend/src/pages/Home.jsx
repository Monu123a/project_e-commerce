import { useState, useEffect } from 'react';
import axios from 'axios';
import { isAuthenticated, getAuthHeader } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts(page);
    }, [page]);

    const fetchProducts = async (currentPage) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/products?page=${currentPage}&limit=12`);
            if (response.data.products) {
                setProducts(response.data.products);
                setTotalPages(response.data.pagination.totalPages);
            } else {
                // Fallback in case old response structure
                setProducts(response.data);
                setTotalPages(1);
            }
        } catch (err) {
            setError('Failed to load products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId) => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        try {
            await axios.post('/api/cart',
                { product_id: productId, quantity: 1 },
                { headers: getAuthHeader() }
            );
            alert('Product added to cart!');
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

    if (error) {
        return (
            <div className="page">
                <div className="container">
                    <div className="empty-state">
                        <h3>Error</h3>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>AmazeStore Best Sellers</h1>
                    <p className="text-muted">Our most popular products based on sales. Updated hourly.</p>
                </div>

                {products.length === 0 ? (
                    <div className="empty-state">
                        <h3>No products available</h3>
                        <p>Check back soon for new items!</p>
                    </div>
                ) : (
                    <div className="grid grid-3">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="pagination" style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', gap: '10px' }}>
                        <button 
                            className="btn btn-secondary" 
                            disabled={page === 1} 
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </button>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            Page {page} of {totalPages}
                        </span>
                        <button 
                            className="btn btn-secondary" 
                            disabled={page === totalPages} 
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
