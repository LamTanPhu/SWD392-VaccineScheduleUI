import { useEffect, useState } from "react";
import { CATEGORIES, PRODUCT_TYPES, PRODUCTS } from "../../utils/constants";
import { formatCurrency } from "../../utils/utils";
import CustomSelect from "../../components/common/select";

export default function ProductList() {
  const [products, setProducts] = useState(PRODUCTS);

  useEffect(() => {
    const _products = JSON.parse(localStorage.getItem("products"));

    if (_products) {
      setProducts(_products);
    } else {
      localStorage.setItem("products", JSON.stringify(PRODUCTS));
    }
  }, []);

  const onFilter = (type) => {
    const _products = JSON.parse(localStorage.getItem("products"));
    if (type === "") {
      setProducts(_products);
    } else {
      setProducts(_products.filter((item) => item.type === type));
    }
  };

  const onCategoryFilter = (category) => {
    console.log(category);

    const _products = JSON.parse(localStorage.getItem("products"));
    if (category === "") {
      setProducts(_products);
    } else {
      setProducts(
        _products.filter((item) => item.categories.includes(Number(category)))
      );
    }
  };
  return (
    <div className="container mx-auto mt-5">
      <h1 className="text-4xl font-bold text-primary border-b border-primary w-fit pb-1 mb-5">
        Danh sách sản phẩm
      </h1>
      <div className="flex gap-2 mb-2 justify-start">
        <select
          className="px-4 py-2 rounded-lg bg-primary text-white"
          onChange={(e) => onFilter(e.target.value)}
        >
          <option value="">Tất cả</option>
          {Object.values(PRODUCT_TYPES).map((item, index) => (
            <option value={item.value} key={index}>
              {item.name}
            </option>
          ))}
        </select>
        <CustomSelect
          value={""}
          onChange={(e) => onCategoryFilter(e.target.value)}
          options={CATEGORIES}
          placeholder="Danh mục"
        />
      </div>
      <table className="w-full">
        <thead className="bg-gray">
          <tr>
            <th className="p-2">Id</th>
            <th className="p-2">Tên sản phẩm</th>
            <th className="p-2">Giá</th>
            <th className="p-2">Loại sản phẩm</th>
            <th className="p-2">Trạng thái</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => {
            return (
              <tr key={item.id}>
                <td className="p-2 border border-gray text-center">
                  {item.id}
                </td>
                <td className="p-2 border border-gray text-center">
                  {item.name}
                </td>
                <td className="p-2 border border-gray text-center">
                  {formatCurrency(item.price)}
                </td>
                <td className="p-2 border border-gray text-center">
                  {PRODUCT_TYPES[item.type]?.name}
                </td>
                <td className="p-2 border border-gray text-center">
                    Status
                </td>
                <td className="p-2 border border-gray text-center">
                  <a href={`/staff/edit-product/${item.id}`} className="text-primary">
                    Xem chi tiết
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}