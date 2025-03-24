import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { format } from "date-fns";
import { Link, useParams, useNavigate } from "react-router-dom";
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

function ClientVaccineHistory() {
    const { childId } = useParams();
    const navigate = useNavigate();
    const [histories, setHistories] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [vaccines, setVaccines] = useState([]);
    const [centers, setCenters] = useState([]);
    const [selectedProfileId, setSelectedProfileId] = useState(childId || "");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for sending certificate
    const [certificateForm, setCertificateForm] = useState({
        profileId: childId || "",
        documentationProvided: null,
        notes: "",
    });
    const [certificateError, setCertificateError] = useState(null);
    const [certificateSuccess, setCertificateSuccess] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [profileResponse, vaccineResponse, centerResponse] = await Promise.all([
                    api.get("/api/ChildrenProfile"),
                    api.get("/api/Vaccine"),
                    api.get("/api/VaccineCenters"),
                ]);
                setProfiles(profileResponse.data);
                setVaccines(vaccineResponse.data);
                setCenters(centerResponse.data);

                let historyResponse;
                if (childId) {
                    historyResponse = await api.get(`/api/VaccineHistory/child/${childId}`);
                } else {
                    historyResponse = await api.get("/api/VaccineHistory");
                }
                setHistories(historyResponse.data);

                setLoading(false);
            } catch (err) {
                console.error("Fetch Error:", err.response?.status, err.response?.data || err.message);
                setError(err.response?.data?.Message || err.message || "Failed to load vaccine history");
                setLoading(false);
            }
        };
        fetchData();
    }, [childId]);

    const handleCertificateChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "documentationProvided") {
            setCertificateForm({ ...certificateForm, [name]: files[0] });
        } else {
            setCertificateForm({ ...certificateForm, [name]: value });
        }
    };

    const handleCertificateSubmit = async (e) => {
        e.preventDefault();
        setCertificateError(null);
        setCertificateSuccess(null);

        if (!certificateForm.profileId) {
            setCertificateError("Please select a child.");
            return;
        }
        if (!certificateForm.documentationProvided) {
            setCertificateError("Please upload a document.");
            return;
        }

        const formData = new FormData();
        formData.append("ProfileId", certificateForm.profileId);
        formData.append("DocumentationProvided", certificateForm.documentationProvided);
        formData.append("Notes", certificateForm.notes);
        formData.append("VerifiedStatus", "0"); // InProgress

        try {
            const response = await api.post("/api/VaccineHistory/send-certificate", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setCertificateSuccess("Certificate submitted successfully! Awaiting verification.");
            setCertificateForm({ profileId: childId || "", documentationProvided: null, notes: "" });
            // Optionally refresh histories
            const historyResponse = childId
                ? await api.get(`/api/VaccineHistory/child/${childId}`)
                : await api.get("/api/VaccineHistory");
            setHistories(historyResponse.data);
        } catch (err) {
            console.error("Certificate Submit Error:", err.response?.status, err.response?.data || err.message);
            setCertificateError(err.response?.data?.Message || err.message || "Failed to submit certificate");
        }
    };

    const filteredHistories = selectedProfileId && !childId
        ? histories.filter(history => history.profileId === selectedProfileId)
        : histories;

    const sortedHistories = [...filteredHistories].sort((a, b) => new Date(b.administeredDate) - new Date(a.administeredDate));

    if (loading) return <div className="text-center py-5">Loading...</div>;
    if (error) return <div className="alert alert-danger text-center">{error}</div>;

    const childProfile = childId ? profiles.find(p => p.id === childId) : null;

    return (
        <div className="client-vaccine-history-container">
            <h1>
                {childId
                    ? `${childProfile?.fullName || "Child"}'s Vaccine History`
                    : "My Children's Vaccine History"}
            </h1>
            <div className="mb-4">
                {childId ? (
                    <button
                        className="btn btn-outline-secondary btn-animated"
                        onClick={() => navigate("/profile")}
                    >
                        Back to Profile
                    </button>
                ) : (
                    <Link to="/children-profiles" className="btn btn-outline-primary btn-animated">
                        View Detailed Profiles
                    </Link>
                )}
            </div>

            {/* Send Certificate Form */}
            <div className="mb-6">
                <h2>Send Vaccine Certificate</h2>
                <form onSubmit={handleCertificateSubmit} className="certificate-form">
                    <div className="mb-3">
                        <label>Child</label>
                        <select
                            name="profileId"
                            value={certificateForm.profileId}
                            onChange={handleCertificateChange}
                            disabled={!!childId} // Disable if childId is provided
                        >
                            <option value="">Select a child</option>
                            {profiles.map(profile => (
                                <option key={profile.id} value={profile.id}>
                                    {profile.fullName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label>Upload Document</label>
                        <input
                            type="file"
                            name="documentationProvided"
                            onChange={handleCertificateChange}
                            accept="image/*,application/pdf"
                        />
                    </div>
                    <div className="mb-3">
                        <label>Notes</label>
                        <textarea
                            name="notes"
                            value={certificateForm.notes}
                            onChange={handleCertificateChange}
                            placeholder="Add any notes about this certificate"
                            rows="3"
                        />
                    </div>
                    {certificateError && (
                        <div className="alert alert-danger mb-3">{certificateError}</div>
                    )}
                    {certificateSuccess && (
                        <div className="alert alert-success mb-3">{certificateSuccess}</div>
                    )}
                    <button type="submit" className="btn btn-primary">
                        Submit Certificate
                    </button>
                </form>
            </div>

            {/* Child Filter */}
            {!childId && profiles.length > 0 && (
                <div className="mb-6">
                    <label>Filter by Child</label>
                    <select
                        value={selectedProfileId}
                        onChange={e => setSelectedProfileId(e.target.value)}
                    >
                        <option value="">All Children</option>
                        {profiles.map(profile => (
                            <option key={profile.id} value={profile.id}>
                                {profile.fullName}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {sortedHistories.length === 0 ? (
                <div className="text-center py-5">
                    No vaccine history records available for {childId ? "this child" : "your children"}.
                </div>
            ) : (
                <div className="timeline">
                    {sortedHistories.map(history => {
                        const profile = profiles.find(p => p.id === history.profileId);
                        const vaccine = vaccines.find(v => v.id === history.vaccineId);
                        const center = centers.find(c => c.id === history.centerId);
                        const doctor = DOCTORS.find(d => d.id === parseInt(history.administeredBy));

                        return (
                            <div key={history.id} className="timeline-item">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <h3 className="timeline-title">
                                        {profile?.fullName || "Unknown Child"} - {vaccine?.name || "Unknown Vaccine"}
                                    </h3>
                                    <p className="timeline-date">
                                        {history.administeredDate
                                            ? format(new Date(history.administeredDate), "MMM d, yyyy HH:mm")
                                            : "N/A"}
                                    </p>
                                    <p className="timeline-details">
                                        <strong>Center:</strong> {center?.name || "Unknown Center"}<br />
                                        <strong>Doctor:</strong> {doctor?.name || "Unknown Doctor"}<br />
                                        <strong>Dose Number:</strong> {history.dosedNumber}<br />
                                        <strong>Status:</strong> {history.vaccinedStatus === 1 ? "Vaccinated" : history.vaccinedStatus === 0 ? "Pending Verification" : "Not Vaccinated"}<br />
                                        <strong>Verification:</strong> {history.verifiedStatus === 0 ? "Pending" : history.verifiedStatus === 1 ? "Accepted" : "Denied"}<br />
                                        {history.documentationProvided && (
                                            <>
                                                <strong>Document:</strong> <a href={history.documentationProvided} target="_blank" rel="noopener noreferrer">View Document</a><br />
                                            </>
                                        )}
                                        <strong>Notes:</strong> {history.notes || "N/A"}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ClientVaccineHistory;