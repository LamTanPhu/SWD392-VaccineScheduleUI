import { addDays, eachDayOfInterval, endOfMonth, format, isBefore, isEqual, startOfMonth, startOfWeek } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import "./Schedule.css";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const HOURS = ["7:00", "9:00", "11:00", "13:00", "15:00", "17:00", "19:00"];
const DOCTORS = [
    { id: 1, name: "Mr. 1" },
    { id: 2, name: "Mr. 2" },
    { id: 3, name: "Mr. 3" },
    { id: 4, name: "Mr. 4" },
    { id: 5, name: "Mr. 5" },
    { id: 6, name: "Mr. 6" },
    { id: 7, name: "Mr. 7" },
    { id: 8, name: "Mr. 8" },
];

export default function AdminSchedule() {
    const [selectedWeek, setSelectedWeek] = useState(startOfWeek(new Date("2025-03-17"), { weekStartsOn: 1 }));
    const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedCenter, setSelectedCenter] = useState(null);
    const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
    const [viewMode, setViewMode] = useState("week");
    const [schedules, setSchedules] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [orders, setOrders] = useState([]);
    const [centers, setCenters] = useState([]);
    const [packageVaccines, setPackageVaccines] = useState({});
    const [updateFormData, setUpdateFormData] = useState(null);
    const [showBookAnotherChild, setShowBookAnotherChild] = useState(false);
    const [bookAnotherFormData, setBookAnotherFormData] = useState({
        profileId: "",
        orderDetailId: "",
        type: "vaccine",
        vaccineId: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const today = new Date();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [scheduleResponse, profileResponse, orderResponse, centerResponse] = await Promise.all([
                    api.get("/api/VaccinationSchedule"),
                    api.get("/api/ChildrenProfile"),
                    api.get("/api/Order?status=Paid"),
                    api.get("/api/VaccineCenters"),
                ]);
                console.log("Schedules:", scheduleResponse.data);
                setSchedules(scheduleResponse.data);
                setProfiles(profileResponse.data);
                setOrders(orderResponse.data);
                setCenters(centerResponse.data);
                if (centerResponse.data.length > 0 && !selectedCenter) {
                    setSelectedCenter(centerResponse.data[0].id);
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

        const weekStart = selectedWeek;
        const slots = HOURS.map(hour => ({
            hour,
            days: DAYS.map((_, dayIndex) => {
                const slotDate = addDays(weekStart, dayIndex);
                const slotTime = `${format(slotDate, "yyyy-MM-dd")}T${hour}:00`;

                const slotSchedules = schedules.filter(s => {
                    const appointmentTime = format(new Date(s.appointmentDate), "yyyy-MM-dd'T'HH:mm:ss");
                    const matchesTime = appointmentTime === slotTime;
                    const matchesCenter = s.vaccineCenterId === selectedCenter;
                    const isActive = s.status !== 0;
                    console.log(`Slot ${slotTime} - Schedule:`, { appointmentTime, matchesTime, matchesCenter, isActive });
                    return matchesTime && matchesCenter && isActive;
                });

                const isPast = isBefore(slotDate, today) && !isEqual(slotDate, today);
                return {
                    available: !isPast && slotSchedules.length === 0,
                    booked: slotSchedules.length > 0,
                    isPast,
                    schedules: slotSchedules,
                    isInteractive: !isPast || (isPast && slotSchedules.length > 0),
                };
            }),
        }));
        console.log("Week Slots:", slots);
        return slots;
    }, [selectedCenter, selectedWeek, schedules, profiles]);

    const getAvailableSlotsForUpdate = () => {
        const availableSlots = [];

        // Helper function to calculate slots for a given week
        const calculateWeekSlots = (weekStart) => {
            return HOURS.map(hour => ({
                hour,
                days: DAYS.map((_, dayIndex) => {
                    const slotDate = addDays(weekStart, dayIndex);
                    const slotTime = `${format(slotDate, "yyyy-MM-dd")}T${hour}:00`;

                    const slotSchedules = schedules.filter(s => {
                        const appointmentTime = format(new Date(s.appointmentDate), "yyyy-MM-dd'T'HH:mm:ss");
                        const matchesTime = appointmentTime === slotTime;
                        const matchesCenter = s.vaccineCenterId === selectedCenter;
                        const isActive = s.status !== 0;
                        return matchesTime && matchesCenter && isActive;
                    });

                    const isPast = isBefore(slotDate, today) && !isEqual(slotDate, today);
                    return {
                        available: !isPast && slotSchedules.length === 0,
                        booked: slotSchedules.length > 0,
                        isPast,
                        schedules: slotSchedules,
                        isInteractive: !isPast || (isPast && slotSchedules.length > 0),
                    };
                }),
            }));
        };

        // Get slots for the current week
        const currentWeekSlots = getWeekSlots;

        // Get slots for the next week
        const nextWeekStart = addDays(selectedWeek, 7);
        const nextWeekSlots = calculateWeekSlots(nextWeekStart);

        // Combine slots from both weeks
        const allWeekSlots = [
            { weekStart: selectedWeek, slots: currentWeekSlots },
            { weekStart: nextWeekStart, slots: nextWeekSlots },
        ];

        // Populate available slots from both weeks
        allWeekSlots.forEach(({ weekStart, slots }) => {
            slots.forEach(({ hour, days }) => {
                days.forEach((slot, dayIndex) => {
                    if (!slot.booked) {
                        const slotDate = addDays(weekStart, dayIndex);
                        const slotTime = `${format(slotDate, "yyyy-MM-dd")}T${hour}:00`;
                        availableSlots.push({
                            value: slotTime,
                            label: `${DAYS[dayIndex]} ${format(slotDate, "MMM d")} at ${hour}`,
                        });
                    }
                });
            });
        });

        // Sort slots chronologically
        availableSlots.sort((a, b) => new Date(a.value) - new Date(b.value));

        return availableSlots;
    };

    const getMonthSlots = () => {
        if (!selectedCenter) return [];
        const daysInMonth = eachDayOfInterval({
            start: startOfMonth(selectedMonth),
            end: endOfMonth(selectedMonth),
        });
        const slots = daysInMonth.map(date => {
            const daySchedules = schedules.filter(s => {
                const matchesDate = new Date(s.appointmentDate).toDateString() === date.toDateString();
                const matchesCenter = s.vaccineCenterId === selectedCenter;
                console.log(`Day ${date.toDateString()} - Schedule:`, { appointmentDate: s.appointmentDate, matchesDate, matchesCenter });
                return matchesDate && matchesCenter;
            });
            const isPast = isBefore(date, today) && !isEqual(date, today);
            return {
                date,
                available: !isPast && !daySchedules.some(s => s.status === 1),
                bookedCount: daySchedules.filter(s => s.status === 1).length,
                isPast,
            };
        });
        console.log("Month Slots:", slots);
        return slots;
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

        setSelectedSlot({ dayIndex, hour });
        if (slot.booked) {
            const schedule = slot.schedules[0];
            setUpdateFormData({
                id: schedule.id,
                profileId: schedule.profileId,
                orderDetailId: schedule.orderVaccineDetailsId || schedule.orderPackageDetailsId,
                type: schedule.orderVaccineDetailsId ? "vaccine" : "package",
                vaccineId: schedule.vaccineId,
                appointmentDate: schedule.appointmentDate,
                administeredBy: schedule.administeredBy,
            });
            setIsUpdateFormOpen(true);
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
                AdministeredBy: updateFormData.administeredBy || null,
                Status: schedules.find(s => s.id === updateFormData.id)?.status || 1,
            };

            const response = await api.put(`/api/VaccinationSchedule?scheduleId=${updateFormData.id}`, updatedSchedule);
            setSchedules(prev =>
                prev.map(s =>
                    s.id === updateFormData.id
                        ? { ...s, appointmentDate: updateFormData.appointmentDate, administeredBy: updateFormData.administeredBy }
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
        const weekSlots = getWeekSlots;
        return weekSlots.map(({ hour, days }) => (
            <div key={hour} className="slot-row flex items-center mb-2">
                <div className="time-label w-20 text-center font-semibold text-gray-700">{hour}</div>
                <div className="slots-grid flex-1 grid grid-cols-7 gap-2">
                    {days.map((slot, dayIndex) => {
                        const isDisabled = !slot.isInteractive;
                        console.log(`Slot ${hour} on ${DAYS[dayIndex]}:`, { isPast: slot.isPast, booked: slot.booked, isInteractive: slot.isInteractive, isDisabled });
                        return (
                            <button
                                key={dayIndex}
                                className={`slot-card p-2 rounded text-center transition-colors ${
                                    slot.isPast && !slot.booked
                                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                        : slot.booked
                                        ? "slot-booked"
                                        : "bg-gray-100 text-gray-500 cursor-not-allowed"
                                }`}
                                onClick={() => handleSlotSelect(dayIndex, hour)}
                                disabled={isDisabled}
                            >
                                {slot.isPast && !slot.booked
                                    ? "Past"
                                    : slot.booked
                                    ? `Booked (${slot.schedules.length} child${slot.schedules.length > 1 ? "ren" : ""})`
                                    : "Available"}
                                {slot.booked && (
                                    <div className="text-xs mt-1">
                                        {slot.schedules.map(s => {
                                            const profile = profiles.find(p => p.id === s.profileId);
                                            const doctor = DOCTORS.find(d => d.id === parseInt(s.administeredBy));
                                            return (
                                                <div key={s.id}>
                                                    {profile?.fullName || "Unknown Child"} - {doctor?.name || "No Doctor"}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </button>
                        );
                    })}
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
                                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                    : "month-day-booked"
                            }`}
                            onClick={() => isCurrentMonth && !availability?.isPast && !availability?.available && handleDaySelect(date)}
                            disabled={!isCurrentMonth || availability?.isPast || availability?.available}
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

    const handleDaySelect = (date) => {
        setSelectedWeek(startOfWeek(date, { weekStartsOn: 1 }));
        setViewMode("week");
        setSelectedSlot(null);
        setIsUpdateFormOpen(false);
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
                                disabled
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
                                    disabled
                                >
                                    <option value="vaccine">Vaccine</option>
                                    <option value="package">Package</option>
                                </select>
                                <select
                                    className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                    value={updateFormData.orderDetailId}
                                    onChange={e => setUpdateFormData({ ...updateFormData, orderDetailId: e.target.value, vaccineId: "" })}
                                    disabled
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
                                    disabled
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Assign Doctor</label>
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                value={updateFormData.administeredBy || ""}
                                onChange={e => setUpdateFormData({ ...updateFormData, administeredBy: e.target.value })}
                            >
                                <option value="">Select Doctor</option>
                                {DOCTORS.map(d => (
                                    <option key={d.id} value={d.id}>
                                        {d.name}
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
    if (orders.length === 0) return <div className="text-center py-5">No paid orders available.</div>;

    return (
        <div className="admin-schedule-container max-w-5xl mx-auto p-4">
            <div className="header flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Admin Vaccination Schedule</h1>
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
                                    setIsUpdateFormOpen(false);
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
                                    setIsUpdateFormOpen(false);
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
                                    setIsUpdateFormOpen(false);
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
                                    setIsUpdateFormOpen(false);
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
                </>
            ) : (
                <div className="month-container">{renderMonthDays()}</div>
            )}
            {isUpdateFormOpen && renderUpdateForm()}
        </div>
    );
}