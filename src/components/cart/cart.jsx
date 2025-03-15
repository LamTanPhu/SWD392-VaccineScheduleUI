import React, { useEffect, useMemo, useState } from "react";
import IconTrash from "../icons/IconTrash";
import { formatCurrency } from "../utils/utils";
import "./cart.css";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const uniqueCart = storedCart.reduce((acc, item) => {
      if (!acc.find((i) => i.id === item.id)) {
        acc.push({ ...item, quantity: 1 });
      }
      return acc;
    }, []);
    localStorage.setItem("cart", JSON.stringify(uniqueCart));
    setCart(uniqueCart);
  }, []);

  const onRemove = (item) => {
    const updatedCart = cart.filter((cartItem) => cartItem.id !== item.id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  }, [cart]);

  return (
    <div className="container mt-5">
      <h1 className="h1 fw-bold text-primary border-bottom border-primary pb-1 mb-5">
        Cart
      </h1>
      <div className="d-flex">
        <table className="table w-75">
          <thead className="bg-primary text-white">
            <tr>
              <th className="py-2">Product</th>
              <th className="py-2" style={{ width: "100px" }}>
                Quantity
              </th>
              <th className="py-2" style={{ width: "150px" }}>
                Total
              </th>
              <th className="py-2" style={{ width: "100px" }}></th>
            </tr>
          </thead>
          <tbody>
            {cart.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-2 text-center text-muted">
                  Your cart is empty
                </td>
              </tr>
            ) : (
              cart.map((item) => (
                <tr key={item.id}>
                  <td className="p-2">
                    <div className="d-flex gap-2 align-items-center">
                      <img
                        className="img-fluid cart-product-image"
                        src={item.image || "https://via.placeholder.com/150"}
                        alt={item.name}
                      />
                      <p>{item.name}</p>
                    </div>
                  </td>
                  <td className="p-2 text-center">
                    <span>1</span>
                  </td>
                  <td className="p-2 text-center">{formatCurrency(item.price)}</td>
                  <td className="p-2 text-center">
                    <button
                      className="btn btn-link cart-remove-btn p-0"
                      onClick={() => onRemove(item)}
                    >
                      <IconTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="w-25 ps-5">
          <div className="card cart-summary p-3">
            <p className="d-flex justify-content-between">
              <span>Subtotal:</span>
              <span>
                <strong>{formatCurrency(total)}</strong>
              </span>
            </p>
            <hr className="my-3" />
            <p className="d-flex justify-content-between cart-total">
              <span>Total:</span>
              <span>
                <strong>{formatCurrency(total)}</strong>
              </span>
            </p>
            <small className="text-muted">Includes VAT</small>
            <p className="text-muted mt-2">
              Note: Only one of each vaccine or package per order.
            </p>
            <div className="text-center mt-4">
              <a
                className="btn btn-primary w-100 cart-checkout-btn bg-primary border-0"
                href="/checkout"
              >
                Proceed to Checkout
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}