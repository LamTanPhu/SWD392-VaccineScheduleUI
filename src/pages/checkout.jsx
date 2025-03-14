import { useMemo } from "react";
import { formatCurrency } from "../utils/utils";

export default function Checkout() {
  const cart = useMemo(() => {
    return JSON.parse(localStorage.getItem("cart")) ?? [];
  }, []);

  return (
    <div className="container mx-auto mt-5">
      <h1 className="text-4xl font-bold text-primary border-b border-primary w-fit pb-1 mb-5">
        Thanh toán
      </h1>
      <div className="flex items-stretch justify-between">
        <div className="w-1/2 px-2">
          <form>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Họ và tên</label>
              <input
                type="text"
                className="border border-gray px-5 py-2 rounded-lg"
                placeholder="Nhập tên người nhận..."
              ></input>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Email</label>
              <input
                type="email"
                className="border border-gray px-5 py-2 rounded-lg"
                placeholder="Nhập địa chỉ email..."
              ></input>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Địa chỉ</label>
              <input
                type="text"
                className="border border-gray px-5 py-2 rounded-lg"
                placeholder="Nhập địa chỉ giao hàng..."
              ></input>
            </div>
            <div className="flex w-full gap-5">
              <div className="flex flex-col gap-2 mb-4 w-full">
                <label className="text-sm">Thành phố</label>
                <input
                  type="text"
                  className="border border-gray px-5 py-2 rounded-lg"
                  placeholder="Nhập thành phố..."
                ></input>
              </div>
              <div className="flex flex-col gap-2 mb-4 w-full">
                <label className="text-sm">Mã bưu chính (không bắt buộc)</label>
                <input
                  type="text"
                  className="border border-gray px-5 py-2 rounded-lg"
                  placeholder="Nhập mã bưu chính..."
                ></input>
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Số điện thoại</label>
              <input
                type="text"
                className="border border-gray px-5 py-2 rounded-lg"
                placeholder="Nhập số điện thoại..."
              ></input>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Hình thức thanh toán</label>
              <div>
                <div className="flex items-center gap-3">
                  <input type="radio" id="vnpay" name="payment" />
                  <img
                    className="w-[20px] object-contain"
                    src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
                  />
                  <label htmlFor="vnpay">VN Pay</label>
                </div>
                <div className="flex items-center gap-3">
                  <input type="radio" id="cash" name="payment" />
                  <img
                    className="w-[20px] object-contain"
                    src="https://cdn-icons-png.flaticon.com/512/2460/2460470.png"
                  />
                  <label htmlFor="cash">Tiền mặt</label>
                </div>
              </div>
            </div>
            <button className="bg-primary w-full text-white py-2 rounded-lg font-bold cursor-pointer mt-3">
              Thanh toán ngay
            </button>
          </form>
        </div>
        <div className="w-1/2 pl-5 h-full">
            <h5 className="font-bold text-xl mb-5 border-b">
                Chi tiết đơn hàng
            </h5>
          {cart.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <div className="relative w-[100px] h-[100px]">
                <img src={item.image_url} alt="product image" />
                <p className="absolute top-0 h-[20px] w-[20px] flex items-center justify-center right-0 border rounded-full bg-gray font-bold">
                  {item.quantity}
                </p>
              </div>
              <div>
                <p className="font-bold">{item.name}</p>
                <p>{formatCurrency(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
