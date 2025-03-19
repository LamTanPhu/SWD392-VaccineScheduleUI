import { useParams } from "react-router-dom";
import { CATEGORIES, FLAT_CATEGORIES, PRODUCT_TYPES, PRODUCTS, STATUS } from "../../utils/constants";
import { useEffect, useState } from "react";
import NO_IMAGE from "../../assets/images/no-image.jpg";

export default function EditProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
    image_url: NO_IMAGE,
    type: "",
    categories: [],
    status: STATUS.SHOW.value,
  });
  useEffect(() => {
    if (id) {
      const product = PRODUCTS.find((product) => product.id === Number(id));
      setProduct(product);
      console.log(product);

    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(product);
    if (!id) {
      let newId = PRODUCTS.length + 2;
      setProduct((prev) => ({ ...prev, id: newId }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "image_url") {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setProduct((prev) => ({ ...prev, image_url: imageUrl }));
      }
      return;
    }
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (categoryId) => {
    if (product.categories.includes(categoryId)) {
      setProduct((prev) => ({
        ...prev,
        categories: prev.categories.filter((id) => id !== categoryId),
      }));
      return;
    }
    const category = FLAT_CATEGORIES.find((category) => category.id === categoryId);
    if (category.isParent) {
      const childCategories = FLAT_CATEGORIES.filter(cat => cat.parentId === category.id);
      const childIds = childCategories.map(child => child.id);
      setProduct((prev) => ({
        ...prev,
        categories: [...prev.categories, categoryId, ...childIds],
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        categories: [...prev.categories, categoryId],
      }));
    }
  };
  return (
    <div className="container mx-auto mt-5">
      <h1 className="text-4xl font-bold text-primary border-b border-primary w-fit pb-1 mb-5">
        {id ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
      </h1>
      <form className="text-sm grid grid-cols-2 gap-10" onSubmit={handleSubmit}>
          <div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Tên sản phẩm</label>
              <input
                type="text"
                className="border border-gray px-5 py-2 rounded-lg"
                placeholder="nhập tên sản phẩm..."
                name="name"
                onChange={handleInputChange}
                required
                defaultValue={product.name}
              ></input>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Giá sản phẩm</label>
              <input
                type="number"
                className="border border-gray px-5 py-2 rounded-lg"
                placeholder="nhập giá sản phẩm..."
                name="price"
                onChange={handleInputChange}
                required
                defaultValue={product.price}
              ></input>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Hình ảnh sản phẩm</label>
              <input
                id="image_url"
                type="file"
                className="hidden border border-gray px-5 py-2 rounded-lg"
                name="image_url"
                onChange={handleInputChange}
                src={product.image_url}
              ></input>
              <label htmlFor="image_url" onClick={() => {}}>
                <img src={product.image_url} alt="product" className="w-full h-40 object-cover rounded-lg" />
              </label>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Loại sản phẩm</label>
              <select className="border border-gray px-5 py-2 rounded-lg" name="type" onChange={handleInputChange} required value={product.type}>
                <option value="">Loại sản phẩm</option>
                <option value={PRODUCT_TYPES.VACCINE_COMBO.value}>Gói vắc xin</option>
                <option value={PRODUCT_TYPES.VACCINE_SINGLE.value}>Vắc xin lẻ</option>
              </select>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Trạng thái</label>
              <select className="border border-gray px-5 py-2 rounded-lg" name="status" onChange={handleInputChange} required value={product.status}>
                <option value={STATUS.SHOW.value}>Hiển thị</option>
                <option value={STATUS.HIDE.value}>Ẩn</option>
              </select>
            </div>
            <button type="submit" className="bg-primary text-white px-5 py-2 rounded-lg">Lưu sản phẩm</button>
          </div>
          <div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Danh mục sản phẩm</label>
              <div className="flex flex-wrap gap-2">
                {FLAT_CATEGORIES.map((category) => (
                  <div key={category.id} className="flex items-center gap-2">
                    <input id={`category-${category.id}`} type="checkbox" name={`categories[${category.id}]`} onChange={() => handleCategoryChange(category.id)} checked={product.categories.includes(category.id)} />
                    <label className={`text-sm ${category.isParent ? "font-bold" : ""}`} htmlFor={`category-${category.id}`}>{category.name}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
      </form>

    </div>
  );
}