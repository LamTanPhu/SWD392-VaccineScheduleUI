import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./ChildrenProfile.css";

const ChildrenProfiles = () => {
    const navigate = useNavigate();
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingChild, setEditingChild] = useState(null);
    const [formData, setFormData] = useState({
        fullName: "",
        dateOfBirth: "",
        gender: "",
        status: "",
        address: ""
    });

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const response = await api.get("/api/ChildrenProfile/my-children");
                setChildren(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.Message || "Failed to load children profiles");
                setLoading(false);
            }
        };
        fetchChildren();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            fullName: "",
            dateOfBirth: "",
            gender: "",
            status: "",
            address: ""
        });
        setEditingChild(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.fullName || !formData.dateOfBirth || !formData.gender || !formData.status) {
            setError("Full Name, Date of Birth, Gender, and Status are required.");
            return;
        }

        const payload = {
            fullName: formData.fullName,
            dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
            gender: formData.gender,
            status: formData.status,
            address: formData.address || null
        };

        console.log("Sending payload:", payload);

        try {
            if (editingChild) {
                await api.put(`/api/ChildrenProfile/${editingChild.id}`, payload);
                setChildren(children.map(child =>
                    child.id === editingChild.id ? { ...child, ...payload, dateOfBirth: new Date(payload.dateOfBirth) } : child
                ));
            } else {
                const response = await api.post("/api/ChildrenProfile", payload);
                setChildren([...children, response.data]); // Add the full response DTO
            }
            resetForm();
        } catch (err) {
            console.error("API Error:", err.response?.data, err.response?.status);
            setError(err.response?.data?.Message || "Failed to save child profile");
        }
    };

    const handleEdit = (child) => {
        setEditingChild(child);
        setFormData({
            fullName: child.fullName,
            dateOfBirth: child.dateOfBirth.split("T")[0],
            gender: child.gender,
            status: child.status,
            address: child.address || ""
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this child profile?")) return;
        try {
            await api.delete(`/api/ChildrenProfile/${id}`);
            setChildren(children.filter(child => child.id !== id));
        } catch (err) {
            setError(err.response?.data?.Message || "Failed to delete child profile");
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error && !children.length) {
        return (
            <div className="alert alert-danger text-center" role="alert">
                {error}
                <button className="btn btn-link" onClick={() => navigate("/profile")}>
                    Back to Profile
                </button>
            </div>
        );
    }

    return (
        <div className="children-profiles-page container py-2">
            <h1 className="mb-4 text-gradient text-center">Manage Children Profiles</h1>
            <div className="card shadow-lg mx-auto">
                <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Children Profiles</h5>
                    <button
                        className="btn btn-light btn-animated"
                        onClick={resetForm}
                        disabled={editingChild !== null}
                    >
                        Add New Child
                    </button>
                </div>
                <div className="card-body">
                    {error && <div className="alert alert-danger mb-3">{error}</div>}
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Status</label>
                                <input
                                    type="text"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="e.g., Active"
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Address (Optional)</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Enter address"
                                />
                            </div>
                        </div>
                        <div className="mt-3">
                            <button type="submit" className="btn btn-primary btn-animated me-2">
                                {editingChild ? "Update Child" : "Add Child"}
                            </button>
                            {editingChild && (
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-animated"
                                    onClick={resetForm}
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>

                    {children.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Full Name</th>
                                        <th>Date of Birth</th>
                                        <th>Gender</th>
                                        <th>Status</th>
                                        <th>Address</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {children.map(child => (
                                        <tr key={child.id}>
                                            <td>{child.fullName}</td>
                                            <td>{new Date(child.dateOfBirth).toLocaleDateString()}</td>
                                            <td>{child.gender === "M" ? "Male" : "Female"}</td>
                                            <td>{child.status}</td>
                                            <td>{child.address || "N/A"}</td>
                                            <td>
                                                <button
                                                    className="btn btn-outline-primary btn-sm me-2"
                                                    onClick={() => handleEdit(child)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => handleDelete(child.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-muted text-center">No children profiles yet. Add one above!</p>
                    )}
                </div>
                <div className="card-footer bg-light d-flex justify-content-end">
                    <button
                        className="btn btn-outline-secondary btn-animated"
                        onClick={() => navigate("/profile")}
                    >
                        Back to Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChildrenProfiles;