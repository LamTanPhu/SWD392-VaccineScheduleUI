import { addDays, eachDayOfInterval, endOfMonth, format, isBefore, isEqual, startOfMonth, startOfWeek } from "date-fns";
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "./Schedule.css";

export default function ClientSchedule() {
    const [selectedWeek, setSelectedWeek] = useState(startOfWeek(new Date()));
    const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [viewMode, setViewMode] = useState("week");
    const [schedules, setSchedules] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [orders, setOrders] = useState([]);
    const [formData, setFormData] = useState({ profileId: "", orderDetailId: "", type: "vaccine" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [vaccineCenterId] = useState("replace-with-real-id"); // Replace with actual ID
    const today = new Date();

    const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const HOURS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [scheduleResponse, profileResponse, orderResponse] = await Promise.all([
                    api.get("/api/VaccinationSchedule"), // Fetch all schedules
                    api.get("/api/ChildrenProfile/my-children"), // Fetch client’s children
                    api.get("/api/Order?status=Paid"), // Fetch paid orders
                ]);
                const filteredSchedules = scheduleResponse.data.filter(s => s.vaccineCenterId === vaccineCenterId);
                setSchedules(filteredSchedules);
                setProfiles(profileResponse.data);
                setOrders(orderResponse.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load data");
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedWeek, selectedMonth, vaccineCenterId]);

    const getWeekSlots = () => {
        const weekStart = selectedWeek;
        return HOURS.map(hour => ({
            hour,
            days: DAYS.map((_, dayIndex) => {
                const slotDate = addDays(weekStart, dayIndex);
                const slotTime = `${format(slotDate, "yyyy-MM-dd")}T${hour}:00`;
                const schedule = schedules.find(s => 
                    new Date(s.appointmentDate).toISOString().startsWith(slotTime)
                );
                const isPast = isBefore(slotDate, today) && !isEqual(slotDate, today); // Past if before today
                return {
                    available: !isPast && (!schedule || schedule.status === 0), // Available if not booked or past
                    booked: schedule && schedule.status === 1,
                    isPast,
                };
            }),
        }));
    };

    const getMonthSlots = () => {
        const daysInMonth = eachDayOfInterval({
            start: startOfMonth(selectedMonth),
            end: endOfMonth(selectedMonth),
        });
        return daysInMonth.map(date => {
            const daySchedules = schedules.filter(s =>
                new Date(s.appointmentDate).toDateString() === date.toDateString()
            );
            const isPast = isBefore(date, today) && !isEqual(date, today);
            return {
                date,
                available: !isPast && !daySchedules.some(s => s.status === 1), // Available if no bookings
                bookedCount: daySchedules.filter(s => s.status === 1).length,
                isPast,
            };
        });
    };

    const handleSlotSelect = (dayIndex, hour) => {
        const weekSlots = getWeekSlots();
        const slot = weekSlots.find(s => s.hour === hour).days[dayIndex];
        if (slot.available && !isConfirmed) {
            setSelectedSlot({ dayIndex, hour });
            setIsFormOpen(true);
        }
    };

    const handleDaySelect = (date) => {
        setSelectedWeek(startOfWeek(date));
        setViewMode("week");
        setSelectedSlot(null);
        setIsFormOpen(false);
        setIsConfirmed(false);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSlot || !formData.profileId || !formData.orderDetailId) return;

        const slotDate = addDays(selectedWeek, selectedSlot.dayIndex);
        const appointmentDate = `${format(slotDate, "yyyy-MM-dd")}T${selectedSlot.hour}:00`;

        try {
            const request = {
                profileId: formData.profileId,
                vaccineCenterId,
                orderVaccineDetailsId: formData.type === "vaccine" ? formData.orderDetailId : null,
                orderPackageDetailsId: formData.type === "package" ? formData.orderDetailId : null,
                appointmentDate,
                status: 1, // Booked
            };
            const response = await api.post("/api/VaccinationSchedule", request);
            setSchedules(prev => [...prev, response.data]);
            setIsFormOpen(false);
            setIsConfirmed(true);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to book schedule");
        }
    };

    const handleReset = () => {
        setSelectedSlot(null);
        setIsFormOpen(false);
        setIsConfirmed(false);
        setFormData({ profileId: "", orderDetailId: "", type: "vaccine" });
    };

    // Rendering functions remain largely the same, adjusted for clarity
    const renderWeekDays = () => {
        return DAYS.map((day, index) => {
            const date = addDays(selectedWeek, index);
            return (
                <div key={day} className="day-header text-center p-2 bg-blue-100 rounded">
                    <div className="font-semibold">{day}</div>
                    <div className="text-sm text-gray-600">{format(date, "MMM d")}</div>
                </div>
            );
        });
    };

    const renderWeekSlots = () => {
        const weekSlots = getWeekSlots();
        return weekSlots.map(({ hour, days }) => (
            <div key={hour} className="slot-row flex items-center mb-2">
                <div className="time-label w-20 text-center font-semibold text-gray-700">{hour}</div>
                <div className="slots-grid flex-1 grid grid-cols-7 gap-2">
                    {days.map((slot, dayIndex) => (
                        <button
                            key={dayIndex}
                            className={`slot-card p-2 rounded text-center transition-colors ${
                                slot.isPast
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    : slot.available
                                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                                    : "bg-red-100 text-red-800 cursor-not-allowed"
                            }`}
                            onClick={() => handleSlotSelect(dayIndex, hour)}
                            disabled={slot.isPast || !slot.available || isConfirmed}
                        >
                            {slot.isPast ? "Past" : slot.available ? "Available" : "Booked"}
                        </button>
                    ))}
                </div>
            </div>
        ));
    };

    const renderMonthDays = () => {
        const daysInMonth = eachDayOfInterval({ start: startOfMonth(selectedMonth), end: endOfMonth(selectedMonth) });
        const firstDayOfMonth = startOfWeek(startOfMonth(selectedMonth));
        const calendarDays = eachDayOfInterval({ start: firstDayOfMonth, end: addDays(firstDayOfMonth, 41) });
        const monthSlots = getMonthSlots();

        return (
            <div className="month-grid grid grid-cols-7 gap-1">
                {DAYS.map(day => (
                    <div key={day} className="day-header text-center p-2 bg-blue-100 rounded">{day}</div>
                ))}
                {calendarDays.map(date => {
                    const isCurrentMonth = date.getMonth() === selectedMonth.getMonth();
                    const availability = monthSlots.find(d => d.date.toDateString() === date.toDateString());
                    return (
                        <button
                            key={date.toString()}
                            className={`month-day p-2 rounded text-center ${
                                !isCurrentMonth
                                    ? "bg-gray-50 text-gray-400 cursor-default"
                                    : availability?.isPast
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    : availability?.available
                                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                                    : "bg-red-100 text-red-800 cursor-not-allowed"
                            }`}
                            onClick={() => isCurrentMonth && !availability?.isPast && availability?.available && handleDaySelect(date)}
                            disabled={!isCurrentMonth || availability?.isPast || !availability?.available}
                        >
                            {format(date, "d")}
                            {availability?.bookedCount > 0 && (
                                <div className="text-xs text-red-600">{availability.bookedCount} booked</div>
                            )}
                        </button>
                    );
                })}
            </div>
        );
    };

    const renderForm = () => (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Book Vaccination</h2>
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Child</label>
                        <select
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            value={formData.profileId}
                            onChange={e => setFormData({ ...formData, profileId: e.target.value })}
                            required
                        >
                            <option value="">Select Child</option>
                            {profiles.map(p => (
                                <option key={p.id} value={p.id}>{p.fullName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vaccine/Package</label>
                        <div className="flex gap-3">
                            <select
                                className="w-1/2 p-3 border border-gray-300 rounded-lg"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value, orderDetailId: "" })}
                            >
                                <option value="vaccine">Vaccine</option>
                                <option value="package">Package</option>
                            </select>
                            <select
                                className="w-1/2 p-3 border border-gray-300 rounded-lg"
                                value={formData.orderDetailId}
                                onChange={e => setFormData({ ...formData, orderDetailId: e.target.value })}
                                required
                            >
                                <option value="">Select {formData.type === "vaccine" ? "Vaccine" : "Package"}</option>
                                {orders.flatMap(o =>
                                    formData.type === "vaccine"
                                        ? (o.vaccineDetails || []).map(d => (
                                              <option key={d.orderVaccineId} value={d.orderVaccineId}>
                                                  {d.vaccineName}
                                              </option>
                                          ))
                                        : (o.packageDetails || []).map(d => (
                                              <option key={d.orderPackageId} value={d.orderPackageId}>
                                                  {d.vaccinePackageName}
                                              </option>
                                          ))
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button type="button" className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg" onClick={() => setIsFormOpen(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="px-5 py-2 bg-green-600 text-white rounded-lg">
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    if (loading) return <div className="text-center py-5">Loading...</div>;
    if (error) return <div className="alert alert-danger text-center">{error}</div>;

    return (
        <div className="client-schedule-container max-w-5xl mx-auto p-4">
            <div className="header flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Schedule Your Vaccination</h1>
                <div className="controls flex items-center gap-4">
                    <div className="view-toggle">
                        <button
                            className={`px-3 py-1 rounded-l ${viewMode === "week" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                            onClick={() => setViewMode("week")}
                        >
                            Week
                        </button>
                        <button
                            className={`px-3 py-1 rounded-r ${viewMode === "month" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                            onClick={() => setViewMode("month")}
                        >
                            Month
                        </button>
                    </div>
                    {viewMode === "week" ? (
                        <div className="week-nav flex items-center gap-4">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                                onClick={() => {
                                    setSelectedWeek(prev => addDays(prev, -7));
                                    setSelectedSlot(null);
                                    setIsFormOpen(false);
                                    setIsConfirmed(false);
                                }}
                            >
                                Previous
                            </button>
                            <span className="text-lg font-semibold text-gray-700">
                                {format(selectedWeek, "MMM d")} - {format(addDays(selectedWeek, 6), "MMM d, yyyy")}
                            </span>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                                onClick={() => {
                                    setSelectedWeek(prev => addDays(prev, 7));
                                    setSelectedSlot(null);
                                    setIsFormOpen(false);
                                    setIsConfirmed(false);
                                }}
                            >
                                Next
                            </button>
                        </div>
                    ) : (
                        <div className="month-nav flex items-center gap-4">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                                onClick={() => {
                                    setSelectedMonth(prev => addDays(prev, -31));
                                    setSelectedSlot(null);
                                    setIsFormOpen(false);
                                    setIsConfirmed(false);
                                }}
                            >
                                Previous
                            </button>
                            <span className="text-lg font-semibold text-gray-700">{format(selectedMonth, "MMMM yyyy")}</span>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                                onClick={() => {
                                    setSelectedMonth(prev => addDays(prev, 31));
                                    setSelectedSlot(null);
                                    setIsFormOpen(false);
                                    setIsConfirmed(false);
                                }}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {viewMode === "week" ? (
                <>
                    <div className="days-grid grid grid-cols-8 gap-2 mb-4">
                        <div className="time-header w-20"></div>
                        {renderWeekDays()}
                    </div>
                    <div className="slots-container">{renderWeekSlots()}</div>
                    {isConfirmed && (
                        <div className="success-message mt-6 p-4 bg-green-100 rounded-lg text-center">
                            <h2 className="text-xl font-semibold text-green-800">Booking Confirmed!</h2>
                            <p className="text-gray-700">
                                Your vaccination is scheduled for {DAYS[selectedSlot.dayIndex]}{" "}
                                {format(addDays(selectedWeek, selectedSlot.dayIndex), "MMM d")} at {selectedSlot.hour}.
                            </p>
                            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleReset}>
                                Book Another
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="month-container">{renderMonthDays()}</div>
            )}
            {isFormOpen && renderForm()}
        </div>
    );
}