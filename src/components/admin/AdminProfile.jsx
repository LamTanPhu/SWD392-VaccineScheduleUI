import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '.././api/axios';
import './AdminProfile.css';

const AdminProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        console.log("AdminProfile useEffect triggered");
        const fetchProfile = async () => {
            try {
                console.log("Fetching admin profile...");
                const response = await api.get("/api/users/profile");
                console.log("Raw response:", response);
                console.log("Response data:", response.data);

                const formattedProfile = {
                    username: response.data.username || "",
                    email: response.data.email || "",
                    role: response.data.role || "",
                    status: response.data.status || "",
                    vaccineCenter: response.data.vaccineCenter || null,
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

    console.log("Rendering admin profile:", profile);

    return (
        <div className="admin-profile-page container py-2">
            <h1 className="mb-4 text-gradient text-center">Admin/Staff Profile</h1>
            <div className="card profile-card shadow-lg mx-auto">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Welcome, {profile.username || "Admin"}</h5>
                    <span className="badge bg-light text-dark">{profile.role || "N/A"}</span>
                </div>
                <div className="card-body">
                    <div className="row g-4 justify-content-center">
                        <div className="col-md-8">
                            <div className="profile-info">
                                <p className="info-item">
                                    <strong>Email:</strong> <span className="text-muted">{profile.email || "N/A"}</span>
                                </p>
                                <p className="info-item">
                                    <strong>Status:</strong> <span className="text-success">{profile.status || "N/A"}</span>
                                </p>
                                {profile.vaccineCenter && (
                                    <p className="info-item">
                                        <strong>Vaccine Center:</strong>{" "}
                                        <span className="text-info">{profile.vaccineCenter.name || "N/A"}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer bg-light d-flex justify-content-end gap-2">
                    <button
                        className="btn btn-outline-primary btn-animated"
                        onClick={() => navigate("/admin/edit-profile")}
                    >
                        Edit Profile
                    </button>
                    <button
                        className="btn btn-outline-secondary btn-animated"
                        onClick={() => navigate("/admin/dashboard")}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;