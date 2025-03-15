import { useEffect, useState } from "react";
import { RELATIONSHIPS } from "../../utils/constants";

export default function UserInfo() {
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setFormData(user);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("children[")) {
      const matches = name.match(/children\[(\d+)\]\.(.+)/);
      if (matches) {
        const [, index, field] = matches;
        setFormData((prev) => ({
          ...prev,
          children: prev.children.map((child, i) => {
            if (i === parseInt(index)) {
              return { ...child, [field]: value };
            }
            return child;
          }),
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const addChild = () => {
    setFormData((prev) => ({
      ...prev,
      children: [
        ...prev.children,
        {
          relationship: "",
          fullName: "",
          gender: "",
          birthDate: "",
          allergies: "",
        },
      ],
    }));
  };

  const removeChild = (index) => {
    setFormData((prev) => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    localStorage.setItem("user", JSON.stringify(formData));
    // Here you can send the data to your API
  };

  return (
    <div className="container mx-auto mt-5">
      <h1 className="text-4xl font-bold text-primary border-b border-primary w-fit pb-1 mb-5">
        Thông tin tài khoản
      </h1>
      <div className="grid grid-cols-2 gap-10">
        <form className="text-sm" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Họ và tên</label>
              <input
                type="text"
                className="border border-gray px-5 py-2 rounded-lg"
                placeholder="nhập họ và tên của bạn..."
                name="fullName"
                onChange={handleInputChange}
                required
                defaultValue={formData.fullName}
              ></input>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Email</label>
              <input
                type="email"
                className="border border-gray px-5 py-2 rounded-lg"
                placeholder="nhập email của bạn..."
                name="email"
                onChange={handleInputChange}
                required
                defaultValue={formData.email}
              ></input>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Số điện thoại</label>
              <input
                type="text"
                className="border border-gray px-5 py-2 rounded-lg"
                placeholder="nhập số điện thoại của bạn..."
                name="phone"
                onChange={handleInputChange}
                required
                defaultValue={formData.phone}
              ></input>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Địa chỉ</label>
              <input
                type="text"
                className="border border-gray px-5 py-2 rounded-lg"
                placeholder="nhập địa chỉ của bạn..."
                name="address"
                onChange={handleInputChange}
                required
                defaultValue={formData.address}
              ></input>
            </div>
          </div>
          <h1 className="text-lg font-bold text-primary border-b border-primary w-fit pb-1 my-5">
            Thông tin của trẻ
          </h1>
          {formData.children.map((child, index) => (
            <div key={index} className="mb-8 p-4 border border-gray rounded-lg relative">
              {formData.children.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeChild(index)}
                  className="absolute right-2 top-2 text-red-500"
                >
                  Xóa
                </button>
              )}

              <div className="flex flex-col gap-2 mb-4">
                <label className="text-sm">Mối quan hệ với phụ huynh</label>
                <select
                  name={`children[${index}].relationship`}
                  value={child.relationship}
                  onChange={handleInputChange}
                  className="border border-gray px-5 py-2 rounded-lg"
                  required
                >
                  <option value="">Chọn mối quan hệ</option>
                  {RELATIONSHIPS.map((relationship) => (
                    <option key={relationship.id} value={relationship.id}>
                      {relationship.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 mb-4">
                  <label className="text-sm">Họ và tên</label>
                  <input
                    type="text"
                    name={`children[${index}].fullName`}
                    value={child.fullName}
                    onChange={handleInputChange}
                    className="border border-gray px-5 py-2 rounded-lg"
                    placeholder="nhập họ và tên của trẻ..."
                    required
                  />
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  <label className="text-sm">Giới tính</label>
                  <div className="flex items-center gap-3 h-full">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={`male-${index}`}
                        name={`children[${index}].gender`}
                        value="male"
                        checked={child.gender === "male"}
                        onChange={handleInputChange}
                      />
                      <label htmlFor={`male-${index}`}>Nam</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={`female-${index}`}
                        name={`children[${index}].gender`}
                        value="female"
                        checked={child.gender === "female"}
                        onChange={handleInputChange}
                      />
                      <label htmlFor={`female-${index}`}>Nữ</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 mb-4">
                  <label className="text-sm">Ngày sinh</label>
                  <input
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    name={`children[${index}].birthDate`}
                    value={child.birthDate}
                    onChange={handleInputChange}
                    className="border border-gray px-5 py-2 rounded-lg"
                  />
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  <label className="text-sm">Dị ứng (nếu có)</label>
                  <input
                    type="text"
                    name={`children[${index}].allergies`}
                    value={child.allergies}
                    onChange={handleInputChange}
                    className="border border-gray px-5 py-2 rounded-lg"
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={addChild}
              className="w-fit px-5 py-2 rounded-lg bg-secondary text-white mb-2"
            >
              Thêm trẻ
            </button>

            <button className="px-5 py-2 rounded-lg bg-primary text-white w-full mb-3 max-w-[200px]">
              Lưu thay đổi
            </button>
          </div>
        </form>
        <div className="w-full">
          <h1 className="text-lg font-bold text-primary border-b border-primary w-fit pb-1 my-5">
            Lịch sử tiêm
          </h1>
          <table className="w-full border-collapse border border-gray">
            <thead className="bg-gray">
              <tr>
                <th className="p-2">Ngày tiêm</th>
                <th className="p-2">Tên trẻ</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border border-gray text-center">
                  2024-01-01
                </td>
                <td className="p-2 border border-gray text-center">
                  Trần Văn A
                </td>
                <td className="p-2 border border-gray text-center">
                  <a href="#">Xem chi tiết</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
