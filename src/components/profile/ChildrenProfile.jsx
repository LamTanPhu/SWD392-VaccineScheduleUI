import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./ChildrenProfile.css";

const ChildrenProfiles = () => {
    const navigate = useNavigate();
    const [childrenForms, setChildrenForms] = useState([]);
    const [newChildrenForms, setNewChildrenForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const response = await api.get("/api/ChildrenProfile/my-children");
                // Initialize forms for existing children
                const existingForms = response.data.map(child => ({
                    id: child.id,
                    fullName: child.fullName,
                    dateOfBirth: child.dateOfBirth.split("T")[0],
                    gender: child.gender,
                    status: child.status,
                    address: child.address || ""
                }));
                setChildrenForms(existingForms);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.Message || "Failed to load children profiles");
                setLoading(false);
            }
        };
        fetchChildren();
    }, []);

    const handleChange = (e, index, isNew = false) => {
        const { name, value } = e.target;
        if (isNew) {
            setNewChildrenForms(prev => {
                const newForms = [...prev];
                newForms[index] = { ...newForms[index], [name]: value };
                return newForms;
            });
        } else {
            setChildrenForms(prev => {
                const newForms = [...prev];
                newForms[index] = { ...newForms[index], [name]: value };
                return newForms;
            });
        }
    };

    const addNewChildForm = () => {
        setNewChildrenForms(prev => [
            ...prev,
            { fullName: "", dateOfBirth: "", gender: "", status: "", address: "" }
        ]);
    };

    const removeNewChildForm = (index) => {
        setNewChildrenForms(prev => prev.filter((_, i) => i !== index));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const payloads = newChildrenForms.map(child => ({
            fullName: child.fullName,
            dateOfBirth: child.dateOfBirth ? new Date(child.dateOfBirth).toISOString() : "",
            gender: child.gender,
            status: child.status,
            address: child.address || null
        }));

        if (payloads.some(p => !p.fullName || !p.dateOfBirth || !p.gender || !p.status)) {
            setError("All fields except Address are required for each child.");
            return;
        }

        try {
            const responses = await Promise.all(
                payloads.map(payload => api.post("/api/ChildrenProfile", payload))
            );
            const newForms = responses.map(res => ({
                id: res.data.id,
                fullName: res.data.fullName,
                dateOfBirth: res.data.dateOfBirth.split("T")[0],
                gender: res.data.gender,
                status: res.data.status,
                address: res.data.address || ""
            }));
            setChildrenForms(prev => [...prev, ...newForms]);
            setNewChildrenForms([]);
        } catch (err) {
            console.error("API Error:", err.response?.data, err.response?.status);
            setError(err.response?.data?.Message || "Failed to save children profiles");
        }
    };

    const handleUpdateSubmit = async (index) => {
        setError(null);
        const child = childrenForms[index];
        const payload = {
            fullName: child.fullName,
            dateOfBirth: child.dateOfBirth ? new Date(child.dateOfBirth).toISOString() : "",
            gender: child.gender,
            status: child.status,
            address: child.address || null
        };

        if (!payload.fullName || !payload.dateOfBirth || !payload.gender || !payload.status) {
            setError("All fields except Address are required.");
            return;
        }

        try {
            await api.put(`/api/ChildrenProfile/${child.id}`, payload);
            setChildrenForms(prev => {
                const newForms = [...prev];
                newForms[index] = { ...child, dateOfBirth: child.dateOfBirth }; // Keep date as string
                return newForms;
            });
        } catch (err) {
            console.error("API Error:", err.response?.data, err.response?.status);
            setError(err.response?.data?.Message || "Failed to update child profile");
        }
    };

    const handleDelete = async (index) => {
        if (!window.confirm("Are you sure you want to delete this child profile?")) return;
        try {
            const childId = childrenForms[index].id;
            await api.delete(`/api/ChildrenProfile/${childId}`);
            setChildrenForms(prev => prev.filter((_, i) => i !== index));
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

    if (error && !childrenForms.length && !newChildrenForms.length) {
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
            <h1 className="section-title">Manage Children Profiles</h1>
            <div className="card shadow-sm mx-auto">
                <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Add New Children</h5>
                    <button
                        className="btn btn-light btn-sm btn-add-another"
                        onClick={addNewChildForm}
                        disabled={newChildrenForms.length >= 2}
                    >
                        Add Another Child
                    </button>
                </div>
                <div className="card-body">
                    {error && <div className="alert alert-danger mb-3">{error}</div>}
                    {newChildrenForms.length > 0 && (
                        <form onSubmit={handleCreateSubmit}>
                            {newChildrenForms.map((child, index) => (
                                <div key={`new-${index}`} className="child-form mb-3">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={child.fullName}
                                                onChange={(e) => handleChange(e, index, true)}
                                                className="form-control input-styled"
                                                placeholder="Enter full name"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <input
                                                type="date"
                                                name="dateOfBirth"
                                                value={child.dateOfBirth}
                                                onChange={(e) => handleChange(e, index, true)}
                                                className="form-control input-styled"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <div className="d-flex gap-3">
                                                <div className="form-check">
                                                    <input
                                                        type="radio"
                                                        id={`new-male-${index}`}
                                                        name={`new-gender-${index}`}
                                                        value="M"
                                                        checked={child.gender === "M"}
                                                        onChange={(e) => handleChange({ target: { name: "gender", value: "M" }}, index, true)}
                                                        className="form-check-input"
                                                    />
                                                    <label htmlFor={`new-male-${index}`} className="form-check-label">Male</label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        type="radio"
                                                        id={`new-female-${index}`}
                                                        name={`new-gender-${index}`}
                                                        value="F"
                                                        checked={child.gender === "F"}
                                                        onChange={(e) => handleChange({ target: { name: "gender", value: "F" }}, index, true)}
                                                        className="form-check-input"
                                                    />
                                                    <label htmlFor={`new-female-${index}`} className="form-check-label">Female</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <input
                                                type="text"
                                                name="status"
                                                value={child.status}
                                                onChange={(e) => handleChange(e, index, true)}
                                                className="form-control input-styled"
                                                placeholder="e.g., Active"
                                                required
                                            />
                                        </div>
                                        <div className="col-12">
                                            <input
                                                type="text"
                                                name="address"
                                                value={child.address}
                                                onChange={(e) => handleChange(e, index, true)}
                                                className="form-control input-styled"
                                                placeholder="Enter address"
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end mt-2">
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => removeNewChildForm(index)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button type="submit" className="btn btn-primary btn-save-all w-100 mt-3">
                                Save All Children
                            </button>
                        </form>
                    )}

                    {childrenForms.length > 0 && (
                        <>
                            <h5 className="section-subtitle mt-4">Existing Children</h5>
                            {childrenForms.map((child, index) => (
                                <div key={child.id} className="child-form mb-3">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={child.fullName}
                                                onChange={(e) => handleChange(e, index)}
                                                className="form-control input-styled"
                                                placeholder="Enter full name"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <input
                                                type="date"
                                                name="dateOfBirth"
                                                value={child.dateOfBirth}
                                                onChange={(e) => handleChange(e, index)}
                                                className="form-control input-styled"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <div className="d-flex gap-3">
                                                <div className="form-check">
                                                    <input
                                                        type="radio"
                                                        id={`existing-male-${index}`}
                                                        name={`existing-gender-${index}`}
                                                        value="M"
                                                        checked={child.gender === "M"}
                                                        onChange={(e) => handleChange({ target: { name: "gender", value: "M" }}, index)}
                                                        className="form-check-input"
                                                    />
                                                    <label htmlFor={`existing-male-${index}`} className="form-check-label">Male</label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        type="radio"
                                                        id={`existing-female-${index}`}
                                                        name={`existing-gender-${index}`}
                                                        value="F"
                                                        checked={child.gender === "F"}
                                                        onChange={(e) => handleChange({ target: { name: "gender", value: "F" }}, index)}
                                                        className="form-check-input"
                                                    />
                                                    <label htmlFor={`existing-female-${index}`} className="form-check-label">Female</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <input
                                                type="text"
                                                name="status"
                                                value={child.status}
                                                onChange={(e) => handleChange(e, index)}
                                                className="form-control input-styled"
                                                placeholder="e.g., Active"
                                                required
                                            />
                                        </div>
                                        <div className="col-12">
                                            <input
                                                type="text"
                                                name="address"
                                                value={child.address}
                                                onChange={(e) => handleChange(e, index)}
                                                className="form-control input-styled"
                                                placeholder="Enter address"
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2 mt-3">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm btn-update"
                                            onClick={() => handleUpdateSubmit(index)}
                                        >
                                            Update
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(index)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </>
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