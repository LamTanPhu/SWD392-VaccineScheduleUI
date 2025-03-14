// OrderConfirmation.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/utils";

export default function OrderConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  if (!order) {
    return <div>No order data available.</div>;
  }

  const handleReturnHome = () => {
    navigate("/"); // Adjust the path to your home page route if different
  };

  return (
    <div className="container mt-5 mb-5">
      {/* Inline CSS for custom styling */}
      <style>
        {`
          .order-confirmation-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .order-header {
            color: #007bff;
            font-weight: 700;
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .order-details-card {
            background-color: #ffffff;
            border: none;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            padding: 20px;
            margin-bottom: 20px;
          }
          .order-details-card p {
            margin: 5px 0;
            font-size: 16px;
            color: #333;
          }
          .order-details-card p strong {
            color: #555;
            font-weight: 600;
          }
          .section-title {
            color: #343a40;
            font-weight: 600;
            margin-top: 30px;
            margin-bottom: 15px;
            border-left: 4px solid #007bff;
            padding-left: 10px;
          }
          .item-card {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            padding: 15px;
            margin-bottom: 15px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .item-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .item-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 5px;
            margin-right: 15px;
          }
          .item-details p {
            margin: 3px 0;
            font-size: 15px;
            color: #444;
          }
          .item-details p strong {
            color: #555;
            font-weight: 500;
          }
          .no-items-text {
            color: #6c757d;
            font-style: italic;
          }
          .return-home-btn {
            background-color: #007bff;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            font-weight: 500;
            border-radius: 5px;
            transition: background-color 0.3s ease;
          }
          .return-home-btn:hover {
            background-color: #0056b3;
          }
        `}
      </style>

      <div className="order-confirmation-container">
        <h1 className="order-header">Order Confirmation</h1>

        <div className="order-details-card">
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> {order.orderId}</p>
          <p><strong>Profile ID:</strong> {order.profileId}</p>
          <p><strong>Purchase Date:</strong> {new Date(order.purchaseDate).toLocaleString()}</p>
          <p><strong>Total Amount:</strong> {order.totalAmount} items</p>
          <p><strong>Total Price:</strong> {formatCurrency(order.totalOrderPrice)}</p>
          <p><strong>Status:</strong> {order.status}</p>
        </div>

        <h3 className="section-title">Vaccines Ordered</h3>
        {order.vaccineDetails.length === 0 ? (
          <p className="no-items-text">No individual vaccines in this order.</p>
        ) : (
          order.vaccineDetails.map((vaccine, index) => (
            <div key={index} className="item-card">
              <div className="d-flex align-items-start">
                {vaccine.image && (
                  <img
                    src={vaccine.image}
                    alt={vaccine.vaccineName}
                    className="item-image"
                  />
                )}
                <div className="item-details">
                  <p><strong>Vaccine:</strong> {vaccine.vaccineName}</p>
                  <p><strong>Vaccine ID:</strong> {vaccine.vaccineId}</p>
                  <p><strong>Order Vaccine ID:</strong> {vaccine.orderVaccineId}</p>
                  <p><strong>Quantity:</strong> {vaccine.quantity}</p>
                  <p><strong>Total Price:</strong> {formatCurrency(vaccine.totalPrice)}</p>
                </div>
              </div>
            </div>
          ))
        )}

        <h3 className="section-title">Vaccine Packages Ordered</h3>
        {order.packageDetails.length === 0 ? (
          <p className="no-items-text">No vaccine packages in this order.</p>
        ) : (
          order.packageDetails.map((pkg, index) => (
            <div key={index} className="item-card">
              <div className="item-details">
                <p><strong>Package:</strong> {pkg.vaccinePackageName}</p>
                <p><strong>Description:</strong> {pkg.description || "No description available"}</p>
                <p><strong>Package ID:</strong> {pkg.vaccinePackageId}</p>
                <p><strong>Order Package ID:</strong> {pkg.orderPackageId}</p>
                <p><strong>Quantity:</strong> {pkg.quantity}</p>
                <p><strong>Total Price:</strong> {formatCurrency(pkg.totalPrice)}</p>
              </div>
            </div>
          ))
        )}

        <div className="text-center mt-4">
          <button
            className="return-home-btn btn btn-primary"
            onClick={handleReturnHome}
          >
            Return to Home Page
          </button>
        </div>
      </div>
    </div>
  );
}