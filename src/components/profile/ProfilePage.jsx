import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Profile.css";

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        console.log("Profile useEffect triggered");
        const fetchProfile = async () => {
            try {
                console.log("Fetching profile...");
                const response = await api.get("/api/users/profile");
                console.log("Raw response:", response);
                console.log("Response data:", response.data);

                const formattedProfile = {
                    username: response.data.username || "",
                    email: response.data.email || "",
                    role: response.data.role || "",
                    status: response.data.status || "",
                    phoneNumber: response.data.phoneNumber || "", // Added phoneNumber
                    vaccineCenter: response.data.vaccineCenter || null,
                    childrenProfiles: response.data.childrenProfiles || [],
                };

                if (mounted) {
                    setProfile(formattedProfile);
                    setLoading(false);
                    console.log("Profile set:", formattedProfile);
                }
            } catch (err) {
                console.error(
                    "Fetch error:",
                    err.response?.data || err.message,
                    "Status:",
                    err.response?.status
                );
                if (mounted) {
                    setError(err.response?.data?.Message || "Failed to load profile");
                    setLoading(false);
                }
            }
        };
        fetchProfile();
        return () => {
            mounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center" role="alert">
                {error}
            </div>
        );
    }

    console.log("Rendering profile:", profile);

    return (
        <div className="profile-page container py-2">
            <h1 className="mb-4 text-gradient text-center">User Profile</h1>
            <div className="card profile-card shadow-lg mx-auto">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Welcome, {profile.username || "User"}</h5>
                    <span className="badge bg-light text-dark">{profile.role || "N/A"}</span>
                </div>
                <div className="card-body">
                    <div className="row g-4 justify-content-center">
                        <div className="col-md-5">
                            <div className="profile-info">
                                <p className="info-item">
                                    <strong>Email:</strong> <span className="text-muted">{profile.email || "N/A"}</span>
                                </p>
                                <p className="info-item">
                                    <strong>Status:</strong> <span className="text-success">{profile.status || "N/A"}</span>
                                </p>
                                <p className="info-item">
                                    <strong>Phone:</strong> <span className="text-muted">{profile.phoneNumber || "N/A"}</span>
                                </p>
                                {profile.vaccineCenter && (
                                    <p className="info-item">
                                        <strong>Vaccine Center:</strong>{" "}
                                        <span className="text-info">{profile.vaccineCenter.name || "N/A"}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="col-md-7">
                            <div className="children-section">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="text-primary">Children Profiles</h6>
                                    <button
                                        className="btn btn-outline-info btn-animated"
                                        onClick={() => navigate("/children-profiles")}
                                    >
                                        Manage Children
                                    </button>
                                </div>
                                <div className="children-list">
                                    {profile.childrenProfiles && profile.childrenProfiles.length > 0 ? (
                                        profile.childrenProfiles.map((child, index) => (
                                            <div key={index} className="child-card mb-3 p-3 bg-light rounded">
                                                <p>
                                                    <strong>Full Name:</strong> {child.fullName || "N/A"}
                                                </p>
                                                <p>
                                                    <strong>Date of Birth:</strong>{" "}
                                                    {child.dateOfBirth
                                                        ? new Date(child.dateOfBirth).toLocaleDateString()
                                                        : "N/A"}
                                                </p>
                                                <p>
                                                    <strong>Gender:</strong>{" "}
                                                    {child.gender === "M" ? "Male" : child.gender === "F" ? "Female" : "N/A"}
                                                </p>
                                                <p>
                                                    <strong>Status:</strong> {child.status || "N/A"}
                                                </p>
                                                <p>
                                                    <strong>Address:</strong> {child.address || "N/A"}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted">No children profiles available.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer bg-light d-flex justify-content-end gap-2">
                    <button
                        className="btn btn-outline-primary btn-animated"
                        onClick={() => navigate("/edit-profile")}
                    >
                        Edit Profile
                    </button>
                    <button
                        className="btn btn-outline-secondary btn-animated"
                        onClick={() => navigate("/")}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;