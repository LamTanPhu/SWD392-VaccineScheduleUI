import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

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
                    VaccineCenter: response.data.vaccineCenter,
                    ChildrenProfiles: response.data.childrenProfiles
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
        <div className="profile-page">
            <h1 className="mb-4 text-primary">User Profile</h1>
            <div className="card shadow-sm">
                <div className="card-body">
                    <h5 className="card-title">Welcome, {profile.Username}</h5>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <p><strong>Email:</strong> {profile.Email}</p>
                            <p><strong>Role:</strong> {profile.Role}</p>
                            <p><strong>Status:</strong> {profile.Status}</p>
                            {profile.VaccineCenter && (
                                <p><strong>Vaccine Center:</strong> {profile.VaccineCenter}</p>
                            )}
                        </div>
                        {profile.ChildrenProfiles && profile.ChildrenProfiles.length > 0 && (
                            <div className="col-md-6">
                                <h6 className="fw-bold mb-3">Children Profiles</h6>
                                <ul className="list-group">
                                    {profile.ChildrenProfiles.map((child, index) => (
                                        <li key={index} className="list-group-item">
                                            <p><strong>Name:</strong> {child.Name || 'N/A'}</p>
                                            {child.Age && <p><strong>Age:</strong> {child.Age}</p>}
                                            {child.VaccinationStatus && (
                                                <p><strong>Vaccination Status:</strong> {child.VaccinationStatus}</p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <button 
                    className="btn btn-outline-primary me-2 btn-grow"
                    onClick={() => navigate('/edit-profile')}
                >
                    Edit Profile
                </button>
                <button 
                    className="btn btn-outline-secondary btn-grow"
                    onClick={() => navigate('/')}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

// Optional: Add some custom CSS in your layout.css or a new profile.css
const profileStyles = `
    .profile-page .card {
        border-radius: 10px;
        transition: transform 0.2s;
    }
    .profile-page .card:hover {
        transform: translateY(-5px);
    }
    .profile-page .list-group-item {
        border-radius: 5px;
        margin-bottom: 10px;
    }
    .btn-grow {
        transition: transform 0.2s;
    }
    .btn-grow:hover {
        transform: scale(1.05);
    }
`;

// If you're using a separate CSS file, you can add this
// Or include it in your existing layout.css

export default Profile;