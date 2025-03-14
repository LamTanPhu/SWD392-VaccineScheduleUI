import React, { useState } from 'react';
import api from '../api/axios';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        // Removed role and location
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        if (!/[!@#$%^&*]/.test(formData.password)) {
            setError('Password must contain at least one symbol (e.g., @, !).');
            return;
        }

        try {
            const response = await api.post('/api/authentication/register', {
                username: formData.fullName.replace(/\s+/g, '').toLowerCase(),
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                // Removed role, relying on backend default
            });
            setSuccess('Registration successful! Please sign in.');
            setFormData({
                fullName: '',
                email: '',
                password: '',
                confirmPassword: '',
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    placeholder="Enter your name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <small className="form-text text-muted">
                    Minimum 8 characters, at least one symbol (e.g., @, !)
                </small>
            </div>
            <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary w-100">Sign Up</button>
        </form>
    );
};

export default SignupForm;