import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeader } from '../utils/auth';
import './Orders.css';

const statusColors = {
    pending: 'warning',
    processing: 'primary',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'error'
};

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/orders', {
                headers: getAuthHeader()
            });
            setOrders(response.data);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
                    <h1>My Orders</h1>
                    <p className="text-muted">Track your order history and status</p>
                </div>

                {orders.length === 0 ? (
                    <div className="empty-state">
                        <h3>No orders yet</h3>
                        <p>Your order history will appear here</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order.id} className="order-card card">
                                <div className="order-header">
                                    <div className="order-info">
                                        <h3>Order #{order.id}</h3>
                                        <p className="order-date">{formatDate(order.created_at)}</p>
                                    </div>
                                    <span className={`badge badge-${statusColors[order.status]}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="order-items">
                                    <p className="text-muted">{order.items}</p>
                                </div>

                                <div className="order-footer">
                                    <span className="order-total-label">Total</span>
                                    <span className="order-total-value">₹{order.total}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
