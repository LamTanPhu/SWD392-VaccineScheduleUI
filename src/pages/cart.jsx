import { useEffect, useMemo, useState } from "react";
import { RELATIONSHIPS } from "../utils/constants";
import { formatCurrency } from "../utils/utils";
import IconTrash from "../components/icons/IconTrash";
import { useNavigate } from "react-router-dom";
;
export default function Cart() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    children: [
      {
        relationship: "",
        fullName: "",
        gender: "",
        birthDate: "",
        allergies: "",
      },
    ],
  });
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    selectedChild: "",
  });
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    setUser(user);
    setCart(cart);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
    });
  }, []);

  const total = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("formData", JSON.stringify(formData));
    navigate("/checkout")
  };

  const handleSelectChild = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      selectedChild: value,
    }));
  };

  const onChangeQuantity = (id, quantity) => {
    let clone = [...cart];
    let item = clone.find(x => x.id === id);
    if (item.quantity + quantity === 0) {
      return;
    }

    item.quantity += quantity;

    setCart(clone);
    localStorage.setItem("cart", JSON.stringify(clone));
  };

  const removeItem = (id) => {
    let clone = [...cart];
    clone = clone.filter(x => x.id !== id);
    setCart(clone);
    localStorage.setItem("cart", JSON.stringify(clone));
  };

  return (
    <div className="container mx-auto mt-5">
      <h1 className="text-4xl font-bold text-primary border-b border-primary w-fit pb-1 mb-5">
        Thông tin tài khoản
      </h1>
      <div className="grid gap-10 grid-cols-[65%_35%]">
        <form className="text-sm" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Họ và tên</label>
              <input
                type="text"
                className="border border-gray px-5 py-2 rounded-lg cursor-not-allowed"
                placeholder="nhập họ và tên của bạn..."
                name="fullName"
                required
                defaultValue={user.fullName}
                disabled
                readOnly
              ></input>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Email</label>
              <input
                type="email"
                className="border border-gray px-5 py-2 rounded-lg cursor-not-allowed"
                placeholder="nhập email của bạn..."
                name="email"
                required
                defaultValue={user.email}
                disabled
                readOnly
              ></input>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Số điện thoại</label>
              <input
                type="text"
                className="border border-gray px-5 py-2 rounded-lg cursor-not-allowed"
                placeholder="nhập số điện thoại của bạn..."
                name="phone"
                required
                defaultValue={user.phone}
                disabled
                readOnly
              ></input>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Địa chỉ</label>
              <input
                type="text"
                className="border border-gray px-5 py-2 rounded-lg cursor-not-allowed"
                placeholder="nhập địa chỉ của bạn..."
                name="address"
                required
                defaultValue={user.address}
                disabled
                readOnly
              ></input>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Chọn trẻ tiêm</label>
              <select
                className="border border-gray px-5 py-2 rounded-lg cursor-not-allowed"
                name="address"
                required
                defaultValue={user.address}
                onChange={handleSelectChild}
              >
                <option value="">Chọn trẻ tiêm</option>
                {user.children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-6">
            <h1 className="text-lg font-bold text-primary border-b border-primary w-fit pb-1 my-5">
              Thông tin của trẻ
            </h1>
            <div className="grid grid-cols-3 gap-4">
              {
                cart.map((item) => (
                  <div key={item.id} className="border border-gray rounded-lg px-3 py-2">
                    <div className="flex justify-end mb-2">
                      <button className="" type="button" onClick={() => removeItem(item.id)}>
                        <IconTrash />
                      </button>
                    </div>
                    <h1 className="font-semibold text-lg uppercase">{item.name}</h1>
                    <p>
                      <i>Nguồn gốc: Việt Nam</i>
                    </p>
                    <p className="text-xl font-semibold text-primary mt-4">{formatCurrency(item.price)}</p>
                    <div className="flex gap-2 items-center justify-center mt-4">
                      <button className="rounded-full bg-primary text-white w-5 h-5" type="button" onClick={() => onChangeQuantity(item.id, -1)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button className="rounded-full bg-primary text-white w-5 h-5" type="button" onClick={() => onChangeQuantity(item.id, 1)}>
                        +
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          <button className="px-5 py-2 rounded-lg bg-primary text-white w-full mb-3 max-w-[200px]">
            Lưu thay đổi
          </button>
        </form>
        <div className="border border-gray rounded-lg px-5 py-5 h-fit">
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
        </div>
      </div>
    </div>
  );
}
