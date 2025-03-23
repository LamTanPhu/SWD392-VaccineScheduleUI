import { useState } from "react";
import { VACCINATION_LIST, VACCINATION_STATUS } from "../../utils/constants";

export default function VaccinationSchedule() {
    const [data, setData] = useState(VACCINATION_LIST);
    const renderStatus = (status) => {
        switch (status) {
            case "waiting":
                return (
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-md">
                        Chờ tiêm
                    </span>
                );
            case "done":
                return (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-md">
                        Đã tiêm
                    </span>
                );
            case "new":
            default:
                return (
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-md">
                        Mới đặt lịch
                    </span>
                );
        }
    };

    const onFilter = (status) => {
        if (status === "") {
            setData(VACCINATION_LIST);
        } else {
            setData(VACCINATION_LIST.filter((item) => item.status === status));
        }
    };

    return (
        <div className="container mx-auto mt-5">
            <h1 className="text-4xl font-bold text-primary border-b border-primary w-fit pb-1 mb-5">
                Lịch tiêm chủng
            </h1>
            <div className="flex gap-2 mb-2 justify-end">
                <select
                    className="px-4 py-2 rounded-lg bg-primary text-white"
                    onChange={(e) => onFilter(e.target.value)}
                >
                    <option value="">Tất cả</option>
                    {VACCINATION_STATUS.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </div>
            <table className="w-full">
                <thead className="bg-gray">
                    <tr>
                        <th className="p-2">Id</th>
                        <th className="p-2">Ngày tiêm</th>
                        <th className="p-2">Tên trẻ</th>
                        <th className="p-2">Tên gói vắc xin</th>
                        <th className="p-2">Trạng thái</th>
                        <th className="p-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td className="p-2 border border-gray text-center">{item.id}</td>
                            <td className="p-2 border border-gray text-center">
                                {item.datetime}
                            </td>
                            <td className="p-2 border border-gray text-center">
                                {item.child_name}
                            </td>
                            <td className="p-2 border border-gray text-center">
                                {item.vaccine_name}
                            </td>
                            <td className="p-2 border border-gray text-center">
                                {renderStatus(item.status)}
                            </td>
                            <td className="p-2 border border-gray text-center">
                                <a href="#" className="text-primary">
                                    Xem chi tiết
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
