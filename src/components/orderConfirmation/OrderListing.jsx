import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from "../utils/utils";
import api from "../api/axios";
import './OrderListing.css';

const OrderListing = () => {
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

                console.log('Base URL:', api.defaults.baseURL); // Log the base URL
                console.log('Fetching orders from /api/Order...');
                const response = await api.get('/api/Order'); // Ensure correct endpoint
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
        return <div className="text-center py-5">You have no orders yet.</div>;
    }

    return (
        <div className="orders-page">
            <h1 className="mb-4">Your Orders</h1>
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
                                className="btn btn-outline-primary btn-sm"
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

export default OrderListing;