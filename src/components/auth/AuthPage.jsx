import React, { useState, useEffect } from 'react';
import AuthImage from './AuthImage';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import './auth.css';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleSwitchChange = () => {
        if (isAnimating) return;
        
        setIsAnimating(true);
        // First fade out the content
        const content = document.querySelectorAll('.auth-content');
        content.forEach(el => el.classList.add('fade-out'));

        // After content fades out, trigger the slide
        setTimeout(() => {
            setIsLogin(prev => !prev);
            // Remove fade-out class after animation completes
            setTimeout(() => {
                content.forEach(el => el.classList.remove('fade-out'));
                setIsAnimating(false);
            }, 500);
        }, 300);
    };

    return (
        <div className="auth-page-container min-vh-100 bg-light">
            <div className="container py-5">
                <div className={`auth-container row g-0 shadow-lg rounded-3 overflow-hidden ${isLogin ? 'slide-login' : 'slide-signup'}`}>
                    <div className="col-md-6 position-relative">
                        <div className="auth-form-container p-4 p-md-5">
                            <div className="auth-content">
                                <div className="text-center mb-4">
                                    <h2 className="h3 text-primary fw-bold mb-2">
                                        {isLogin ? 'Welcome Back!' : 'Join VaccineVN'}
                                    </h2>
                                    <p className="text-muted">
                                        {isLogin 
                                            ? 'Access your vaccination schedule and records' 
                                            : 'Create an account to manage vaccinations for you and your family'}
                                    </p>
                                </div>

                                <div className="auth-toggle-container mb-4">
                                    <div className="btn-group w-100" role="group">
                                        <button
                                            type="button"
                                            className={`btn ${isLogin ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => !isLogin && handleSwitchChange()}
                                            disabled={isAnimating}
                                        >
                                            Sign In
                                        </button>
                                        <button
                                            type="button"
                                            className={`btn ${!isLogin ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => isLogin && handleSwitchChange()}
                                            disabled={isAnimating}
                                        >
                                            Sign Up
                                        </button>
                                    </div>
                                </div>

                                {isLogin ? <LoginForm /> : <SignupForm />}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="auth-content">
                            <AuthImage isLogin={isLogin} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;