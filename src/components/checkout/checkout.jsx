import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { formatCurrency } from "../utils/utils";
import "./checkout.css";

export default function Checkout() {
  const cart = useMemo(() => JSON.parse(localStorage.getItem("cart")) || [], []);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    paymentMethod: "vnpay",
    childId: "",
  });
  const [children, setChildren] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [error, setError] = useState(null);

  // Fetch children profiles for the logged-in user
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        // Get the user's AccountId (adjust based on your auth setup)
        const user = JSON.parse(localStorage.getItem("user")) || {};
        const accountId = user.accountId; // Adjust this key based on your user object
        if (!accountId) {
          throw new Error("User account ID not found. Please log in again.");
        }

        const response = await api.get(`/api/ChildrenProfile/account/${accountId}`);
        setChildren(response.data);
      } catch (err) {
        setError(err.message || "Failed to load children profiles");
        console.error("Error fetching children:", err);
      } finally {
        setLoadingChildren(false);
      }
    };
    fetchChildren();
  }, []);

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  }, [cart]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.childId) {
      alert("Please select a child for this order.");
      return;
    }
    console.log("Checkout submitted:", { cart, ...formData, total });
    // TODO: Send to backend API (e.g., POST /api/Order with childId)
  };

  return (
    <div className="container mt-5">
      <h1 className="h1 fw-bold text-primary border-bottom border-primary pb-1 mb-5">
        Checkout
      </h1>
      <div className="d-flex justify-content-between">
        <div className="col-6 px-2">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label checkout-label">Select Child</label>
              {loadingChildren ? (
                <p>Loading children...</p>
              ) : error ? (
                <p className="text-danger">{error}</p>
              ) : children.length === 0 ? (
                <p>No children profiles found. Add one first!</p>
              ) : (
                <select
                  name="childId"
                  className="form-control checkout-input"
                  value={formData.childId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select a child --</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.fullName} (DOB: {new Date(child.dateOfBirth).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="mb-4">
              <label className="form-label checkout-label">Full Name (Parent)</label>
              <input
                type="text"
                name="fullName"
                className="form-control checkout-input"
                placeholder="Enter your name..."
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label checkout-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control checkout-input"
                placeholder="Enter email address..."
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label checkout-label">Address</label>
              <input
                type="text"
                name="address"
                className="form-control checkout-input"
                placeholder="Enter address..."
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="d-flex gap-3 mb-4">
              <div className="flex-fill">
                <label className="form-label checkout-label">City</label>
                <input
                  type="text"
                  name="city"
                  className="form-control checkout-input"
                  placeholder="Enter city..."
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex-fill">
                <label className="form-label checkout-label">Postal Code (Optional)</label>
                <input
                  type="text"
                  name="postalCode"
                  className="form-control checkout-input"
                  placeholder="Enter postal code..."
                  value={formData.postalCode}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label checkout-label">Phone Number</label>
              <input
                type="text"
                name="phone"
                className="form-control checkout-input"
                placeholder="Enter phone number..."
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label checkout-label">Payment Method</label>
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <input
                    type="radio"
                    id="vnpay"
                    name="paymentMethod"
                    value="vnpay"
                    className="form-check-input"
                    checked={formData.paymentMethod === "vnpay"}
                    onChange={handleChange}
                  />
                  <img
                    className="checkout-payment-icon"
                    src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
                    alt="VN Pay"
                  />
                  <label htmlFor="vnpay" className="form-check-label">VN Pay</label>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="radio"
                    id="cash"
                    name="paymentMethod"
                    value="cash"
                    className="form-check-input"
                    checked={formData.paymentMethod === "cash"}
                    onChange={handleChange}
                  />
                  <img
                    className="checkout-payment-icon"
                    src="https://cdn-icons-png.flaticon.com/512/2460/2460470.png"
                    alt="Cash"
                  />
                  <label htmlFor="cash" className="form-check-label">Cash</label>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 checkout-submit-btn fw-bold bg-primary border-0"
            >
              Place Order Now
            </button>
          </form>
        </div>
        <div className="col-6 ps-5">
          <h5 className="fw-bold mb-5 border-bottom pb-1">Order Details</h5>
          {cart.length === 0 ? (
            <p className="text-muted">No items in cart</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="d-flex align-items-start gap-3 mb-3">
                <div className="position-relative checkout-product-image">
                  <img
                    src={item.image || "https://via.placeholder.com/100"}
                    alt={item.name}
                    className="img-fluid h-100"
                  />
                  <span className="position-absolute top-0 end-0 checkout-quantity-badge bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center">
                    1
                  </span>
                </div>
                <div>
                  <p className="fw-bold">{item.name}</p>
                  <p>{formatCurrency(item.price)}</p>
                </div>
              </div>
            ))
          )}
          <div className="card p-3 mt-5">
            <p className="d-flex justify-content-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(total)}</span>
            </p>
            <hr className="my-3" />
            <p className="d-flex justify-content-between fw-bold">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}