import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '.././utils/utils';
import api from '.././api/axios';
import './AdminOrders.css';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('User not logged in');
                }

                console.log('Base URL:', api.defaults.baseURL);
                console.log('Fetching all orders for admin from /api/Order...');
                const response = await api.get('/api/Order');
                console.log('Orders response:', response.data);
                setOrders(response.data);
                setLoading(false);
            } catch (err) {
                const errorMessage = err.response
                    ? `Error ${err.response.status}: ${err.response.data || err.message}`
                    : `Error: ${err.message}`;
                console.error('Fetch orders failed:', errorMessage);
                setError(errorMessage);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleViewDetails = (order) => {
        navigate('/order-confirmation', { state: { order } });
    };

    if (loading) {
        return <div className="text-center py-5">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-5 text-danger">{error}</div>;
    }

    if (orders.length === 0) {
        return <div className="text-center py-5">No orders found.</div>;
    }

    return (
        <div className="admin-orders-page">
            <h1 className="mb-4 text-gradient text-center">All Orders</h1>
            <div className="orders-list">
                {orders.map((order) => (
                    <div key={order.orderId} className="order-card">
                        <div className="order-header">
                            <h3>Order ID: {order.orderId}</h3>
                            <span
                                className={`status ${
                                    order.status === 'Pending' ? 'status-pending' : 'status-other'
                                }`}
                            >
                                {order.status}
                            </span>
                        </div>
                        <p>
                            <strong>Profile ID:</strong> {order.profileId}
                        </p>
                        <p>
                            <strong>Purchase Date:</strong>{' '}
                            {new Date(order.purchaseDate).toLocaleString()}
                        </p>
                        <p>
                            <strong>Total Amount:</strong> {order.totalAmount} items
                        </p>
                        <p>
                            <strong>Total Price:</strong>{' '}
                            {formatCurrency(order.totalOrderPrice)}
                        </p>
                        <div className="order-actions">
                            <button
                                className="btn btn-outline-primary btn-sm btn-animated"
                                onClick={() => handleViewDetails(order)}
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminOrders;