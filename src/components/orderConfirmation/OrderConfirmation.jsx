import { faBoxOpen, faSyringe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/utils";
import "./OrderConfirmation.css";

export default function OrderConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  if (!order) {
    return <div className="no-order-container">No order data available.</div>;
  }

  const handleReturnHome = () => {
    navigate("/");
  };

  const handleProceedToPayment = () => {
    navigate("/payment", { state: { order } }); // Placeholder route for payment
  };

  return (
    <div className="order-confirmation-page">
      {/* Header */}
      <header className="order-header">
        <h1>Order Confirmation</h1>
      </header>

      {/* Main Content */}
      <div className="order-confirmation-container">
        <div className="two-column-layout">
          {/* Left Column: Order Details */}
          <div className="left-column">
            <div className="order-details-card">
              <h2>Order Details</h2>
              <div className="detail-item">
                <span className="detail-label">Order ID:</span>
                <span className="detail-value">{order.orderId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Profile ID:</span>
                <span className="detail-value">{order.profileId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Purchase Date:</span>
                <span className="detail-value">
                  {new Date(order.purchaseDate).toLocaleString()}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Total Amount:</span>
                <span className="detail-value">{order.totalAmount} items</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Total Price:</span>
                <span className="detail-value highlight">
                  {formatCurrency(order.totalOrderPrice)}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span
                  className={`detail-value status ${
                    order.status === "Pending" ? "status-pending" : "status-other"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Vaccines and Packages */}
          <div className="right-column">
            {/* Vaccines Ordered */}
            <div className="section-box">
              <div className="section-title">Vaccines Ordered</div>
              {order.vaccineDetails.length === 0 ? (
                <p className="no-items-text">No individual vaccines in this order.</p>
              ) : (
                <div className="items-list">
                  {order.vaccineDetails.map((vaccine, index) => (
                    <div key={index} className="item-card">
                      <div className="item-content">
                        <FontAwesomeIcon icon={faSyringe} className="item-icon" />
                        <div className="item-details">
                          <p className="item-name">{vaccine.vaccineName}</p>
                          <p className="item-id">
                            <strong>ID:</strong> {vaccine.vaccineId}
                          </p>
                          <p>
                            <strong>Quantity:</strong> {vaccine.quantity}
                          </p>
                          <p className="item-price">
                            <strong>Total:</strong> {formatCurrency(vaccine.totalPrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Vaccine Packages Ordered */}
            <div className="section-box">
              <div className="section-title">Vaccine Packages Ordered</div>
              {order.packageDetails.length === 0 ? (
                <p className="no-items-text">No vaccine packages in this order.</p>
              ) : (
                <div className="items-list">
                  {order.packageDetails.map((pkg, index) => (
                    <div key={index} className="item-card">
                      <div className="item-content">
                        <FontAwesomeIcon icon={faBoxOpen} className="item-icon" />
                        <div className="item-details">
                          <p className="item-name">{pkg.vaccinePackageName}</p>
                          <p className="item-description">
                            {pkg.description || "No description available"}
                          </p>
                          <p className="item-id">
                            <strong>ID:</strong> {pkg.vaccinePackageId}
                          </p>
                          <p>
                            <strong>Quantity:</strong> {pkg.quantity}
                          </p>
                          <p className="item-price">
                            <strong>Total:</strong> {formatCurrency(pkg.totalPrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="order-footer">
          <button className="return-home-btn" onClick={handleReturnHome}>
            Return to Home Page
          </button>
          <button className="proceed-payment-btn" onClick={handleProceedToPayment}>
            Proceed to Payment
          </button>
        </footer>
      </div>
    </div>
  );
}