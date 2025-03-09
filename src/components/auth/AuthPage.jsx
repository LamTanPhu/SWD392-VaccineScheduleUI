import React, { useState } from 'react';
import AuthImage from './AuthImage';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import './auth.css';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    const handleSwitchChange = () => {
        setIsLogin((prev) => !prev);
    };

    return (
        <div className="d-flex align-items-center min-vh-100 bg-light">
            <AuthImage />
            <div className="w-50 px-5 mx-auto auth-container">
                <div className="card shadow-sm p-4">
                    {/* Custom Toggle Switch */}
                    <div className="auth-toggle-container mb-4">
                        <div className="auth-toggle">
                            <div className={`auth-toggle-slider ${isLogin ? 'slide-left' : 'slide-right'}`}></div>
                            <button
                                className={`auth-toggle-option ${isLogin ? 'active' : ''}`}
                                onClick={() => setIsLogin(true)}
                            >
                                Sign In
                            </button>
                            <button
                                className={`auth-toggle-option ${!isLogin ? 'active' : ''}`}
                                onClick={() => setIsLogin(false)}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                    <h2 className="fw-bold mb-3 text-center">
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </h2>
                    <p className="text-muted text-center mb-4">
                        {isLogin ? 'Access your vaccine schedule' : 'Create an account to get started'}
                    </p>
                    {isLogin ? <LoginForm /> : <SignupForm />}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;