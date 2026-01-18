import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeader } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';
import './Cart.css';

export default function Cart() {
    const [cart, setCart] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(true);
    const [placing, setPlacing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await axios.get('/api/cart', {
                headers: getAuthHeader()
            });
            setCart(response.data);
        } catch (err) {
            console.error('Failed to fetch cart:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (itemId, quantity) => {
        try {
            await axios.put(`/api/cart/${itemId}`, { quantity }, {
                headers: getAuthHeader()
            });
            fetchCart();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to update quantity');
        }
    };

    const handleRemove = async (itemId) => {
        try {
            await axios.delete(`/api/cart/${itemId}`, {
                headers: getAuthHeader()
            });
            fetchCart();
        } catch (err) {
            alert('Failed to remove item');
        }
    };

    const handleCheckout = async () => {
        if (cart.items.length === 0) return;

        setPlacing(true);
        try {
            await axios.post('/api/orders', {}, {
                headers: getAuthHeader()
            });
            alert('Order placed successfully!');
            navigate('/orders');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to place order');
        } finally {
            setPlacing(false);
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

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>Shopping Cart</h1>
                    <p className="text-muted">Review your items before checkout</p>
                </div>

                {cart.items.length === 0 ? (
                    <div className="empty-state">
                        <h3>Your cart is empty</h3>
                        <p>Add some products to get started!</p>
                        <button onClick={() => navigate('/')} className="btn btn-primary mt-lg">
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className="cart-layout">
                        <div className="cart-items">
                            {cart.items.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemove={handleRemove}
                                />
                            ))}
                        </div>

                        <div className="cart-summary card">
                            <h2>Order Summary</h2>

                            <div className="summary-row">
                                <span>Items ({cart.items.length})</span>
                                <span>₹{cart.total.toFixed(2)}</span>
                            </div>

                            <div className="summary-row summary-total">
                                <span>Total</span>
                                <span className="total-amount">₹{cart.total.toFixed(2)}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={placing}
                                className="btn btn-primary btn-lg w-full"
                            >
                                {placing ? 'Placing Order...' : 'Proceed to Checkout'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
