import { useEffect, useMemo, useState } from "react";
import { formatCurrency } from "../utils/utils";
import IconTrash from "../icons/IconTrash";

export default function Cart() {
  const [cart, setCart] = useState([]);
  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")) ?? []);
  }, []);

  const onChangeQuantity = (e, item) => {
    let newQuantity = e.target.value;

    if (newQuantity <= 0 && newQuantity != "") {
      return;
    }

    let clone = [...cart];

    let index = cart.findIndex((x) => x.id === item.id);
    clone[index].quantity = newQuantity ?? 1;

    localStorage.setItem("cart", JSON.stringify(clone));
    setCart(clone);
  };

  const onRemove = (item) => {
    let index = cart.findIndex((x) => x.id === item.id);
    let clone = [...cart];
    clone.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(clone));
    setCart(clone);
  }

  const total = useMemo(() => {
    return cart.reduce((x, item) => {
      return Number(x) + item.price * item.quantity;
    }, 0);
  }, [cart]);

  return (
    <div className="container mx-auto mt-5">
      <h1 className="text-4xl font-bold text-primary border-b border-primary w-fit pb-1 mb-5">
        Giỏ hàng
      </h1>
      <div className="flex items-start">
        <table className="w-[70%]">
          <thead className="bg-primary text-white">
            <tr>
              <th className="py-2">Sản phẩm</th>
              <th role="col" className="py-2 w-[100px]">
                Số lượng
              </th>
              <th role="col" className="py-2 w-[400px]">
                Tổng
              </th>
              <th role="col" className="py2 w-[100px]"></th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td className="p-2">
                  <div className="flex gap-2 items-center">
                    <img className="max-w-[150px]" src={item.image_url} />
                    <p>{item.name}</p>
                  </div>
                </td>
                <td className="p-2 max-w-[100px]">
                  <input
                    type="number"
                    className="quantity border border-gray text-center w-full"
                    value={item.quantity}
                    onChange={(e) => onChangeQuantity(e, item)}
                  />
                </td>
                <td className="p-2 text-center">
                  {formatCurrency(item.price * item.quantity)}
                </td>
                <td>
                  <button className="text-center cursor-pointer" onClick={() => onRemove(item)}>
                    <IconTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="w-[30%] pl-5">
          <div className="border border-gray rounded-lg px-2 py-5">
            <p className="flex justify-between">
              <span>Tạm tính:</span>
              <span>
                <b>{formatCurrency(total)}</b>
              </span>
            </p>
            <p className="flex justify-between">
              <span>Phí ship:</span>
              <span>Miễn phí</span>
            </p>
            <hr className="my-3" />
            <p className="flex justify-between text-xl">
              <span>Tổng cộng:</span>
              <span>
                <b>{formatCurrency(total)}</b>
              </span>
            </p>
            <i className="text-sm">Giá đã bao gồm thuế (VAT)</i>
            <div className="mt-5 text-center">
              <a
                className="bg-primary w-full block px-5 py-1 rounded-lg text-white text-lg"
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