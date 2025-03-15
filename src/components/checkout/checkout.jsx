import React, { useEffect, useMemo, useState } from "react"; // Added useMemo to the import
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { formatCurrency } from "../utils/utils";
import "./checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const [cartState, setCartState] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    paymentMethod: "vnpay",
    childId: "",
  });
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [parentProfile, setParentProfile] = useState(null);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [loadingParent, setLoadingParent] = useState(true);
  const [error, setError] = useState(null);
  const [orderError, setOrderError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Fetch parent profile and children on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await api.get("/api/users/profile");
        setParentProfile(profileResponse.data);

        const childrenResponse = await api.get("/api/ChildrenProfile/my-children");
        setChildren(childrenResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoadingChildren(false);
        setLoadingParent(false);
      }
    };
    fetchData();
  }, []);

  // Update selected child when childId changes
  useEffect(() => {
    if (formData.childId) {
      const child = children.find((c) => c.id === formData.childId);
      setSelectedChild(child || null);
    } else {
      setSelectedChild(null);
    }
  }, [formData.childId, children]);

  const total = useMemo(() => {
    return cartState.reduce((sum, item) => sum + item.price, 0);
  }, [cartState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveVaccine = (itemId) => {
    const updatedCart = cartState.filter((cartItem) => cartItem.id !== itemId);
    setCartState(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.childId) {
      alert("Please select a child for this order.");
      return;
    }

    if (cartState.length === 0) {
      alert("Your cart is empty. Add items to proceed.");
      return;
    }

    setOrderError(null);
    setOrderSuccess(false);

    // Separate vaccines and vaccine packages based on type
    const vaccines = cartState
      .filter((item) => item.type === "vaccine")
      .map((item) => ({
        vaccineId: item.id,
        quantity: item.quantity || 1,
      }));

    const vaccinePackages = cartState
      .filter((item) => item.type === "package")
      .map((item) => ({
        vaccinePackageId: item.id,
        quantity: item.quantity || 1,
      }));

    const orderData = {
      profileId: formData.childId,
      purchaseDate: new Date().toISOString(),
      vaccines: vaccines,
      vaccinePackages: vaccinePackages,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      phone: formData.phone,
      paymentMethod: formData.paymentMethod,
      parentUsername: parentProfile?.username,
      parentEmail: parentProfile?.email,
    };

    try {
      const response = await api.post("/api/Order", orderData);
      setOrderSuccess(true);
      localStorage.removeItem("cart");
      setCartState([]); // Clear cart state after successful order
      setTimeout(() => {
        navigate("/order-confirmation", { state: { order: response.data } });
      }, 2000);
    } catch (err) {
      setOrderError(err.response?.data?.message || "Failed to place order");
    }
  };

  const handleReset = () => {
    setFormData({
      address: "",
      city: "",
      postalCode: "",
      phone: "",
      paymentMethod: "vnpay",
      childId: "",
    });
    setSelectedChild(null);
  };

  return (
    <div className="container mt-5">
      <h1 className="h1 fw-bold text-primary border-bottom border-primary pb-1 mb-5">
        Checkout
      </h1>
      {orderSuccess && (
        <div className="alert alert-success" role="alert">
          Order placed successfully! Redirecting...
        </div>
      )}
      {orderError && (
        <div className="alert alert-danger" role="alert">
          {orderError}
        </div>
      )}
      <div className="d-flex justify-content-between">
        <div className="col-6 px-2">
          <form onSubmit={handleSubmit}>
            {/* Parent Profile Section */}
            <div className="mb-4">
              <h5 className="fw-bold mb-3">Parent Profile</h5>
              {loadingParent ? (
                <p>Loading parent profile...</p>
              ) : error ? (
                <p className="text-danger">{error}</p>
              ) : parentProfile ? (
                <div className="card p-3">
                  <div className="mb-3">
                    <label className="form-label checkout-label">Username</label>
                    <input
                      type="text"
                      className="form-control checkout-input"
                      value={parentProfile.username || ""}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label checkout-label">Email</label>
                    <input
                      type="email"
                      className="form-control checkout-input"
                      value={parentProfile.email || ""}
                      readOnly
                    />
                  </div>
                </div>
              ) : (
                <p>No parent profile found.</p>
              )}
            </div>

            {/* Child Selection */}
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

            {/* Selected Child Details */}
            <div className="mb-4">
              <h5 className="fw-bold mb-3">Selected Child Details</h5>
              {selectedChild ? (
                <div className="card p-3 child-details-card">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label checkout-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control checkout-input"
                        value={selectedChild.fullName || ""}
                        readOnly
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label checkout-label">Date of Birth</label>
                      <input
                        type="text"
                        className="form-control checkout-input"
                        value={new Date(selectedChild.dateOfBirth).toLocaleDateString() || ""}
                        readOnly
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label checkout-label">Gender</label>
                      <input
                        type="text"
                        className="form-control checkout-input"
                        value={selectedChild.gender || ""}
                        readOnly
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label checkout-label">Status</label>
                      <input
                        type="text"
                        className="form-control checkout-input"
                        value={selectedChild.status || ""}
                        readOnly
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label checkout-label">Address</label>
                      <input
                        type="text"
                        className="form-control checkout-input"
                        value={selectedChild.address || ""}
                        readOnly
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label checkout-label">Account ID</label>
                      <input
                        type="text"
                        className="form-control checkout-input"
                        value={selectedChild.accountId || ""}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted">Select a child to view details.</p>
              )}
            </div>

            {/* Checkout Form (Shipping Details) */}
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
          </form>
        </div>

        <div className="col-6 ps-5">
          <h5 className="fw-bold mb-5 border-bottom pb-1">Registered Vaccines</h5>
          {cartState.length === 0 ? (
            <p className="text-muted">No vaccines in cart</p>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 g-4">
              {cartState.map((item) => (
                <div key={item.id} className="col">
                  <div className="card h-100 vaccine-card">
                    <div className="card-body">
                      <h6 className="card-title fw-bold">{item.name}</h6>
                      <p className="card-text">
                        <i>Origin: Abbott (Netherlands)</i>
                      </p>
                      <p className="card-text fw-bold">{formatCurrency(item.price)}</p>
                      <p className="card-text">
                        <i>Prevents: Flu</i>
                      </p>
                    </div>
                    <div className="card-footer d-flex justify-content-between align-items-center">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveVaccine(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="card p-3 mt-5">
            <div className="mb-3">
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
                  <label htmlFor="vnpay" className="form-check-label">
                    VN Pay
                  </label>
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
                  <label htmlFor="cash" className="form-check-label">
                    Cash
                  </label>
                </div>
              </div>
            </div>
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
          <div className="d-flex gap-3 mt-3">
            <button
              className="btn btn-success w-50"
              onClick={handleReset}
            >
              Reset Information
            </button>
            <button
              type="submit"
              className="btn btn-primary w-50 checkout-submit-btn fw-bold bg-primary border-0"
              onClick={handleSubmit}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}