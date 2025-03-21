import React, { useState, useEffect, useMemo } from "react";
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, isEqual, parse } from "date-fns";
import api from "../api/axios";
import { jwtDecode } from 'jwt-decode';
import "./Schedule.css";

export default function ClientSchedule() {
    const [selectedWeek, setSelectedWeek] = useState(startOfWeek(new Date("2025-03-21"), { weekStartsOn: 1 }));
    const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedCenter, setSelectedCenter] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [viewMode, setViewMode] = useState("week");
    const [schedules, setSchedules] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [orders, setOrders] = useState([]);
    const [centers, setCenters] = useState([]);
    const [packageVaccines, setPackageVaccines] = useState({});
    const [formData, setFormData] = useState({ 
        profileId: "", 
        orderDetailId: "", 
        type: "vaccine", 
        vaccineId: "" 
    });
    const [updateFormData, setUpdateFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showBookAnotherChild, setShowBookAnotherChild] = useState(false);
    const [bookAnotherFormData, setBookAnotherFormData] = useState({
        profileId: "",
        orderDetailId: "",
        type: "vaccine",
        vaccineId: "",
    });
    const today = new Date();

    const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const HOURS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                if (!token) throw new Error('User not logged in');
                const decodedToken = jwtDecode(token);
                const parentId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
                if (!parentId) throw new Error('Parent ID not found in token');
                console.log(`Fetching data for parentId: ${parentId}`);

                const [scheduleResponse, profileResponse, orderResponse, centerResponse] = await Promise.all([
                    api.get("/api/VaccinationSchedule"),
                    api.get("/api/ChildrenProfile/my-children"),
                    api.get(`/api/Order/paid-by-parent/${parentId}`),
                    api.get("/api/VaccineCenters"),
                ]);
                console.log("Initial Schedules:", scheduleResponse.data);
                setSchedules(scheduleResponse.data);
                setProfiles(profileResponse.data);
                console.log("Profiles fetched:", profileResponse.data);
                setOrders(orderResponse.data);
                setCenters(centerResponse.data);
                if (centerResponse.data.length > 0 && !selectedCenter) {
                    setSelectedCenter(centerResponse.data[0].id);
                    console.log("Set initial selectedCenter:", centerResponse.data[0].id);
                }

                const packageIds = orderResponse.data.flatMap(o => o.packageDetails.map(pd => pd.vaccinePackageId));
                const uniquePackageIds = [...new Set(packageIds)];
                const packageVaccineData = {};
                for (const pkgId of uniquePackageIds) {
                    const pkgResponse = await api.get(`/api/VaccinePackage/${pkgId}`);
                    packageVaccineData[pkgId] = pkgResponse.data.vaccines.map(v => ({
                        vaccineId: v.id,
                        vaccineName: v.name
                    }));
                }
                console.log("Package Vaccines:", packageVaccineData);
                setPackageVaccines(packageVaccineData);

                setLoading(false);
            } catch (err) {
                console.error("Fetch Error:", err.response?.status, err.response?.data || err.message);
                setError(err.response?.data?.Message || err.message || "Failed to load data");
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedCenter]);

    const getWeekSlots = useMemo(() => {
        if (!selectedCenter || profiles.length === 0) return [];
        console.log("getWeekSlots - selectedCenter:", selectedCenter);
        console.log("getWeekSlots - schedules:", schedules);

        const userProfileIds = profiles.map(p => p.id);

        const weekStart = selectedWeek;
        return HOURS.map(hour => ({
            hour,
            days: DAYS.map((_, dayIndex) => {
                const slotDate = addDays(weekStart, dayIndex);
                const slotTime = `${format(slotDate, "yyyy-MM-dd")}T${hour}:00`;

                const slotSchedules = schedules.filter(s => {
                    const appointmentTime = s.appointmentDate;
                    const matchesTime = appointmentTime === slotTime;
                    const matchesCenter = s.vaccineCenterId === selectedCenter;
                    const isActive = s.status !== 0;
                    return matchesTime && matchesCenter && isActive;
                });

                const userSchedules = slotSchedules.filter(s => userProfileIds.includes(s.profileId));
                const isBookedByUser = userSchedules.length > 0;

                const isPast = isBefore(slotDate, today) && !isEqual(slotDate, today);
                return {
                    available: !isPast && !isBookedByUser,
                    booked: isBookedByUser,
                    isPast,
                    schedules: userSchedules,
                };
            }),
        }));
    }, [selectedCenter, selectedWeek, schedules, profiles]);

    const getAvailableSlotsForUpdate = () => {
        const availableSlots = [];
        getWeekSlots.forEach(({ hour, days }) => {
            days.forEach((slot, dayIndex) => {
                if (!slot.isPast && !slot.booked) {
                    const slotDate = addDays(selectedWeek, dayIndex);
                    const slotTime = `${format(slotDate, "yyyy-MM-dd")}T${hour}:00`;
                    availableSlots.push({
                        value: slotTime,
                        label: `${DAYS[dayIndex]} ${format(slotDate, "MMM d")} at ${hour}`,
                    });
                }
            });
        });
        return availableSlots;
    };

    const getMonthSlots = () => {
        if (!selectedCenter) return [];
        const daysInMonth = eachDayOfInterval({
            start: startOfMonth(selectedMonth),
            end: endOfMonth(selectedMonth),
        });
        return daysInMonth.map(date => {
            const daySchedules = schedules.filter(s =>
                new Date(s.appointmentDate).toDateString() === date.toDateString() &&
                s.vaccineCenterId === selectedCenter
            );
            const isPast = isBefore(date, today) && !isEqual(date, today);
            return {
                date,
                available: !isPast && !daySchedules.some(s => s.status === 1),
                bookedCount: daySchedules.filter(s => s.status === 1).length,
                isPast,
            };
        });
    };

    const isDoseBooked = (profileId, orderDetailId, doseNumber) => {
        return schedules.some(s => 
            s.profileId === profileId &&
            (s.orderVaccineDetailsId === orderDetailId || s.orderPackageDetailsId === orderDetailId) &&
            s.doseNumber === doseNumber &&
            s.status !== 0
        );
    };

    const handleSlotSelect = (dayIndex, hour) => {
        const slot = getWeekSlots.find(s => s.hour === hour).days[dayIndex];
        if (slot.isPast || isConfirmed) return;

        setSelectedSlot({ dayIndex, hour });
        if (slot.available) {
            setIsFormOpen(true);
            setIsUpdateFormOpen(false);
        } else if (slot.booked) {
            const schedule = slot.schedules[0];
            setUpdateFormData({
                id: schedule.id,
                profileId: schedule.profileId,
                orderDetailId: schedule.orderVaccineDetailsId || schedule.orderPackageDetailsId,
                type: schedule.orderVaccineDetailsId ? "vaccine" : "package",
                vaccineId: schedule.vaccineId,
                appointmentDate: schedule.appointmentDate,
            });
            setIsUpdateFormOpen(true);
            setIsFormOpen(false);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSlot || !formData.profileId || !formData.orderDetailId) return;

        const slotDate = addDays(selectedWeek, selectedSlot.dayIndex);
        const appointmentDate = `${format(slotDate, "yyyy-MM-dd")}T${selectedSlot.hour}:00`;
        const orderDetail = orders
            .flatMap(o => [...o.vaccineDetails, ...o.packageDetails])
            .find(d => (d.orderVaccineId || d.orderPackageId) === formData.orderDetailId);
        const isPackage = formData.type === "package";
        const existingSchedules = schedules.filter(s => 
            s.profileId === formData.profileId &&
            (s.orderVaccineDetailsId === (isPackage ? null : formData.orderDetailId) ||
             s.orderPackageDetailsId === (isPackage ? formData.orderDetailId : null)) &&
            s.status !== 0
        );
        const doseNumber = isPackage ? (existingSchedules.length + 1) : 1;

        if (isDoseBooked(formData.profileId, formData.orderDetailId, doseNumber)) {
            alert(`Schedule already exists for this child for Dose ${doseNumber}. Please select a different vaccine/package or cancel the existing booking.`);
            return;
        }

        try {
            const request = {
                id: crypto.randomUUID(),
                profileId: formData.profileId,
                vaccineCenterId: selectedCenter,
                orderVaccineDetailsId: !isPackage ? formData.orderDetailId : null,
                orderPackageDetailsId: isPackage ? formData.orderDetailId : null,
                vaccineId: isPackage ? formData.vaccineId : orderDetail.vaccineId,
                doseNumber,
                appointmentDate,
                actualDate: null,
                administeredBy: null,
                status: 1,
            };
            console.log("Booking Request:", request);
            const response = await api.post("/api/VaccinationSchedule", request);
            console.log("Booking Response:", response.data);
            setSchedules(prev => {
                const newSchedules = [...prev, response.data];
                console.log("Updated Schedules:", newSchedules);
                return newSchedules;
            });
            setIsFormOpen(false);
            setIsConfirmed(true);
        } catch (err) {
            console.error("Booking Error:", err.response?.status, err.response?.data || err.message);
            alert(err.response?.data?.Message || "Failed to book schedule");
        }
    };

    const handleBookAnotherChildSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSlot || !bookAnotherFormData.profileId || !bookAnotherFormData.orderDetailId) return;

        const slotDate = addDays(selectedWeek, selectedSlot.dayIndex);
        const appointmentDate = `${format(slotDate, "yyyy-MM-dd")}T${selectedSlot.hour}:00`;

        if (bookAnotherFormData.profileId === updateFormData.profileId) {
            alert("Please select a different child to book in this slot.");
            return;
        }

        const orderDetail = orders
            .flatMap(o => [...o.vaccineDetails, ...o.packageDetails])
            .find(d => (d.orderVaccineId || d.orderPackageId) === bookAnotherFormData.orderDetailId);
        const isPackage = bookAnotherFormData.type === "package";
        const existingSchedules = schedules.filter(s => 
            s.profileId === bookAnotherFormData.profileId &&
            (s.orderVaccineDetailsId === (isPackage ? null : bookAnotherFormData.orderDetailId) ||
             s.orderPackageDetailsId === (isPackage ? bookAnotherFormData.orderDetailId : null)) &&
            s.status !== 0
        );
        const doseNumber = isPackage ? (existingSchedules.length + 1) : 1;

        if (isDoseBooked(bookAnotherFormData.profileId, bookAnotherFormData.orderDetailId, doseNumber)) {
            alert(`Schedule already exists for this child for Dose ${doseNumber}. Please select a different vaccine/package or cancel the existing booking.`);
            return;
        }

        try {
            const request = {
                id: crypto.randomUUID(),
                profileId: bookAnotherFormData.profileId,
                vaccineCenterId: selectedCenter,
                orderVaccineDetailsId: !isPackage ? bookAnotherFormData.orderDetailId : null,
                orderPackageDetailsId: isPackage ? bookAnotherFormData.orderDetailId : null,
                vaccineId: isPackage ? bookAnotherFormData.vaccineId : orderDetail.vaccineId,
                doseNumber,
                appointmentDate,
                actualDate: null,
                administeredBy: null,
                status: 1,
            };
            console.log("Book Another Child Request:", request);
            const response = await api.post("/api/VaccinationSchedule", request);
            console.log("Book Another Child Response:", response.data);
            setSchedules(prev => {
                const newSchedules = [...prev, response.data];
                console.log("Updated Schedules:", newSchedules);
                return newSchedules;
            });
            setShowBookAnotherChild(false);
            setBookAnotherFormData({ profileId: "", orderDetailId: "", type: "vaccine", vaccineId: "" });
            alert("Successfully booked for another child!");
        } catch (err) {
            console.error("Book Another Child Error:", err.response?.status, err.response?.data || err.message);
            alert(err.response?.data?.Message || "Failed to book schedule for another child");
        }
    };

    const handleUpdateFormSubmit = async (e) => {
        e.preventDefault();
        if (!updateFormData) return;

        if (!updateFormData.appointmentDate) {
            alert("Please select a new appointment date and time.");
            return;
        }

        try {
            const updatedSchedule = {
                DoseNumber: schedules.find(s => s.id === updateFormData.id)?.doseNumber || 1,
                AppointmentDate: updateFormData.appointmentDate,
                ActualDate: schedules.find(s => s.id === updateFormData.id)?.actualDate || null,
                AdministeredBy: schedules.find(s => s.id === updateFormData.id)?.administeredBy || null,
                Status: schedules.find(s => s.id === updateFormData.id)?.status || 1,
            };

            console.log("Update Request:", updatedSchedule);

            const response = await api.put(`/api/VaccinationSchedule?scheduleId=${updateFormData.id}`, updatedSchedule);
            console.log("Update Response:", response.status);

            setSchedules(prev =>
                prev.map(s =>
                    s.id === updateFormData.id
                        ? { ...s, appointmentDate: updateFormData.appointmentDate }
                        : s
                )
            );
            alert("Schedule updated successfully!");
            setIsUpdateFormOpen(false);
            setUpdateFormData(null);
            setSelectedSlot(null);
        } catch (err) {
            console.error("Update Error:", err.response?.status, err.response?.data || err.message);
            alert(err.response?.data?.Message || "Failed to update schedule");
        }
    };

    const handleReset = () => {
        setSelectedSlot(null);
        setIsFormOpen(false);
        setIsUpdateFormOpen(false);
        setIsConfirmed(false);
        setFormData({ profileId: "", orderDetailId: "", type: "vaccine", vaccineId: "" });
        setUpdateFormData(null);
        setShowBookAnotherChild(false);
        setBookAnotherFormData({ profileId: "", orderDetailId: "", type: "vaccine", vaccineId: "" });
    };

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
        console.log("Rendering with selectedWeek:", format(selectedWeek, "yyyy-MM-dd"));
        const weekSlots = getWeekSlots;
        console.log("Rendered Week Slots:", weekSlots);
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
                                    : slot.booked
                                    ? "slot-booked"
                                    : "bg-green-100 text-green-800 hover:bg-green-200"
                            }`}
                            onClick={() => handleSlotSelect(dayIndex, hour)}
                            disabled={slot.isPast || isConfirmed}
                        >
                            {slot.isPast ? "Past" : slot.booked ? `Booked (${slot.schedules.length} child${slot.schedules.length > 1 ? "ren" : ""})` : "Available"}
                        </button>
                    ))}
                </div>
            </div>
        ));
    };

    const renderMonthDays = () => {
        const daysInMonth = eachDayOfInterval({
            start: startOfMonth(selectedMonth),
            end: endOfMonth(selectedMonth),
        });
        const firstDayOfMonth = startOfWeek(startOfMonth(selectedMonth), { weekStartsOn: 1 });
        const calendarDays = eachDayOfInterval({
            start: firstDayOfMonth,
            end: addDays(firstDayOfMonth, 41),
        });
        const monthSlots = getMonthSlots();

        return (
            <div className="month-grid grid grid-cols-7 gap-1">
                {DAYS.map(day => (
                    <div key={day} className="day-header text-center p-2 bg-blue-100 rounded">{day}</div>
                ))}
                {calendarDays.map(date => {
                    const isCurrentMonth = date.getMonth() === selectedMonth.getMonth();
                    const availability = monthSlots.find(d => 
                        d.date.toDateString() === date.toDateString()
                    );
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
                                    : "month-day-booked"
                            }`}
                            onClick={() => isCurrentMonth && !availability?.isPast && availability?.available && handleDaySelect(date)}
                            disabled={!isCurrentMonth || availability?.isPast || !availability?.available}
                        >
                            {format(date, "d")}
                            {availability?.bookedCount > 0 && (
                                <div className="text-xs text-blue-600">{availability.bookedCount} booked</div>
                            )}
                        </button>
                    );
                })}
            </div>
        );
    };

    const renderForm = () => {
        const selectedOrderDetail = orders
            .flatMap(o => [...o.vaccineDetails, ...o.packageDetails])
            .find(d => (d.orderVaccineId || d.orderPackageId) === formData.orderDetailId);
        const packageVaccineOptions = formData.type === "package" && selectedOrderDetail
            ? packageVaccines[selectedOrderDetail.vaccinePackageId] || []
            : [];

        return (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md form-container">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Book Vaccination</h2>
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Child</label>
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
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
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Vaccine/Package</label>
                            <div className="flex gap-3">
                                <select
                                    className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value, orderDetailId: "", vaccineId: "" })}
                                >
                                    <option value="vaccine">Vaccine</option>
                                    <option value="package">Package</option>
                                </select>
                                <select
                                    className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                                    value={formData.orderDetailId}
                                    onChange={e => setFormData({ ...formData, orderDetailId: e.target.value, vaccineId: "" })}
                                    required
                                >
                                    <option value="">Select {formData.type === "vaccine" ? "Vaccine" : "Package"}</option>
                                    {orders.flatMap(o =>
                                        formData.type === "vaccine"
                                            ? (o.vaccineDetails || []).map(d => (
                                                <option key={d.orderVaccineId} value={d.orderVaccineId}>
                                                    {d.vaccineName} (Price: ${d.totalPrice}, Qty: {d.quantity})
                                                </option>
                                            ))
                                            : (o.packageDetails || []).map(d => (
                                                <option key={d.orderPackageId} value={d.orderPackageId}>
                                                    {d.vaccinePackageName} (Price: ${d.totalPrice}, Qty: {d.quantity})
                                                </option>
                                            ))
                                    )}
                                </select>
                            </div>
                        </div>
                        {formData.type === "package" && formData.orderDetailId && (
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Vaccine in Package</label>
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                                    value={formData.vaccineId}
                                    onChange={e => setFormData({ ...formData, vaccineId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Vaccine</option>
                                    {packageVaccineOptions.map(v => (
                                        <option key={v.vaccineId} value={v.vaccineId}>
                                            {v.vaccineName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                                onClick={() => setIsFormOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Confirm
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const renderUpdateForm = () => {
        if (!updateFormData) return null;

        const selectedOrderDetail = orders
            .flatMap(o => [...o.vaccineDetails, ...o.packageDetails])
            .find(d => (d.orderVaccineId || d.orderPackageId) === updateFormData.orderDetailId);
        const packageVaccineOptions = updateFormData.type === "package" && selectedOrderDetail
            ? packageVaccines[selectedOrderDetail.vaccinePackageId] || []
            : [];
        const availableSlots = getAvailableSlotsForUpdate();

        const bookAnotherOrderDetail = orders
            .flatMap(o => [...o.vaccineDetails, ...o.packageDetails])
            .find(d => (d.orderVaccineId || d.orderPackageId) === bookAnotherFormData.orderDetailId);
        const bookAnotherPackageVaccineOptions = bookAnotherFormData.type === "package" && bookAnotherOrderDetail
            ? packageVaccines[bookAnotherOrderDetail.vaccinePackageId] || []
            : [];

        const handleCancelSchedule = async () => {
            if (!window.confirm("Are you sure you want to cancel this schedule?")) return;

            try {
                const response = await api.delete(`/api/VaccinationSchedule/${updateFormData.id}`);
                console.log("Cancel Response:", response.status);
                setSchedules(prev =>
                    prev.map(s =>
                        s.id === updateFormData.id ? { ...s, status: 0 } : s
                    )
                );
                alert("Schedule canceled successfully!");
                setIsUpdateFormOpen(false);
                setUpdateFormData(null);
                setSelectedSlot(null);
            } catch (err) {
                console.error("Cancel Error:", err.response?.status, err.response?.data || err.message);
                alert(err.response?.data?.Message || "Failed to cancel schedule");
            }
        };

        return (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md form-container">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Update Vaccination Schedule</h2>
                    <form onSubmit={handleUpdateFormSubmit}>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Child</label>
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                value={updateFormData.profileId}
                                onChange={e => setUpdateFormData({ ...updateFormData, profileId: e.target.value })}
                                required
                            >
                                <option value="">Select Child</option>
                                {profiles.map(p => (
                                    <option key={p.id} value={p.id}>{p.fullName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Vaccine/Package</label>
                            <div className="flex gap-3">
                                <select
                                    className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                    value={updateFormData.type}
                                    onChange={e => setUpdateFormData({ ...updateFormData, type: e.target.value, orderDetailId: "", vaccineId: "" })}
                                >
                                    <option value="vaccine">Vaccine</option>
                                    <option value="package">Package</option>
                                </select>
                                <select
                                    className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                    value={updateFormData.orderDetailId}
                                    onChange={e => setUpdateFormData({ ...updateFormData, orderDetailId: e.target.value, vaccineId: "" })}
                                    required
                                >
                                    <option value="">Select {updateFormData.type === "vaccine" ? "Vaccine" : "Package"}</option>
                                    {orders.flatMap(o =>
                                        updateFormData.type === "vaccine"
                                            ? (o.vaccineDetails || []).map(d => (
                                                <option key={d.orderVaccineId} value={d.orderVaccineId}>
                                                    {d.vaccineName} (Price: ${d.totalPrice}, Qty: {d.quantity})
                                                </option>
                                            ))
                                            : (o.packageDetails || []).map(d => (
                                                <option key={d.orderPackageId} value={d.orderPackageId}>
                                                    {d.vaccinePackageName} (Price: ${d.totalPrice}, Qty: {d.quantity})
                                                </option>
                                            ))
                                    )}
                                </select>
                            </div>
                        </div>
                        {updateFormData.type === "package" && updateFormData.orderDetailId && (
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Vaccine in Package</label>
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                    value={updateFormData.vaccineId}
                                    onChange={e => setUpdateFormData({ ...updateFormData, vaccineId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Vaccine</option>
                                    {packageVaccineOptions.map(v => (
                                        <option key={v.vaccineId} value={v.vaccineId}>
                                            {v.vaccineName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Current Appointment</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                                value={format(new Date(updateFormData.appointmentDate), "MMM d, yyyy HH:mm")}
                                disabled
                            />
                        </div>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Appointment Date/Time</label>
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                value={updateFormData.appointmentDate}
                                onChange={e => setUpdateFormData({ ...updateFormData, appointmentDate: e.target.value })}
                                required
                            >
                                <option value="">Select a new date and time</option>
                                {availableSlots.map(slot => (
                                    <option key={slot.value} value={slot.value}>
                                        {slot.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-5">
                            <button
                                type="button"
                                className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                onClick={() => setShowBookAnotherChild(!showBookAnotherChild)}
                            >
                                {showBookAnotherChild ? "Hide Add Another Child" : "Add Another Child to This Slot"}
                            </button>
                            {showBookAnotherChild && (
                                <div className="mt-4 p-4 border border-gray-300 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Another Child to This Slot</h3>
                                    <form onSubmit={handleBookAnotherChildSubmit}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Child</label>
                                            <select
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                                                value={bookAnotherFormData.profileId}
                                                onChange={e => setBookAnotherFormData({ ...bookAnotherFormData, profileId: e.target.value })}
                                                required
                                            >
                                                <option value="">Select Child</option>
                                                {profiles
                                                    .filter(p => p.id !== updateFormData.profileId)
                                                    .map(p => (
                                                        <option key={p.id} value={p.id}>{p.fullName}</option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Vaccine/Package</label>
                                            <div className="flex gap-3">
                                                <select
                                                    className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                                                    value={bookAnotherFormData.type}
                                                    onChange={e => setBookAnotherFormData({ ...bookAnotherFormData, type: e.target.value, orderDetailId: "", vaccineId: "" })}
                                                >
                                                    <option value="vaccine">Vaccine</option>
                                                    <option value="package">Package</option>
                                                </select>
                                                <select
                                                    className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                                                    value={bookAnotherFormData.orderDetailId}
                                                    onChange={e => setBookAnotherFormData({ ...bookAnotherFormData, orderDetailId: e.target.value, vaccineId: "" })}
                                                    required
                                                >
                                                    <option value="">Select {bookAnotherFormData.type === "vaccine" ? "Vaccine" : "Package"}</option>
                                                    {orders.flatMap(o =>
                                                        bookAnotherFormData.type === "vaccine"
                                                            ? (o.vaccineDetails || []).map(d => (
                                                                <option key={d.orderVaccineId} value={d.orderVaccineId}>
                                                                    {d.vaccineName} (Price: ${d.totalPrice}, Qty: {d.quantity})
                                                                </option>
                                                            ))
                                                            : (o.packageDetails || []).map(d => (
                                                                <option key={d.orderPackageId} value={d.orderPackageId}>
                                                                    {d.vaccinePackageName} (Price: ${d.totalPrice}, Qty: {d.quantity})
                                                                </option>
                                                            ))
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                        {bookAnotherFormData.type === "package" && bookAnotherFormData.orderDetailId && (
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Vaccine in Package</label>
                                                <select
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                                                    value={bookAnotherFormData.vaccineId}
                                                    onChange={e => setBookAnotherFormData({ ...bookAnotherFormData, vaccineId: e.target.value })}
                                                    required
                                                >
                                                    <option value="">Select Vaccine</option>
                                                    {bookAnotherPackageVaccineOptions.map(v => (
                                                        <option key={v.vaccineId} value={v.vaccineId}>
                                                            {v.vaccineName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Date/Time</label>
                                            <input
                                                type="text"
                                                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                                                value={format(new Date(updateFormData.appointmentDate), "MMM d, yyyy HH:mm")}
                                                disabled
                                            />
                                        </div>
                                        <div className="flex justify-end gap-3">
                                            <button
                                                type="submit"
                                                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                Add Child
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between gap-3">
                            <button
                                type="button"
                                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                onClick={handleCancelSchedule}
                            >
                                Cancel Schedule
                            </button>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                                    onClick={() => setIsUpdateFormOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    if (loading) return <div className="text-center py-5">Loading...</div>;
    if (error) return <div className="alert alert-danger text-center">{error}</div>;
    if (orders.length === 0) return <div className="text-center py-5">No paid orders available. Please complete payment to book a schedule.</div>;

    return (
        <div className="client-schedule-container max-w-5xl mx-auto p-4">
            <div className="header flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Schedule Your Vaccination</h1>
                <div className="controls flex items-center gap-4">
                    <select
                        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedCenter || ""}
                        onChange={e => setSelectedCenter(e.target.value)}
                    >
                        <option value="">Select Center</option>
                        {centers.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
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
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => {
                                    setSelectedWeek(prev => addDays(prev, -7));
                                    setSelectedSlot(null);
                                    setIsFormOpen(false);
                                    setIsUpdateFormOpen(false);
                                    setIsConfirmed(false);
                                }}
                            >
                                Previous
                            </button>
                            <span className="text-lg font-semibold text-gray-700">
                                {format(selectedWeek, "MMM d")} - {format(addDays(selectedWeek, 6), "MMM d, yyyy")}
                            </span>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => {
                                    setSelectedWeek(prev => addDays(prev, 7));
                                    setSelectedSlot(null);
                                    setIsFormOpen(false);
                                    setIsUpdateFormOpen(false);
                                    setIsConfirmed(false);
                                }}
                            >
                                Next
                            </button>
                        </div>
                    ) : (
                        <div className="month-nav flex items-center gap-4">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => {
                                    setSelectedMonth(prev => addDays(prev, -31));
                                    setSelectedSlot(null);
                                    setIsFormOpen(false);
                                    setIsUpdateFormOpen(false);
                                    setIsConfirmed(false);
                                }}
                            >
                                Previous
                            </button>
                            <span className="text-lg font-semibold text-gray-700">
                                {format(selectedMonth, "MMMM yyyy")}
                            </span>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => {
                                    setSelectedMonth(prev => addDays(prev, 31));
                                    setSelectedSlot(null);
                                    setIsFormOpen(false);
                                    setIsUpdateFormOpen(false);
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
                            <button
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={handleReset}
                            >
                                Book Another
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="month-container">{renderMonthDays()}</div>
            )}
            {isFormOpen && renderForm()}
            {isUpdateFormOpen && renderUpdateForm()}
        </div>
    );
}