import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { format } from "date-fns";
import "./VaccineHistory.css";

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

function AdminVaccineHistory() {
    const [histories, setHistories] = useState([]);
    const [pendingCertificates, setPendingCertificates] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [vaccines, setVaccines] = useState([]);
    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for verifying certificate
    const [verifyForm, setVerifyForm] = useState({
        vaccineId: "",
        centerId: "",
        administeredDate: "",
        administeredBy: "",
        vaccinedStatus: 1,
        dosedNumber: 1,
        notes: "",
    });
    const [verifyError, setVerifyError] = useState(null);
    const [verifySuccess, setVerifySuccess] = useState(null);
    const [selectedCertificateId, setSelectedCertificateId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [historyResponse, pendingResponse, profileResponse, vaccineResponse, centerResponse] = await Promise.all([
                    api.get("/api/VaccineHistory"),
                    api.get("/api/VaccineHistory/pending-certificates"),
                    api.get("/api/ChildrenProfile"),
                    api.get("/api/Vaccine"),
                    api.get("/api/VaccineCenters"),
                ]);

                setHistories(historyResponse.data);
                setPendingCertificates(pendingResponse.data);
                setProfiles(profileResponse.data);
                setVaccines(vaccineResponse.data);
                setCenters(centerResponse.data);

                setLoading(false);
            } catch (err) {
                console.error("Fetch Error:", err.response?.status, err.response?.data || err.message);
                setError(err.response?.data?.Message || err.message || "Failed to load vaccine history");
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleVerifyChange = (e) => {
        const { name, value } = e.target;
        setVerifyForm({ ...verifyForm, [name]: value });
    };

    const handleVerifySubmit = async (certificateId, isAccepted) => {
        setVerifyError(null);
        setVerifySuccess(null);

        try {
            const response = await api.put(
                `/api/VaccineHistory/verify-certificate/${certificateId}?isAccepted=${isAccepted}`,
                verifyForm
            );
            setVerifySuccess(`Certificate ${isAccepted ? "accepted" : "denied"} successfully!`);
            // Refresh pending certificates and histories
            const [pendingResponse, historyResponse] = await Promise.all([
                api.get("/api/VaccineHistory/pending-certificates"),
                api.get("/api/VaccineHistory"),
            ]);
            setPendingCertificates(pendingResponse.data);
            setHistories(historyResponse.data);
            setSelectedCertificateId(null);
            setVerifyForm({
                vaccineId: "",
                centerId: "",
                administeredDate: "",
                administeredBy: "",
                vaccinedStatus: 1,
                dosedNumber: 1,
                notes: "",
            });
        } catch (err) {
            console.error("Verify Error:", err.response?.status, err.response?.data || err.message);
            setVerifyError(err.response?.data?.Message || err.message || "Failed to verify certificate");
        }
    };

    if (loading) return <div className="text-center py-5">Loading...</div>;
    if (error) return <div className="alert alert-danger text-center">{error}</div>;

    return (
        <div className="admin-vaccine-history-container">
            <h1>Vaccine History</h1>

            {/* Pending Certificates Section */}
            <h2>Pending Certificates</h2>
            {pendingCertificates.length === 0 ? (
                <div className="text-center py-5">No pending certificates to verify.</div>
            ) : (
                <div className="overflow-x-auto mb-6">
                    <table>
                        <thead>
                            <tr>
                                <th>Child</th>
                                <th>Document</th>
                                <th>Notes</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingCertificates.map(certificate => {
                                const profile = profiles.find(p => p.id === certificate.profileId);
                                return (
                                    <tr key={certificate.id}>
                                        <td>{profile?.fullName || "Unknown Child"}</td>
                                        <td>
                                            {certificate.documentationProvided ? (
                                                <a href={certificate.documentationProvided} target="_blank" rel="noopener noreferrer">
                                                    View Document
                                                </a>
                                            ) : "N/A"}
                                        </td>
                                        <td>{certificate.notes || "N/A"}</td>
                                        <td>
                                            <button
                                                className="btn btn-outline-primary btn-sm mr-2"
                                                onClick={() => setSelectedCertificateId(certificate.id)}
                                            >
                                                Verify
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Verify Certificate Form */}
            {selectedCertificateId && (
                <div className="mb-6">
                    <h3>Verify Certificate</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleVerifySubmit(selectedCertificateId, true);
                        }}
                        className="certificate-form"
                    >
                        <div className="mb-3">
                            <label>Vaccine</label>
                            <select
                                name="vaccineId"
                                value={verifyForm.vaccineId}
                                onChange={handleVerifyChange}
                                required
                            >
                                <option value="">Select a vaccine</option>
                                {vaccines.map(vaccine => (
                                    <option key={vaccine.id} value={vaccine.id}>
                                        {vaccine.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label>Center</label>
                            <select
                                name="centerId"
                                value={verifyForm.centerId}
                                onChange={handleVerifyChange}
                                required
                            >
                                <option value="">Select a center</option>
                                {centers.map(center => (
                                    <option key={center.id} value={center.id}>
                                        {center.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label>Administered Date</label>
                            <input
                                type="datetime-local"
                                name="administeredDate"
                                value={verifyForm.administeredDate}
                                onChange={handleVerifyChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>Administered By</label>
                            <select
                                name="administeredBy"
                                value={verifyForm.administeredBy}
                                onChange={handleVerifyChange}
                                required
                            >
                                <option value="">Select a doctor</option>
                                {DOCTORS.map(doctor => (
                                    <option key={doctor.id} value={doctor.id}>
                                        {doctor.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label>Vaccination Status</label>
                            <select
                                name="vaccinedStatus"
                                value={verifyForm.vaccinedStatus}
                                onChange={handleVerifyChange}
                            >
                                <option value={1}>In Progress</option>
                                <option value={2}>Completed</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label>Dose Number</label>
                            <input
                                type="number"
                                name="dosedNumber"
                                value={verifyForm.dosedNumber}
                                onChange={handleVerifyChange}
                                min="1"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>Notes</label>
                            <textarea
                                name="notes"
                                value={verifyForm.notes}
                                onChange={handleVerifyChange}
                                placeholder="Add any notes (e.g., reason for denial)"
                                rows="3"
                            />
                        </div>
                        {verifyError && (
                            <div className="alert alert-danger mb-3">{verifyError}</div>
                        )}
                        {verifySuccess && (
                            <div className="alert alert-success mb-3">{verifySuccess}</div>
                        )}
                        <button type="submit" className="btn btn-success mr-2">
                            Accept
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleVerifySubmit(selectedCertificateId, false)}
                        >
                            Deny
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary ml-2"
                            onClick={() => setSelectedCertificateId(null)}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            {/* All Vaccine Histories */}
            <h2>All Vaccine Histories</h2>
            {histories.length === 0 ? (
                <div className="text-center py-5">No vaccine history records available.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table>
                        <thead>
                            <tr>
                                <th>Child</th>
                                <th>Vaccine</th>
                                <th>Center</th>
                                <th>Date</th>
                                <th>Doctor</th>
                                <th>Dose Number</th>
                                <th>Status</th>
                                <th>Verification</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {histories.map(history => {
                                const profile = profiles.find(p => p.id === history.profileId);
                                const vaccine = vaccines.find(v => v.id === history.vaccineId);
                                const center = centers.find(c => c.id === history.centerId);
                                const doctor = DOCTORS.find(d => d.id === parseInt(history.administeredBy));

                                return (
                                    <tr key={history.id}>
                                        <td>{profile?.fullName || "Unknown Child"}</td>
                                        <td>{vaccine?.name || "Unknown Vaccine"}</td>
                                        <td>{center?.name || "Unknown Center"}</td>
                                        <td>
                                            {history.administeredDate
                                                ? format(new Date(history.administeredDate), "MMM d, yyyy HH:mm")
                                                : "N/A"}
                                        </td>
                                        <td>{doctor?.name || "Unknown Doctor"}</td>
                                        <td>{history.dosedNumber}</td>
                                        <td>
                                            {history.vaccinedStatus === 1 ? "Vaccinated" : history.vaccinedStatus === 0 ? "Pending Verification" : "Not Vaccinated"}
                                        </td>
                                        <td>
                                            {history.verifiedStatus === 0 ? "Pending" : history.verifiedStatus === 1 ? "Accepted" : "Denied"}
                                        </td>
                                        <td>{history.notes || "N/A"}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminVaccineHistory;