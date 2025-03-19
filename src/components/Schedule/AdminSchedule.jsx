import React, { useState, useEffect } from "react";
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import api from "../api/axios";
import "./Schedule.css";

export default function AdminSchedule() {
    const [selectedWeek, setSelectedWeek] = useState(startOfWeek(new Date()));
    const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
    const [viewMode, setViewMode] = useState("week");
    const [weekSlots, setWeekSlots] = useState([]);
    const [monthSlots, setMonthSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [vaccineCenterId] = useState("string"); // Replace with real ID

    const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const HOURS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];
    const DOCTORS = [
        { id: 1, name: "Dr. Smith", specialty: "Pediatrics" },
        { id: 2, name: "Dr. Jones", specialty: "General" },
        { id: 3, name: "Dr. Lee", specialty: "Immunology" },
    ];

    useEffect(() => {
        const fetchSchedules = async () => {
        setLoading(true);
        try {
            const response = await api.get("/api/VaccinationSchedule");
            const allSchedules = response.data;
            updateSlots(allSchedules);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.Message || "Failed to load schedules");
            setLoading(false);
        }
        };
        fetchSchedules();
    }, [selectedWeek, selectedMonth, vaccineCenterId]);

    const updateSlots = (allSchedules) => {
        const weekStart = selectedWeek;
        const weekData = HOURS.map(hour => ({
        hour,
        days: DAYS.map((_, dayIndex) => {
            const slotDate = addDays(weekStart, dayIndex);
            const slotTime = `${format(slotDate, "yyyy-MM-dd")}T${hour}:00`;
            const schedule = allSchedules.find(s => 
            s.appointmentDate === slotTime && 
            s.vaccineCenterId === vaccineCenterId
            ) || {
            id: null,
            appointmentDate: slotTime,
            status: 0,
            administeredBy: null,
            };
            return {
            id: schedule.id,
            available: schedule.status === 0,
            booked: schedule.status === 1,
            doctor: schedule.administeredBy
                ? DOCTORS.find(d => d.name === schedule.administeredBy) || { name: schedule.administeredBy }
                : null,
            };
        }),
        }));
        setWeekSlots(weekData);

        const monthDays = eachDayOfInterval({
        start: startOfMonth(selectedMonth),
        end: endOfMonth(selectedMonth),
        });
        const monthData = monthDays.map(date => {
        const daySchedules = allSchedules.filter(s =>
            new Date(s.appointmentDate).toDateString() === date.toDateString() &&
            s.vaccineCenterId === vaccineCenterId
        );
        return {
            date,
            available: daySchedules.some(s => s.status === 0),
            bookedCount: daySchedules.filter(s => s.status === 1).length,
        };
        });
        setMonthSlots(monthData);
    };

    const handleDoctorAssign = async (dayIndex, hour, doctorName) => {
        const slot = weekSlots.find(s => s.hour === hour).days[dayIndex];
        if (!slot.id) return; // No schedule exists; client must create it first

        const slotDate = addDays(selectedWeek, dayIndex);
        const appointmentDate = `${format(slotDate, "yyyy-MM-dd")}T${hour}:00`;

        try {
        await api.put(`/api/VaccinationSchedule?scheduleId=${slot.id}`, {
            doseNumber: 1, // Assuming this stays constant; adjust if needed
            appointmentDate,
            actualDate: null,
            administeredBy: doctorName || null,
            status: slot.booked ? 1 : 0, // Keep booked status, else available
        });
        const response = await api.get("/api/VaccinationSchedule");
        updateSlots(response.data);
        } catch (err) {
        alert(err.response?.data?.Message || "Failed to assign doctor");
        }
    };

    const handleToggleAvailability = async (dayIndex, hour) => {
        const slot = weekSlots.find(s => s.hour === hour).days[dayIndex];
        if (!slot.id) return; // No schedule exists; client must create it first

        const newStatus = slot.available ? 2 : 0;
        const slotDate = addDays(selectedWeek, dayIndex);
        const appointmentDate = `${format(slotDate, "yyyy-MM-dd")}T${hour}:00`;

        try {
        await api.put(`/api/VaccinationSchedule?scheduleId=${slot.id}`, {
            doseNumber: 1,
            appointmentDate,
            actualDate: null,
            administeredBy: newStatus === 0 ? slot.doctor?.name : null,
            status: newStatus,
        });
        const response = await api.get("/api/VaccinationSchedule");
        updateSlots(response.data);
        } catch (err) {
        alert(err.response?.data?.Message || "Failed to update availability");
        }
    };

    const handleDaySelect = (date) => {
        setSelectedWeek(startOfWeek(date));
        setViewMode("week");
    };

    const renderWeekTable = () => {
        return (
        <table className="table table-striped">
            <thead className="table-primary">
            <tr>
                <th>Time</th>
                {DAYS.map((day, index) => {
                const date = addDays(selectedWeek, index);
                return (
                    <th key={day} className="text-center">
                    {day}
                    <br />
                    <small>{format(date, "MMM d")}</small>
                    </th>
                );
                })}
            </tr>
            </thead>
            <tbody>
            {weekSlots.map(({ hour, days }) => (
                <tr key={hour}>
                <td className="align-middle text-center">{hour}</td>
                {days.map((slot, dayIndex) => (
                    <td key={dayIndex} className="align-middle text-center">
                    {slot.booked ? (
                        <div>
                        <span className="badge bg-danger">Booked</span>
                        <div className="mt-1">
                            <select
                            className="form-select form-select-sm"
                            value={slot.doctor?.name || ""}
                            onChange={e => handleDoctorAssign(dayIndex, hour, e.target.value || null)}
                            >
                            <option value="">No Doctor</option>
                            {DOCTORS.map(d => (
                                <option key={d.id} value={d.name}>
                                {d.name}
                                </option>
                            ))}
                            </select>
                        </div>
                        </div>
                    ) : slot.id ? (
                        <div>
                        <span
                            className={`badge ${
                            slot.available ? "bg-warning" : "bg-secondary"
                            }`}
                        >
                            {slot.doctor ? slot.doctor.name : slot.available ? "Open" : "Closed"}
                        </span>
                        <div className="mt-1">
                            <select
                            className="form-select form-select-sm"
                            value={slot.doctor?.name || ""}
                            onChange={e => handleDoctorAssign(dayIndex, hour, e.target.value || null)}
                            >
                            <option value="">No Doctor</option>
                            {DOCTORS.map(d => (
                                <option key={d.id} value={d.name}>
                                {d.name}
                                </option>
                            ))}
                            </select>
                            <button
                            className={`btn btn-sm mt-1 ${
                                slot.available ? "btn-outline-danger" : "btn-outline-success"
                            }`}
                            onClick={() => handleToggleAvailability(dayIndex, hour)}
                            >
                            {slot.available ? "Close" : "Open"}
                            </button>
                        </div>
                        </div>
                    ) : (
                        <span className="badge bg-gray-200 text-gray-500">Not Scheduled</span>
                    )}
                    </td>
                ))}
                </tr>
            ))}
            </tbody>
        </table>
        );
    };

    const renderMonthDays = () => {
        const daysInMonth = eachDayOfInterval({
        start: startOfMonth(selectedMonth),
        end: endOfMonth(selectedMonth),
        });
        const firstDayOfMonth = startOfWeek(startOfMonth(selectedMonth));
        const calendarDays = eachDayOfInterval({
        start: firstDayOfMonth,
        end: addDays(firstDayOfMonth, 41),
        });

        return (
        <div className="month-grid grid grid-cols-7 gap-1">
            {DAYS.map(day => (
            <div key={day} className="day-header text-center p-2 bg-blue-100 rounded">
                {day}
            </div>
            ))}
            {calendarDays.map(date => {
            const isCurrentMonth = date.getMonth() === selectedMonth.getMonth();
            const dayData = monthSlots.find(d => d.date.toDateString() === date.toDateString());
            return (
                <button
                key={date.toString()}
                className={`month-day p-2 rounded text-center ${
                    isCurrentMonth
                    ? dayData?.available || dayData?.bookedCount > 0
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-50 text-gray-400 cursor-default"
                }`}
                onClick={() => isCurrentMonth && (dayData?.available || dayData?.bookedCount > 0) && handleDaySelect(date)}
                disabled={!isCurrentMonth || (!dayData?.available && dayData?.bookedCount === 0)}
                >
                <div>{format(date, "d")}</div>
                {isCurrentMonth && dayData?.bookedCount > 0 && (
                    <span className="text-xs text-red-600">{dayData.bookedCount} booked</span>
                )}
                </button>
            );
            })}
        </div>
        );
    };

    if (loading) return <div className="text-center py-5">Loading...</div>;
    if (error) return <div className="alert alert-danger text-center">{error}</div>;

    return (
        <div className="admin-schedule-page container py-2">
        <div className="card shadow-lg">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5>Manage Vaccination Schedules</h5>
            <div className="controls flex items-center gap-4">
                <div className="view-toggle">
                <button
                    className={`px-3 py-1 rounded-l ${viewMode === "week" ? "bg-light text-primary" : "bg-gray-200 text-gray-700"}`}
                    onClick={() => setViewMode("week")}
                >
                    Week
                </button>
                <button
                    className={`px-3 py-1 rounded-r ${viewMode === "month" ? "bg-light text-primary" : "bg-gray-200 text-gray-700"}`}
                    onClick={() => setViewMode("month")}
                >
                    Month
                </button>
                </div>
                {viewMode === "week" ? (
                <div className="week-nav flex items-center gap-2">
                    <button
                    className="btn btn-light btn-sm"
                    onClick={() => setSelectedWeek(prev => addDays(prev, -7))}
                    >
                    Previous
                    </button>
                    <span className="text-semibold">
                    {format(selectedWeek, "MMM d")} - {format(addDays(selectedWeek, 6), "MMM d, yyyy")}
                    </span>
                    <button
                    className="btn btn-light btn-sm"
                    onClick={() => setSelectedWeek(prev => addDays(prev, 7))}
                    >
                    Next
                    </button>
                </div>
                ) : (
                <div className="month-nav flex items-center gap-2">
                    <button
                    className="btn btn-light btn-sm"
                    onClick={() => setSelectedMonth(prev => addDays(prev, -31))}
                    >
                    Previous
                    </button>
                    <span className="text-semibold">
                    {format(selectedMonth, "MMMM yyyy")}
                    </span>
                    <button
                    className="btn btn-light btn-sm"
                    onClick={() => setSelectedMonth(prev => addDays(prev, 31))}
                    >
                    Next
                    </button>
                </div>
                )}
            </div>
            </div>
            <div className="card-body">
            {viewMode === "week" ? renderWeekTable() : renderMonthDays()}
            </div>
        </div>
        </div>
    );
}