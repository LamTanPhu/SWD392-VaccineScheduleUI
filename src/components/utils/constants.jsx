import Product1 from "./../assets/images/p1_1.png"
import Product2 from "./../assets/images/p1.png"
import Product3 from "./../assets/images/p3.png"
import Product4 from "./../assets/images/p4.png"
import Product5 from "./../assets/images/p5.png"
import Product6 from "./../assets/images/p6.png"
export const PRODUCT_TYPES = {
  VACCINE_COMBO: {
    name: "Gói vắc xin",
    value: "VACCINE_COMBO",
  },
  VACCINE_SINGLE: {
    name: "Vắc xin lẻ",
    value: "VACCINE_SINGLE",
  },
};
export const STATUS = {
  SHOW: {
    name: "Hiển thị",
    value: "SHOW",
  },
  HIDE: {
    name: "Ẩn",
    value: "HIDE",
  },
};

export const CATEGORIES = [
  {
    id: 1,
    name: "Vắc xin trẻ em",
    children: [
      {
        id: 2,
        name: "0-9 tháng",
      },
      {
        id: 3,
        name: "0-12 tháng",
      },
      {
        id: 4,
        name: "6-24 tháng",
      },
      {
        id: 5,
        name: "12-24 tháng",
      },
    ]
  },
  {
    id: 6,
    name: "Vắc xin cho trẻ tiền học đường",
    children: [
      {
        id: 7,
        name: "4-6 tuổi",
      },
    ]
  },
  {
    id: 8,
    name: "Vắc xin cho tuổi vị thành niên và thanh niên",
    children: [
      {
        id: 9,
        name: "9-18 tuổi",
      },
    ]
  },
]
export const PRODUCTS = [
  {
    id: 1,
    name: "VẮC XIN SỐT XUẤT HUYẾT",
    price: 2000000,
    image_url: Product1,
    type: PRODUCT_TYPES.VACCINE_COMBO.value,
    categories: [3,4,9],
    status: STATUS.SHOW.value,
  },
  {
    id: 2,
    name: "VẮC XIN PHẾ CẦU 23",
    price: 2000000,
    image_url: Product2,
    type: PRODUCT_TYPES.VACCINE_SINGLE.value,
    categories: [7,9],
    status: STATUS.SHOW.value,
  },
  {
    id: 3,
    name: "VẮC XIN PHẾ CẦU 13",
    price: 2000000,
    image_url: Product3,
    type: PRODUCT_TYPES.VACCINE_SINGLE.value,
    categories: [5],
    status: STATUS.SHOW.value,
  },
  {
    id: 4,
    name: "VẮC XIN SỐT XUẤT HUYẾT",
    price: 2000000,
    image_url: Product4,
    type: PRODUCT_TYPES.VACCINE_SINGLE.value,
    categories: [3,4,9],
    status: STATUS.SHOW.value,
  },
  {
    id: 5,
    name: "VẮC XIN SỐT XUẤT HUYẾT",
    price: 2000000,
    image_url: Product5,
    type: PRODUCT_TYPES.VACCINE_SINGLE.value,
    categories: [2],
    status: STATUS.SHOW.value,
  },
  {
    id: 6,
    name: "VẮC XIN SỐT XUẤT HUYẾT",
    price: 2000000,
    image_url: Product6,
    type: PRODUCT_TYPES.VACCINE_SINGLE.value,
    categories: [3],
    status: STATUS.SHOW.value,
  },
];

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const HOURS = ["7:00", "9:00", "11:00", "13:00", "15:00", "17:00", "19:00"];
export const DOCTORS = [
  {
    id: 1,
    name: "Mr. 1",
  },
  {
    id: 2,
    name: "Mr. 2",
  },
  {
    id: 3,
    name: "Mr. 3",
  },
  {
    id: 4,
    name: "Mr. 4",
  },
  {
    id: 5,
    name: "Mr. 5",
  },
  {
    id: 6,
    name: "Mr. 6",
  },
  {
    id: 7,
    name: "Mr. 7",
  },
  {
    id: 8,
    name: "Mr. 8",
  },
]
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

export const FLAT_CATEGORIES = CATEGORIES.reduce((acc, category) => {
  acc.push({
    id: category.id,
    name: category.name,
    parentId: null,
    isParent: true
  });

  if (category.children) {
    category.children.forEach(child => {
      acc.push({
        id: child.id,
        name: child.name,
        parentId: category.id,
        isParent: false
      });
    });
  }

  return acc;
}, []);