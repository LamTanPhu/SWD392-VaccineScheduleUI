// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import api from "../api/axios";
// import { formatCurrency } from "../utils/utils";
// import "./PaymentPage.css";

// export default function PaymentPage() {
//     const { state } = useLocation();
//     const navigate = useNavigate();
//     const order = state?.order;
//     const [paymentMethod, setPaymentMethod] = useState("vnpay"); // Default to VNPay
//     const [paymentLoading, setPaymentLoading] = useState(false);
//     const [paymentError, setPaymentError] = useState(null);

//     // Redirect to home if no order data is passed
//     if (!order) {
//         return (
//         <div className="container mt-5">
//             <p>No order data available. Please return to the checkout page.</p>
//             <button className="btn btn-primary" onClick={() => navigate("/")}>
//             Go Home
//             </button>
//         </div>
//         );
//     }

//     const handlePaymentMethodChange = (e) => {
//         setPaymentMethod(e.target.value);
//         setPaymentError(null); // Clear any previous errors
//     };

//     const initiateVNPayPayment = async () => {
//         setPaymentLoading(true);
//         setPaymentError(null);

//         const paymentRequest = {
//         OrderId: order.orderId,
//         Amount: order.totalOrderPrice,
//         OrderInfo: "string", // Hardcoded to match Swagger for testing
//         };

//         console.log("Step 1: Sending payment request to backend:", paymentRequest);

//         try {
//         const response = await api.post("/api/Payment/vnpay", paymentRequest);
//         console.log("Step 2: Received response from backend:", response.data);

//         const { paymentUrl } = response.data; // Fixed: Match the lowercase 'paymentUrl' key

//         if (paymentUrl) {
//             console.log("Step 3: Payment URL received (not redirecting yet):", paymentUrl);

//             // Temporarily disable automatic redirect for debugging
//             /*
//             try {
//             console.log("Trying redirect method 1: window.location.href");
//             window.location.href = paymentUrl;
//             console.log("Redirect method 1 initiated successfully");
//             } catch (err) {
//             console.error("Redirect method 1 (window.location.href) failed:", err);
//             setPaymentError("Redirect method 1 failed. Trying alternative method...");

//             try {
//                 console.log("Trying redirect method 2: window.open");
//                 window.open(paymentUrl, "_blank");
//                 console.log("Redirect method 2 (window.open) initiated successfully");
//                 setPaymentError("Payment page opened in a new tab. Please complete the payment there.");
//             } catch (err2) {
//                 console.error("Redirect method 2 (window.open) failed:", err2);
//                 setPaymentError("Failed to open VNPay payment page. Please try the manual link below.");

//                 setPaymentError(
//                 <>
//                     Failed to redirect automatically. Please click this link to proceed to VNPay: <br />
//                     <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
//                     Go to VNPay Payment Page
//                     </a>
//                 </>
//                 );
//             }
//             }
//             */

//             // Display the URL in the UI for manual inspection
//             setPaymentError(
//             <>
//                 Payment URL generated. Check the console and click this link to proceed manually: <br />
//                 <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
//                 {paymentUrl}
//                 </a>
//             </>
//             );
//         } else {
//             throw new Error("Payment URL not received from the server.");
//         }
//         } catch (err) {
//         console.error("Step 4: Error initiating VNPay payment:", err);
//         setPaymentError(
//             err.response?.data?.message || "Failed to initiate VNPay payment. Check the console for details."
//         );
//         } finally {
//         setPaymentLoading(false);
//         }
//     };

//     const handleConfirmPayment = () => {
//         if (paymentMethod === "vnpay") {
//         initiateVNPayPayment();
//         } else {
//         setPaymentError("You have selected Cash. Please proceed to the facility to complete your payment.");
//         }
//     };

//     const handleBackToConfirmation = () => {
//         navigate("/order-confirmation", { state: { order } });
//     };

//     return (
//         <div className="container mt-5 payment-page">
//         <h1 className="mb-4">Payment</h1>

//         {paymentError && (
//             <div className="alert alert-danger" role="alert">
//             {paymentError}
//             </div>
//         )}

//         <div className="card p-4 mb-4">
//             <h3>Order Summary</h3>
//             <p>
//             <strong>Order ID:</strong> {order.orderId}
//             </p>
//             <p>
//             <strong>Total Price:</strong> {formatCurrency(order.totalOrderPrice)}
//             </p>

//             <div className="mb-3">
//             <label className="form-label">Select Payment Method</label>
//             <div>
//                 <div className="d-flex align-items-center gap-2 mb-2">
//                 <input
//                     type="radio"
//                     id="vnpay"
//                     name="paymentMethod"
//                     value="vnpay"
//                     className="form-check-input"
//                     checked={paymentMethod === "vnpay"}
//                     onChange={handlePaymentMethodChange}
//                 />
//                 <img
//                     className="checkout-payment-icon"
//                     src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
//                     alt="VN Pay"
//                     style={{ width: "24px", height: "24px" }}
//                 />
//                 <label htmlFor="vnpay" className="form-check-label">
//                     VNPay
//                 </label>
//                 </div>
//                 <div className="d-flex align-items-center gap-2">
//                 <input
//                     type="radio"
//                     id="cash"
//                     name="paymentMethod"
//                     value="cash"
//                     className="form-check-input"
//                     checked={paymentMethod === "cash"}
//                     onChange={handlePaymentMethodChange}
//                 />
//                 <img
//                     className="checkout-payment-icon"
//                     src="https://cdn-icons-png.flaticon.com/512/2460/2460470.png"
//                     alt="Cash"
//                     style={{ width: "24px", height: "24px" }}
//                 />
//                 <label htmlFor="cash" className="form-check-label">
//                     Cash
//                 </label>
//                 </div>
//             </div>
//             </div>

//             {paymentMethod === "cash" && (
//             <div className="alert alert-info">
//                 <p>
//                 You have selected Cash as your payment method. Please proceed to the facility to complete your payment.
//                 </p>
//             </div>
//             )}

//             {paymentLoading && paymentMethod === "vnpay" && (
//             <div className="text-center">
//                 <p>Attempting to process VNPay payment...</p>
//                 <div className="spinner-border" role="status">
//                 <span className="visually-hidden">Loading...</span>
//                 </div>
//             </div>
//             )}
//         </div>

//         <div className="d-flex gap-3">
//             <button className="btn btn-secondary" onClick={handleBackToConfirmation}>
//             Back to Confirmation
//             </button>
//             <button
//             className="btn btn-primary"
//             onClick={handleConfirmPayment}
//             disabled={paymentLoading}
//             >
//             {paymentLoading ? "Processing..." : "Confirm Payment"}
//             </button>
//         </div>
//         </div>
//     );
// }

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { formatCurrency } from "../utils/utils";
import "./PaymentPage.css";

export default function PaymentPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const order = state?.order;
    const [paymentMethod, setPaymentMethod] = useState("vnpay"); // Default to VNPay
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentError, setPaymentError] = useState(null);

    // Redirect to home if no order data is passed
    if (!order) {
        return (
            <div className="container mt-5">
                <p>No order data available. Please return to the checkout page.</p>
                <button className="btn btn-primary" onClick={() => navigate("/")}>
                    Go Home
                </button>
            </div>
        );
    }

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
        setPaymentError(null); // Clear any previous errors
    };

    const initiateVNPayPayment = async () => {
        setPaymentLoading(true);
        setPaymentError(null);

        const paymentRequest = {
            OrderId: order.orderId,
            Amount: order.totalOrderPrice,
            OrderInfo: "string", // Hardcoded to match Swagger for testing
        };

        try {
            const response = await api.post("/api/Payment/vnpay", paymentRequest);
            const { paymentUrl } = response.data; // Match the lowercase 'paymentUrl' key

            if (paymentUrl) {
                try {
                    // Method 1: Redirect using window.location.href
                    window.location.href = paymentUrl;
                } catch (err) {
                    console.error("Redirect method 1 (window.location.href) failed:", err);
                    try {
                        // Method 2: Fallback to window.open
                        window.open(paymentUrl, "_blank");
                        setPaymentError("Payment page opened in a new tab. Please complete the payment there.");
                    } catch (err2) {
                        console.error("Redirect method 2 (window.open) failed:", err2);
                        setPaymentError(
                            <>
                                Failed to redirect automatically. Please click this link to proceed to VNPay: <br />
                                <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
                                    Go to VNPay Payment Page
                                </a>
                            </>
                        );
                    }
                }
            } else {
                throw new Error("Payment URL not received from the server.");
            }
        } catch (err) {
            console.error("Error initiating VNPay payment:", err);
            setPaymentError(
                err.response?.data?.message || "Failed to initiate VNPay payment. Please try again."
            );
        } finally {
            setPaymentLoading(false);
        }
    };

    const handleConfirmPayment = () => {
        if (paymentMethod === "vnpay") {
            initiateVNPayPayment();
        } else {
            setPaymentError("You have selected Cash. Please proceed to the facility to complete your payment.");
        }
    };

    const handleBackToConfirmation = () => {
        navigate("/order-confirmation", { state: { order } });
    };

    return (
        <div className="container mt-5 payment-page">
            <h1 className="mb-4">Payment</h1>

            {paymentError && (
                <div className="alert alert-danger" role="alert">
                    {paymentError}
                </div>
            )}

            <div className="card p-4 mb-4">
                <h3>Order Summary</h3>
                <p>
                    <strong>Order ID:</strong> {order.orderId}
                </p>
                <p>
                    <strong>Total Price:</strong> {formatCurrency(order.totalOrderPrice)}
                </p>

                <div className="mb-3">
                    <label className="form-label">Select Payment Method</label>
                    <div>
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <input
                                type="radio"
                                id="vnpay"
                                name="paymentMethod"
                                value="vnpay"
                                className="form-check-input"
                                checked={paymentMethod === "vnpay"}
                                onChange={handlePaymentMethodChange}
                            />
                            <img
                                className="checkout-payment-icon"
                                src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
                                alt="VN Pay"
                                style={{ width: "24px", height: "24px" }}
                            />
                            <label htmlFor="vnpay" className="form-check-label">
                                VNPay
                            </label>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <input
                                type="radio"
                                id="cash"
                                name="paymentMethod"
                                value="cash"
                                className="form-check-input"
                                checked={paymentMethod === "cash"}
                                onChange={handlePaymentMethodChange}
                            />
                            <img
                                className="checkout-payment-icon"
                                src="https://cdn-icons-png.flaticon.com/512/2460/2460470.png"
                                alt="Cash"
                                style={{ width: "24px", height: "24px" }}
                            />
                            <label htmlFor="cash" className="form-check-label">
                                Cash
                            </label>
                        </div>
                    </div>
                </div>

                {paymentMethod === "cash" && (
                    <div className="alert alert-info">
                        <p>
                            You have selected Cash as your payment method. Please proceed to the facility to complete your payment.
                        </p>
                    </div>
                )}

                {paymentLoading && paymentMethod === "vnpay" && (
                    <div className="text-center">
                        <p>Attempting to process VNPay payment...</p>
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="d-flex gap-3">
                <button className="btn btn-secondary" onClick={handleBackToConfirmation}>
                    Back to Confirmation
                </button>
                <button
                    className="btn btn-primary"
                    onClick={handleConfirmPayment}
                    disabled={paymentLoading}
                >
                    {paymentLoading ? "Processing..." : "Confirm Payment"}
                </button>
            </div>
        </div>
    );
}