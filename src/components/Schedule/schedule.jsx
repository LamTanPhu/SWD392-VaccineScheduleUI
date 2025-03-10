import { useEffect, useState } from "react";
import { DAYS, DOCTORS, HOURS } from "./utils/constants";
import { default as _Modal } from "react-modal";

export default function Schedule() {
    const [selectedWeek, setSelectedWeek] = useState("");
    const [data, setData] = useState([]);
    const [cellSelected, setCellSelected] = useState({});
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        const data = [
            [DOCTORS[1], DOCTORS[2], DOCTORS[3], DOCTORS[4], DOCTORS[5], DOCTORS[6], DOCTORS[7]],
            [DOCTORS[1], DOCTORS[2], DOCTORS[3], DOCTORS[4], DOCTORS[5], DOCTORS[6], DOCTORS[7]],
            [DOCTORS[1], DOCTORS[2], DOCTORS[3], DOCTORS[4], DOCTORS[5], DOCTORS[6], DOCTORS[7]],
            [DOCTORS[1], DOCTORS[2], DOCTORS[3], DOCTORS[4], DOCTORS[5], DOCTORS[6], DOCTORS[7]],
            [DOCTORS[1], DOCTORS[2], DOCTORS[3], DOCTORS[4], DOCTORS[5], DOCTORS[6], DOCTORS[7]],
            [DOCTORS[1], DOCTORS[2], DOCTORS[3], DOCTORS[4], DOCTORS[5], DOCTORS[6], DOCTORS[7]],
            [DOCTORS[1], DOCTORS[2], DOCTORS[3], DOCTORS[4], DOCTORS[5], DOCTORS[6], DOCTORS[7]],
        ];
        setData(data);
    }, []);

    const onClick = (rowIndex, colIndex) => {
        setCellSelected({ rowIndex, colIndex });
        setOpen(true);
    };

    const onModalSubmit = (itemSelected) => {
        let clone = [...data];
        clone[cellSelected.rowIndex][cellSelected.colIndex] = itemSelected;
        setData(clone);
    };

    function closeModal() {
        setOpen(false);
    }

    return (
        <div className="container mx-auto mt-4">
            <input
                type="week"
                defaultValue={selectedWeek}
                onClick={(e) => setSelectedWeek(e.target.value)}
                className="border p-2 mb-4"
            />
            <table className="w-full border">
                <thead className="font-bold">
                    <tr>
                        <td></td>
                        {DAYS.map((item, index) => (
                            <td className="text-center py-3" key={index}>
                                {item}
                            </td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {HOURS.map((item, rowIndex) => (
                        <tr className="border" key={rowIndex}>
                            <td className="text-center py-5">{item}</td>
                            {data[rowIndex] &&
                                data[rowIndex].map((_item, colIndex) => (
                                    <td
                                        className="text-center border cursor-pointer hover:bg-gray"
                                        onClick={() => onClick(rowIndex, colIndex)}
                                        key={colIndex}
                                    >
                                        {_item.name}
                                    </td>
                                ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal
                isOpen={isOpen}
                closeModal={closeModal}
                onSubmit={onModalSubmit}
            ></Modal>
        </div>
    );
}

const Modal = ({ isOpen, closeModal, onSubmit }) => {
    const [doctors] = useState(DOCTORS);
    const [selected, setSelected] = useState({});

    const onClick = (item) => {
        setSelected(item);
    };

    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
        },
    };

    return (
        <_Modal
            isOpen={isOpen}
            ariaHideApp={false}
            onRequestClose={() => {
                closeModal();
            }}
            onAfterOpen={() => setSelected({})}
            contentLabel="doctor list"
            style={customStyles}
        >
            <div className="flex justify-end mb-3">
                <button
                    className="bg-primary px-2 py-1 rounded-lg text-white"
                    onClick={closeModal}
                >
                    close
                </button>
            </div>
            <h1 className="text-center text-xl font-bold mb-4">Danh sách bác sĩ</h1>
            <div className="flex flex-wrap gap-y-2">
                {doctors.map((item) => (
                    <button
                        key={item.id}
                        className={`w-1/4 bg-transparent border py-2 border-primary ${
                            selected.id === item.id && "!bg-primary text-white"
                        }`}
                        onClick={() => onClick(item)}
                    >
                        {item.name}
                    </button>
                ))}
            </div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit(selected);
                    closeModal();
                }}
            >
                <button className="mt-3 bg-primary rounded-lg px-5 py-2 text-white font-bold">
                    Lưu
                </button>
            </form>
        </_Modal>
    );
};