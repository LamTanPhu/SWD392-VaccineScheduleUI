import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './EditProfile.css';

const EditProfile = () => {
    const [formData, setFormData] = useState({
        username: '',
        phoneNumber: '',
        imageProfile: '',
        vaccineCenterId: ''
    });
    const [vaccineCenters, setVaccineCenters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileResponse = await api.get('/api/users/profile');
                const data = profileResponse.data;
                setFormData({
                    username: data.username || '',
                    phoneNumber: data.phoneNumber || '',
                    imageProfile: data.imageProfile || '',
                    vaccineCenterId: data.vaccineCenter?.id || ''
                });

                const centersResponse = await api.get('/api/VaccineCenters/public');
                setVaccineCenters(centersResponse.data);

                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.Message || 'Failed to load data');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const payload = {
            username: formData.username.trim() || null,
            phoneNumber: formData.phoneNumber.trim() || '',
            imageProfile: formData.imageProfile.trim() || '',
            vaccineCenterId: formData.vaccineCenterId || null
        };

        console.log("Sending payload:", payload);

        try {
            const response = await api.put('/api/users/update-profile', payload, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log("Update succeeded:", response.data);

            // Dispatch event with updated username
            const updatedUsername = response.data.username || formData.username.trim() || 'User';
            window.dispatchEvent(new CustomEvent('profileUpdated', { detail: { username: updatedUsername } }));

            navigate('/profile');
        } catch (err) {
            console.error("Update failed:", {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message
            });
            setError(err.response?.data?.Message || 'Failed to update profile');
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

    if (error) {
        return (
            <div className="alert alert-danger text-center" role="alert">
                {error}
                <button className="btn btn-link" onClick={() => navigate('/profile')}>
                    Back to Profile
                </button>
            </div>
        );
    }

    return (
        <div className="edit-profile-page container py-2">
            <h1 className="text-gradient text-center mb-4">Edit Profile</h1>
            <div className="card edit-profile-card shadow-lg mx-auto">
                <div className="card-header bg-primary text-white">
                    <h5>Edit Your Profile</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Enter username (optional)"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Profile Image URL</label>
                            <input
                                type="text"
                                name="imageProfile"
                                value={formData.imageProfile}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Enter image URL"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Vaccine Center</label>
                            <select
                                name="vaccineCenterId"
                                value={formData.vaccineCenterId}
                                onChange={handleChange}
                                className="form-control"
                            >
                                <option value="">None</option>
                                {vaccineCenters.map((center) => (
                                    <option key={center.id} value={center.id}>
                                        {center.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary btn-animated">
                            Save Changes
                        </button>
                    </form>
                </div>
                <div className="card-footer bg-light d-flex justify-content-end">
                    <button
                        className="btn btn-outline-secondary btn-animated"
                        onClick={() => navigate('/profile')}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;