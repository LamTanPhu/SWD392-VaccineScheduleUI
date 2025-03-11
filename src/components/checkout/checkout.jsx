import { useMemo } from "react";
import { formatCurrency } from "../utils/utils";
import './checkout.css'; // Import the separate checkout CSS

export default function Checkout() {
  const cart = useMemo(() => {
    return JSON.parse(localStorage.getItem("cart")) ?? [];
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="h1 fw-bold text-primary border-bottom border-primary pb-1 mb-5">
        Thanh toán
      </h1>
      <div className="d-flex justify-content-between">
        <div className="col-6 px-2">
          <form>
            <div className="mb-4">
              <label className="form-label checkout-label">Họ và tên</label>
              <input
                type="text"
                className="form-control checkout-input"
                placeholder="Nhập tên người nhận..."
              />
            </div>
            <div className="mb-4">
              <label className="form-label checkout-label">Email</label>
              <input
                type="email"
                className="form-control checkout-input"
                placeholder="Nhập địa chỉ email..."
              />
            </div>
            <div className="mb-4">
              <label className="form-label checkout-label">Địa chỉ</label>
              <input
                type="text"
                className="form-control checkout-input"
                placeholder="Nhập địa chỉ giao hàng..."
              />
            </div>
            <div className="d-flex gap-3 mb-4">
              <div className="flex-fill">
                <label className="form-label checkout-label">Thành phố</label>
                <input
                  type="text"
                  className="form-control checkout-input"
                  placeholder="Nhập thành phố..."
                />
              </div>
              <div className="flex-fill">
                <label className="form-label checkout-label">Mã bưu chính (không bắt buộc)</label>
                <input
                  type="text"
                  className="form-control checkout-input"
                  placeholder="Nhập mã bưu chính..."
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label checkout-label">Số điện thoại</label>
              <input
                type="text"
                className="form-control checkout-input"
                placeholder="Nhập số điện thoại..."
              />
            </div>
            <div className="mb-4">
              <label className="form-label checkout-label">Hình thức thanh toán</label>
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <input type="radio" id="vnpay" name="payment" className="form-check-input" />
                  <img
                    className="checkout-payment-icon"
                    src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
                    alt="VN Pay"
                  />
                  <label htmlFor="vnpay" className="form-check-label">VN Pay</label>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <input type="radio" id="cash" name="payment" className="form-check-input" />
                  <img
                    className="checkout-payment-icon"
                    src="https://cdn-icons-png.flaticon.com/512/2460/2460470.png"
                    alt="Cash"
                  />
                  <label htmlFor="cash" className="form-check-label">Tiền mặt</label>
                </div>
              </div>
            </div>
            <button className="btn btn-primary w-100 checkout-submit-btn fw-bold mt-3">
              Thanh toán ngay
            </button>
          </form>
        </div>
        <div className="col-6 ps-5">
          <h5 className="fw-bold mb-5 border-bottom pb-1">Chi tiết đơn hàng</h5>
          {cart.map((item) => (
            <div key={item.id} className="d-flex align-items-start gap-3 mb-3">
              <div className="position-relative checkout-product-image">
                <img src={item.image_url} alt="product image" className="img-fluid h-100" />
                <span className="position-absolute top-0 end-0 checkout-quantity-badge bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center">
                  {item.quantity}
                </span>
              </div>
              <div>
                <p className="fw-bold">{item.name}</p>
                <p>{formatCurrency(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}