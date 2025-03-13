import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './EditProfile.css';

const EditProfile = () => {
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        status: '',
        vaccineCenterId: ''
    });
    const [vaccineCenters, setVaccineCenters] = useState([]); // Updated to expect { id, name } objects
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch current profile (this still requires authentication)
                const profileResponse = await api.get('/api/users/profile');
                const currentProfile = profileResponse.data;
                setProfile({
                    username: currentProfile.username || '',
                    email: currentProfile.email || '',
                    status: currentProfile.status || '',
                    vaccineCenterId: currentProfile.vaccineCenter?.id || ''
                });

                // Fetch list of vaccine centers (using the public endpoint with simplified response)
                const centersResponse = await api.get('/api/VaccineCenters/public');
                setVaccineCenters(centersResponse.data); // Directly use the response data
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
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('/api/account/update-profile', {
                username: profile.username,
                email: profile.email,
                status: profile.status,
                vaccineCenterId: profile.vaccineCenterId || null
            });
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.Message || 'Failed to update profile');
        }
    };

    if (loading) {
        return <div className="text-center py-5">Loading...</div>;
    }

    if (error) {
        return <div className="alert alert-danger text-center">{error}</div>;
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
                                value={profile.username}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Status</label>
                            <select
                                name="status"
                                value={profile.status}
                                onChange={handleChange}
                                className="form-select"
                                required
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Vaccine Center</label>
                            <select
                                name="vaccineCenterId"
                                value={profile.vaccineCenterId}
                                onChange={handleChange}
                                className="form-select"
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