import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { formatCurrency } from "../utils/utils";
import "./checkout.css";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const cart = useMemo(() => JSON.parse(localStorage.getItem("cart")) || [], []);
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
        console.log("Parent Profile:", profileResponse.data);
        setParentProfile(profileResponse.data);

        const childrenResponse = await api.get("/api/ChildrenProfile/my-children");
        console.log("Children Profiles:", childrenResponse.data);
        setChildren(childrenResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data");
        console.error("Error fetching data:", err.response || err);
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
    return cart.reduce((sum, item) => sum + item.price, 0);
  }, [cart]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.childId) {
      alert("Please select a child for this order.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty. Add items to proceed.");
      return;
    }

    setOrderError(null);
    setOrderSuccess(false);

    // Map cart items to vaccines (assuming all are vaccines for now)
    const vaccines = cart.map((item) => ({
      vaccineId: item.id,
      quantity: 1, // Hardcoded to 1 as per UI
    }));

    // If you add a "type" field to cart items, you can split vaccines and packages like this:
    /*
    const vaccines = cart
      .filter((item) => item.type === "vaccine")
      .map((item) => ({
        vaccineId: item.id,
        quantity: 1, // Update if you add quantity support in UI
      }));

    const vaccinePackages = cart
      .filter((item) => item.type === "package")
      .map((item) => ({
        vaccinePackageId: item.id,
        quantity: 1,
      }));
    */

    // Prepare order data matching OrderRequestDTO
    const orderData = {
      profileId: formData.childId,
      purchaseDate: new Date().toISOString(),
      vaccines: vaccines,
      vaccinePackages: [], // Empty for now—uncomment the above block if cart includes packages
      // Optional fields (not used by backend yet, but included for future-proofing)
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      phone: formData.phone,
      paymentMethod: formData.paymentMethod,
      parentUsername: parentProfile?.username,
      parentEmail: parentProfile?.email,
    };

    console.log("Submitting order:", orderData);

    try {
      const response = await api.post("/api/Order", orderData);
      console.log("Order response:", response.data);
      setOrderSuccess(true);
      localStorage.removeItem("cart");
      setTimeout(() => {
        navigate("/order-confirmation", { state: { order: response.data } });
      }, 2000);
    } catch (err) {
      setOrderError(err.response?.data?.message || "Failed to place order");
      console.error("Order submission error:", err.response || err);
    }
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

            {/* Child Details Form */}
            <div className="mb-4">
              <h5 className="fw-bold mb-3">Selected Child Details</h5>
              {selectedChild ? (
                <div className="card p-3">
                  <div className="mb-3">
                    <label className="form-label checkout-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control checkout-input"
                      value={selectedChild.fullName || ""}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label checkout-label">Date of Birth</label>
                    <input
                      type="text"
                      className="form-control checkout-input"
                      value={new Date(selectedChild.dateOfBirth).toLocaleDateString() || ""}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label checkout-label">Gender</label>
                    <input
                      type="text"
                      className="form-control checkout-input"
                      value={selectedChild.gender || ""}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label checkout-label">Status</label>
                    <input
                      type="text"
                      className="form-control checkout-input"
                      value={selectedChild.status || ""}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label checkout-label">Address</label>
                    <input
                      type="text"
                      className="form-control checkout-input"
                      value={selectedChild.address || ""}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label checkout-label">Account ID</label>
                    <input
                      type="text"
                      className="form-control checkout-input"
                      value={selectedChild.accountId || ""}
                      readOnly
                    />
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