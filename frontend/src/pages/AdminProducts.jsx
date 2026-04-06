import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeader } from '../utils/auth';
import './Admin.css';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products');
            setProducts(response.data);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editing) {
                await axios.put(`/api/products/${editing}`, formData, {
                    headers: getAuthHeader()
                });
                alert('Product updated successfully!');
            } else {
                await axios.post('/api/products', formData, {
                    headers: getAuthHeader()
                });
                alert('Product created successfully!');
            }

            setFormData({ name: '', description: '', price: '', stock: '', imageUrl: '' });
            setEditing(null);
            fetchProducts();
        } catch (err) {
            alert(err.response?.data?.error || 'Operation failed');
        }
    };

    const handleEdit = (product) => {
        setEditing(product.id);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            stock: product.stock,
            imageUrl: product.imageUrl || ''
        });
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await axios.delete(`/api/products/${id}`, {
                headers: getAuthHeader()
            });
            alert('Product deleted successfully!');
            fetchProducts();
        } catch (err) {
            alert('Failed to delete product');
        }
    };

    const handleCancel = () => {
        setEditing(null);
        setFormData({ name: '', description: '', price: '', stock: '', imageUrl: '' });
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
                    <h1>Manage Products</h1>
                    <p className="text-muted">Add, edit, or remove products from your store</p>
                </div>

                <div className="admin-layout">
                    <div className="admin-sidebar">
                        <div className="admin-form card">
                            <h2>{editing ? 'Edit Product' : 'Add New Product'}</h2>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Product Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Product Image URL</label>
                                    <input
                                        type="url"
                                        className="form-input"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        placeholder="Paste image URL here"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Enter product description"
                                    />
                                </div>

                                <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label className="form-label">Price (₹)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="form-input"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="Price"
                                            required
                                        />
                                    </div>

                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label className="form-label">Stock</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-input"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            placeholder="Stock"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary">
                                        {editing ? 'Update Product' : 'Create Product'}
                                    </button>
                                    {editing && (
                                        <button type="button" onClick={handleCancel} className="btn btn-secondary">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="admin-list">
                        <h2>All Products</h2>

                        {products.length === 0 ? (
                            <div className="empty-state">
                                <p>No products yet</p>
                            </div>
                        ) : (
                            <div className="products-table">
                                {products.map((product) => (
                                    <div key={product.id} className="product-row card" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                        {product.imageUrl && (
                                            <div className="product-thumbnail" style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                                                <img 
                                                    src={product.imageUrl} 
                                                    alt={product.name} 
                                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                />
                                            </div>
                                        )}
                                        <div className="product-details" style={{ flex: 1 }}>
                                            <h3>{product.name}</h3>
                                            <p className="text-muted" style={{ fontSize: '13px', margin: '5px 0' }}>{product.description}</p>
                                            <div className="product-meta">
                                                <span className="meta-item">Price: <b>₹{product.price}</b></span>
                                                <span className="meta-item" style={{ marginLeft: '15px' }}>Stock: {product.stock}</span>
                                            </div>
                                        </div>
                                        <div className="product-actions">
                                            <button onClick={() => handleEdit(product)} className="btn btn-sm btn-secondary">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="btn btn-sm btn-error" style={{ marginLeft: '5px' }}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
