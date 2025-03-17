import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './PaymentPage.css';

const PaymentPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const order = state?.order;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentUrl, setPaymentUrl] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('Pending');
    const [polling, setPolling] = useState(false);

    useEffect(() => {
        if (!order) {
        navigate('/order-confirmation');
        return;
        }

        if (order.paymentMethod !== 'vnpay') {
        setError('This order is set for cash payment. Please contact an admin to process it.');
        return;
        }

        initiatePayment();
    }, [order, navigate]);

    const initiatePayment = async () => {
        if (!order) return;

        setLoading(true);
        setError(null);

        try {
        // Prepare VNPay payment request
        const requestData = {
            Amount: order.totalOrderPrice / 100, // Convert to VND units (VNPay expects amount in cents)
            OrderId: order.orderId,
            OrderInfo: `Payment for Order #${order.orderId}`,
        };

        // Option 1: Get Payment URL
        const urlResponse = await api.post('/api/Payment/vnpay', requestData);
        setPaymentUrl(urlResponse.data.PaymentUrl);

        // Option 2: Get QR Code (uncomment to use QR instead of URL)
        /*
        const qrResponse = await api.post('/api/Payment/vnpay-qr', requestData, {
            responseType: 'arraybuffer',
        });
        const base64 = btoa(
            new Uint8Array(qrResponse.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        setQrCodeUrl(`data:image/png;base64,${base64}`);
        */

        setLoading(false);
        } catch (err) {
        setError(err.response?.data?.message || 'Failed to initiate payment');
        setLoading(false);
        }
    };

    const checkPaymentStatus = async () => {
        if (!order?.orderId) return;

        try {
        const response = await api.get(`/api/Order/${order.orderId}`);
        const updatedOrder = response.data;
        setPaymentStatus(updatedOrder.status || 'Pending');

        if (updatedOrder.status === 'Paid') {
            setPolling(false);
            navigate('/payment-confirmation', { state: { order: updatedOrder } }); // Redirect to a confirmation page
        }
        } catch (err) {
        setError(err.response?.data?.message || 'Failed to check payment status');
        }
    };

    useEffect(() => {
        let interval;
        if (paymentUrl && !polling) {
        setPolling(true);
        window.location.href = paymentUrl; // Redirect to VNPay payment page
        interval = setInterval(checkPaymentStatus, 5000); // Poll every 5 seconds
        }

        return () => clearInterval(interval);
    }, [paymentUrl, polling, navigate, order?.orderId]);

    const handleManualCheck = () => {
        checkPaymentStatus();
    };

    if (loading) {
        return (
        <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Processing payment...</span>
            </div>
        </div>
        );
    }

    if (error) {
        return (
        <div className="container py-4">
            <div className="alert alert-danger text-center" role="alert">
            {error}
            <button className="btn btn-link" onClick={() => setError(null)}>
                Try Again
            </button>
            </div>
            <button className="btn btn-primary" onClick={handleManualCheck}>
            Check Payment Status
            </button>
        </div>
        );
    }

    return (
        <div className="container py-4">
        <h1 className="text-gradient text-center mb-4">Payment</h1>
        <div className="card shadow-lg">
            <div className="card-header bg-primary text-white">
            <h5>Order Summary</h5>
            </div>
            <div className="card-body">
            <p><strong>Order ID:</strong> {order?.orderId}</p>
            <p><strong>Total Price:</strong> {order?.totalOrderPrice} VND</p>
            <p><strong>Payment Method:</strong> {order?.paymentMethod}</p>
            {paymentUrl && (
                <p>Please complete the payment on the VNPay page that has opened. You will be redirected automatically after payment.</p>
            )}
            {qrCodeUrl && (
                <div>
                <p>Scan the QR code below to pay with VNPay:</p>
                <img src={qrCodeUrl} alt="VNPay QR Code" style={{ maxWidth: '200px' }} />
                </div>
            )}
            </div>
            <div className="card-footer text-center">
            <button className="btn btn-primary" onClick={handleManualCheck} disabled={polling}>
                {polling ? 'Checking...' : 'Check Payment Status'}
            </button>
            </div>
        </div>
        </div>
    );
};

export default PaymentPage;