import { useEffect, useState } from "react";
import { DAYS, DOCTORS, HOURS } from "./utils/constants";
import Modal from 'react-modal';
import { format, startOfWeek, addDays } from 'date-fns';
import './Schedule.css';

export default function Schedule() {
    const [selectedWeek, setSelectedWeek] = useState(startOfWeek(new Date()));
    const [schedule, setSchedule] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call to fetch schedule
        const fetchSchedule = async () => {
            setLoading(true);
            try {
                // Replace with actual API call
                const weekSchedule = HOURS.map(hour => ({
                    hour,
                    slots: DAYS.map(day => ({
                        day,
                        doctor: null,
                        available: Math.random() > 0.3 // Randomly set availability
                    }))
                }));
                setSchedule(weekSchedule);
            } catch (error) {
                console.error('Failed to fetch schedule:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, [selectedWeek]);

    const handleSlotClick = (hour, dayIndex) => {
        const slot = schedule.find(s => s.hour === hour)?.slots[dayIndex];
        if (slot?.available && !slot.doctor) {
            setSelectedSlot({ hour, dayIndex });
            setIsModalOpen(true);
        }
    };

    const handleDoctorSelect = (doctor) => {
        setSchedule(prev => prev.map(timeSlot => {
            if (timeSlot.hour === selectedSlot.hour) {
                const newSlots = [...timeSlot.slots];
                newSlots[selectedSlot.dayIndex] = {
                    ...newSlots[selectedSlot.dayIndex],
                    doctor
                };
                return { ...timeSlot, slots: newSlots };
            }
            return timeSlot;
        }));
        setIsModalOpen(false);
    };

    const renderWeekDays = () => {
        return DAYS.map((day, index) => {
            const date = addDays(selectedWeek, index);
            return (
                <th key={day} className="text-center p-3 bg-primary text-white">
                    <div className="font-bold">{day}</div>
                    <div className="text-sm">{format(date, 'MMM d')}</div>
                </th>
            );
        });
    };

    if (loading) {
        return <div className="flex justify-center items-center h-96">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    return (
        <div className="schedule-container">
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <h2 className="text-2xl font-bold">Vaccination Schedule</h2>
                <div className="week-selector">
                    <button 
                        className="btn btn-outline-primary me-2"
                        onClick={() => setSelectedWeek(prev => addDays(prev, -7))}
                    >
                        Previous Week
                    </button>
                    <span className="mx-3 font-semibold">
                        {format(selectedWeek, 'MMM d')} - {format(addDays(selectedWeek, 6), 'MMM d, yyyy')}
                    </span>
                    <button 
                        className="btn btn-outline-primary ms-2"
                        onClick={() => setSelectedWeek(prev => addDays(prev, 7))}
                    >
                        Next Week
                    </button>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th className="text-center bg-light">Time</th>
                            {renderWeekDays()}
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map(({ hour, slots }) => (
                            <tr key={hour}>
                                <td className="text-center bg-light font-semibold">
                                    {hour}
                                </td>
                                {slots.map((slot, dayIndex) => (
                                    <td
                                        key={dayIndex}
                                        className={`text-center cursor-pointer transition-all ${
                                            slot.available 
                                                ? slot.doctor 
                                                    ? 'bg-success bg-opacity-25'
                                                    : 'bg-white hover:bg-gray-100'
                                                : 'bg-gray-200'
                                        }`}
                                        onClick={() => handleSlotClick(hour, dayIndex)}
                                    >
                                        {slot.doctor ? (
                                            <div className="p-2">
                                                <div className="font-semibold">{slot.doctor.name}</div>
                                                <div className="text-sm text-muted">{slot.doctor.specialty}</div>
                                            </div>
                                        ) : slot.available ? (
                                            <div className="p-2 text-primary">Available</div>
                                        ) : (
                                            <div className="p-2 text-muted">Unavailable</div>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <DoctorSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onDoctorSelect={handleDoctorSelect}
                doctors={DOCTORS}
            />
        </div>
    );
}

function DoctorSelectionModal({ isOpen, onClose, onDoctorSelect, doctors }) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="modal-content p-4 rounded-lg shadow-lg"
            overlayClassName="modal-overlay"
            ariaHideApp={false}
        >
            <div className="modal-header d-flex justify-content-between align-items-center mb-4">
                <h3 className="modal-title">Select Doctor</h3>
                <button className="btn btn-close" onClick={onClose}></button>
            </div>
            <div className="doctor-grid">
                {doctors.map(doctor => (
                    <div
                        key={doctor.id}
                        className="doctor-card p-3 border rounded cursor-pointer hover:bg-gray-50"
                        onClick={() => onDoctorSelect(doctor)}
                    >
                        <h4 className="font-semibold">{doctor.name}</h4>
                        <p className="text-sm text-muted">{doctor.specialty}</p>
                    </div>
                ))}
            </div>
        </Modal>
    );
}