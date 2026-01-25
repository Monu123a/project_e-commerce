import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeader } from '../utils/auth';
import './Admin.css';

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusColors = {
    pending: 'warning',
    processing: 'primary',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'error'
};

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/orders/all/orders', {
                headers: getAuthHeader()
            });
            setOrders(response.data);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`/api/orders/${orderId}/status`, { status: newStatus }, {
                headers: getAuthHeader()
            });
            alert('Order status updated successfully!');
            fetchOrders();
        } catch (err) {
            alert('Failed to update order status');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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
                    <h1>Manage Orders</h1>
                    <p className="text-muted">View and update order statuses</p>
                </div>

                {orders.length === 0 ? (
                    <div className="empty-state">
                        <h3>No orders yet</h3>
                        <p>Orders will appear here when customers make purchases</p>
                    </div>
                ) : (
                    <div className="orders-table">
                        {orders.map((order) => (
                            <div key={order.id} className="order-row card">
                                <div className="order-details">
                                    <div className="order-header-row">
                                        <h3>Order #{order.id}</h3>
                                        <span className={`badge badge-${statusColors[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="order-meta">
                                        <p><strong>Customer:</strong> {order.user_name} ({order.email})</p>
                                        <p><strong>Date:</strong> {formatDate(order.created_at)}</p>
                                        <p><strong>Total:</strong> ₹{order.total}</p>
                                    </div>
                                </div>

                                <div className="order-actions">
                                    <label className="form-label">Update Status</label>
                                    <select
                                        className="form-select"
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    >
                                        {statusOptions.map((status) => (
                                            <option key={status} value={status}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
