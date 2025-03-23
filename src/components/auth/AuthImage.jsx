import React from 'react';
import LoginImage from '../../assets/images/login-vaccine.jpg';
import SignupImage from '../../assets/images/signup-vaccine.jpg';

const AuthImage = ({ isLogin }) => {
    const imageContent = isLogin ? {
        image: LoginImage,
        title: "Access Your Health Records",
        description: "Manage your vaccination schedule with ease and security"
    } : {
        image: SignupImage,
        title: "Start Your Health Journey",
        description: "Join thousands of families protecting their health through proper vaccination"
    };

    return (
        <div className="auth-image-container position-relative h-100">
            <img 
                src={imageContent.image} 
                alt="Healthcare" 
                className="w-100 h-100 object-fit-cover"
            />
            <div className="auth-image-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-white p-4">
                <div className="text-center">
                    <h3 className="fw-bold mb-3">{imageContent.title}</h3>
                    <p className="mb-0">{imageContent.description}</p>
                </div>
            </div>
        </div>
    );
};

export default AuthImage;