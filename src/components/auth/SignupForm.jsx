import React from 'react';

const SignupForm = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add signup logic here
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control" placeholder="Enter your name" required />
            </div>
            <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" placeholder="Enter your email" required />
            </div>
            <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" placeholder="Enter your password" required />
                <small className="form-text text-muted">
                    Minimum 8 characters, at least one symbol (e.g., @, !)
                </small>
            </div>
            <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input type="password" className="form-control" placeholder="Re-enter your password" required />
            </div>
            <div className="mb-4">
                <label className="form-label">Location <small>(optional)</small></label>
                <select className="form-select">
                    <option value="">Select a location</option>
                    <option value="LienChieu">Lien Chieu</option>
                    {/* Add more options as needed */}
                </select>
            </div>
            <button type="submit" className="btn btn-primary w-100">Sign Up</button>
        </form>
    );
};

export default SignupForm;