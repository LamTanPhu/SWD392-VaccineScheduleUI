import { formatCurrency } from "../utils/utils";

const Product = ({ item }) => {
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) ?? [];

    let itemIndex = cart.findIndex((x) => x.id === item.id);
    if (itemIndex === -1) {
      cart.push({ ...item, quantity: 1 });
    } else {
      cart[itemIndex].quantity += 1;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };
  return (
    <>
      <div>
        <img className="w-full h-full object-contain" src={item.image_url} />
      </div>
      <p className="mt-2 font-bold">{item.name}</p>
      <p className="mb-2">{formatCurrency(item.price)}</p>
      <button
        className="bg-transparent border border-primary px-5 py-1 rounded-md hover:bg-primary hover:text-white
      transition-all cursor-pointer"
        onClick={addToCart}
      >
        Thêm nhanh
      </button>
    </>
  );
};

export default Product;