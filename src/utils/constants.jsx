import Product1 from "./../assets/images/p1_1.png"
import Product2 from "./../assets/images/p1.png"
import Product3 from "./../assets/images/p3.png"
import Product4 from "./../assets/images/p4.png"
import Product5 from "./../assets/images/p5.png"
import Product6 from "./../assets/images/p6.png"

export const PRODUCTS = [
  {
    id: 1,
    name: "VẮC XIN SỐT XUẤT HUYẾT",
    price: 2000000,
    image_url: Product1
  },
  {
    id: 2,
    name: "VẮC XIN PHẾ CẦU 23",
    price: 2000000,
    image_url: Product2
  },
  {
    id: 3,
    name: "VẮC XIN PHẾ CẦU 13",
    price: 2000000,
    image_url: Product3
  },
  {
    id: 4,
    name: "VẮC XIN SỐT XUẤT HUYẾT",
    price: 2000000,
    image_url: Product4
  },
  {
    id: 5,
    name: "VẮC XIN SỐT XUẤT HUYẾT",
    price: 2000000,
    image_url: Product5
  },
  {
    id: 6,
    name: "VẮC XIN SỐT XUẤT HUYẾT",
    price: 2000000,
    image_url: Product6
  },
];

export const RELATIONSHIPS = [
  {
    id: 1,
    name: "Con",
  },
  {
    id: 2,
    name: "Bản thân",
  },
  {
    id: 3,
    name: "Cháu",
  },
  {
    id: 4,
    name: "Anh",
  },
  {
    id: 5,
    name: "Chị",
  },
  {
    id: 6,
    name: "Em",
  },
  {
    id: 7,
    name: "Cha",
  },
  {
    id: 8,
    name: "Mẹ",
  },
  {
    id: 9,
    name: "Vợ",
  },
  {
    id: 10,
    name: "Chồng",
  },
  {
    id: 11,
    name: "Ông  ",
  },
  {
    id: 12,
    name: "Bà",
  },
  {
    id: 13,
    name: "Cùng hộ khẩu",
  }
];

export const VACCINATION_LIST = [
  {
    id: 1,
    child_name: "Trần Văn A",
    vaccine_name: "Vắc xin dại",
    status: "new",
    datetime: "15/03/2025 9:00 AM",
  },
  {
    id: 2,
    child_name: "Trần Văn A",
    vaccine_name: "Vắc xin dại",
    status: "waiting",
    datetime: "15/03/2025 9:00 AM",
  },
  {
    id: 3,
    child_name: "Trần Văn A",
    vaccine_name: "Vắc xin dại",
    status: "done",
    datetime: "15/03/2025 9:00 AM",
  },
];

export const VACCINATION_STATUS = [
  {
    id: "new",
    name: "Mới đặt lịch",
  },
  {
    id: "waiting",
    name: "Chờ tiêm",
  },
  {
    id: "done",
    name: "Đã tiêm",
  },
];