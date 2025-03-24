import { formatCurrency } from "../../utils/utils";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart, Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import { Link } from "react-router";

export default function Dashboard() {
  return (
    <div className="">
      <div className="grid grid-cols-4 flex-wrap gap-4 mb-4">
        <div className="bg-orange-300 p-4 rounded-lg">
          <h2 className="text-sm font-semibold">Số sản phẩm bán được</h2>
          <p className="text-4xl font-bold">100</p>
        </div>
        <div className="bg-amber-200 p-4 rounded-lg">
          <h2 className="text-sm font-semibold">Đơn hàng mới</h2>
          <p className="text-4xl font-bold">100</p>
        </div>
        <div className="bg-orange-500 p-4 rounded-lg">
          <h2 className="text-sm font-semibold">Đơn hàng đang vận chuyển</h2>
          <p className="text-4xl font-bold">100</p>
        </div>
        <div className="bg-green-500 p-4 rounded-lg">
          <h2 className="text-sm font-semibold">Đơn hàng đã giao</h2>
          <p className="text-4xl font-bold">100</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-pink-200 p-4 rounded-lg">
          <h2 className="text-sm font-semibold">Tổng doanh thu</h2>
          <p className="text-4xl font-bold">{formatCurrency(1000000)}</p>
        </div>
        <div className="bg-red-200 p-4 rounded-lg">
          <h2 className="text-sm font-semibold">Tổng bán được</h2>
          <p className="text-4xl font-bold">{formatCurrency(1000000)}</p>
        </div>
        <Link to="/admin/users" className="bg-orange-100 p-4 rounded-lg">
          <h2 className="text-sm font-semibold">Tổng số khách hàng</h2>
          <p className="text-4xl font-bold">100</p>
        </Link>
      </div>
      <div className="bg-white p-4 rounded-lg mb-4">
        <OrderChart />
      </div>
      <div className="bg-white p-4 rounded-lg">
        <IncomeChart />
      </div>
    </div>
  );
}

const OrderChart = () => {
  const labels = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Đơn hàng mới",
        data: labels.map(() => faker.number.int({ min: 0, max: 100 })),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgb(255, 99, 132)",
      },
      {
        label: "Đơn hàng đang giao",
        data: labels.map(() => faker.number.int({ min: 0, max: 50 })),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgb(53, 162, 235)",
      },
      {
        label: "Đơn hàng đã giao",
        data: labels.map(() => faker.number.int({ min: 0, max: 50 })),
        borderColor: "oklch(0.705 0.213 47.604)",
        backgroundColor: "oklch(0.705 0.213 47.604)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Biểu đồ đơn hàng",
      },
    },
    elements: {
      line: {
        tension: 0.5, // Global line tension (can be overridden by dataset)
      },
    }
  };
  return <Line options={options} data={data} />;
};

const IncomeChart = () => {
  const labels = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Tổng doanh thu (VND)",
        data: labels.map(() => faker.number.int({ min: -50000000, max: 100000000 })),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgb(255, 99, 132)",
      },
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Biểu đồ đơn hàng",
      },
    },
    elements: {
      line: {
        tension: 0.5, // Global line tension (can be overridden by dataset)
      },
    }
  };
  return <Line options={options} data={data} />;
};
