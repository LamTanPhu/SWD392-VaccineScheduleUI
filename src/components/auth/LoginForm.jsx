import React from 'react';
import { Link } from 'react-router-dom';

const LoginForm = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add login logic here
    };

    return (
        <form onSubmit={handleSubmit}>
            <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2 w-100 mb-4" disabled>
                <i className="fa-brands fa-google me-2"></i>
                <span>Continue with Google</span>
            </button>
            <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" placeholder="Enter your email" required />
            </div>
            <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" placeholder="Enter your password" required />
            </div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="rememberMe" />
                    <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                </div>
                <Link to="/forgot-password" className="text-primary">Forgot password?</Link>
            </div>
            <button type="submit" className="btn btn-primary w-100">Sign In</button>
        </form>
    );
};

export default LoginForm;