import { useEffect, useMemo, useState } from "react";
import IconTrash from "../icons/IconTrash";
import { formatCurrency } from "../utils/utils";
import './cart.css'; // Import the separate cart CSS

export default function Cart() {
  const [cart, setCart] = useState([]);
  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")) ?? []);
  }, []);

  const onChangeQuantity = (e, item) => {
    let newQuantity = e.target.value;

    if (newQuantity <= 0 && newQuantity !== "") {
      return;
    }

    let clone = [...cart];
    let index = cart.findIndex((x) => x.id === item.id);
    clone[index].quantity = newQuantity || 1;

    localStorage.setItem("cart", JSON.stringify(clone));
    setCart(clone);
  };

  const onRemove = (item) => {
    let index = cart.findIndex((x) => x.id === item.id);
    let clone = [...cart];
    clone.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(clone));
    setCart(clone);
  };

  const total = useMemo(() => {
    return cart.reduce((x, item) => Number(x) + item.price * item.quantity, 0);
  }, [cart]);

  return (
    <div className="container mt-5">
      <h1 className="h1 fw-bold text-primary border-bottom border-primary pb-1 mb-5">
        Giỏ hàng
      </h1>
      <div className="d-flex">
        <table className="table w-75">
          <thead className="bg-primary text-white">
            <tr>
              <th className="py-2">Sản phẩm</th>
              <th className="py-2" style={{ width: "100px" }}>
                Số lượng
              </th>
              <th className="py-2" style={{ width: "400px" }}>
                Tổng
              </th>
              <th className="py-2" style={{ width: "100px" }}></th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td className="p-2">
                  <div className="d-flex gap-2 align-items-center">
                    <img className="img-fluid cart-product-image" src={item.image_url} alt={item.name} />
                    <p>{item.name}</p>
                  </div>
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    className="form-control cart-quantity-input text-center"
                    value={item.quantity}
                    onChange={(e) => onChangeQuantity(e, item)}
                  />
                </td>
                <td className="p-2 text-center">
                  {formatCurrency(item.price * item.quantity)}
                </td>
                <td className="p-2 text-center">
                  <button className="btn btn-link cart-remove-btn p-0" onClick={() => onRemove(item)}>
                    <IconTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="w-25 ps-5">
          <div className="card cart-summary p-3">
            <p className="d-flex justify-content-between">
              <span>Tạm tính:</span>
              <span>
                <strong>{formatCurrency(total)}</strong>
              </span>
            </p>
            <p className="d-flex justify-content-between">
              <span>Phí ship:</span>
              <span>Miễn phí</span>
            </p>
            <hr className="my-3" />
            <p className="d-flex justify-content-between cart-total">
              <span>Tổng cộng:</span>
              <span>
                <strong>{formatCurrency(total)}</strong>
              </span>
            </p>
            <small className="text-muted">Giá đã bao gồm thuế (VAT)</small>
            <div className="text-center mt-4">
              <a
                className="btn btn-primary w-100 cart-checkout-btn"
                href="/checkout"
              >
                Thanh toán
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}