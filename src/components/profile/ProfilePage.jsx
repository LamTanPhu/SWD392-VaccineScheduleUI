import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        console.log('Profile useEffect triggered');
        const fetchProfile = async () => {
            try {
                console.log('Fetching profile...');
                const response = await api.get('/api/users/profile');
                console.log('Raw response:', response);
                console.log('Response data:', response.data);
                const formattedProfile = {
                    Username: response.data.username,
                    Email: response.data.email,
                    Role: response.data.role,
                    Status: response.data.status,
                    VaccineCenter: response.data.vaccineCenter, // Object with id, name, location, etc.
                    ChildrenProfiles: response.data.childrenProfiles // Array of objects
                };
                if (mounted) {
                    setProfile(formattedProfile);
                    setLoading(false);
                    console.log('Profile set, loading set to false:', formattedProfile);
                }
            } catch (err) {
                console.log('Fetch error:', err.response?.data || err.message, 'Status:', err.response?.status);
                if (mounted) {
                    setError(err.response?.data?.Message || 'Failed to load profile');
                    setLoading(false);
                }
            }
        };
        fetchProfile();
        return () => { mounted = false; };
    }, [navigate]);

    console.log('Rendering - loading:', loading, 'profile:', profile, 'error:', error);

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

    return (
        <div className="profile-page container py-2">
            <h1 className="mb-4 text-gradient text-center">User Profile</h1>
            <div className="card profile-card shadow-lg mx-auto">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Welcome, {profile.Username}</h5>
                    <span className="badge bg-light text-dark">{profile.Role}</span>
                </div>
                <div className="card-body">
                    <div className="row g-4 justify-content-center">
                        <div className="col-md-5">
                            <div className="profile-info">
                                <p className="info-item"><strong>Email:</strong> <span className="text-muted">{profile.Email}</span></p>
                                <p className="info-item"><strong>Status:</strong> <span className="text-success">{profile.Status}</span></p>
                                {profile.VaccineCenter && (
                                    <p className="info-item">
                                        <strong>Vaccine Center:</strong> 
                                        <span className="text-info">{profile.VaccineCenter.name}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="col-md-7">
                            <div className="children-section">
                                <h6 className="mb-3 text-primary">Children Profiles</h6>
                                {profile.ChildrenProfiles && profile.ChildrenProfiles.length > 0 ? (
                                    <div className="children-list">
                                        {profile.ChildrenProfiles.map((child, index) => (
                                            <div key={index} className="child-card mb-3 p-3 bg-light rounded">
                                                <p><strong>Name:</strong> {child.fullName || 'N/A'}</p>
                                                <p><strong>Date of Birth:</strong> {new Date(child.dateOfBirth).toLocaleDateString() || 'N/A'}</p>
                                                <p><strong>Gender:</strong> {child.gender || 'N/A'}</p>
                                                <p><strong>Status:</strong> {child.status || 'N/A'}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted">No children profiles available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer bg-light d-flex justify-content-end gap-2">
                    <button 
                        className="btn btn-outline-primary btn-animated"
                        onClick={() => navigate('/edit-profile')}
                    >
                        Edit Profile
                    </button>
                    <button 
                        className="btn btn-outline-secondary btn-animated"
                        onClick={() => navigate('/')}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;