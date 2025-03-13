import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const LoginForm = () => {
    const [formData, setFormData] = useState({
        usernameOrEmail: "",
        password: "",
        rememberMe: false,
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
        }));
    };

    const decodeToken = (token) => {
        try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        return JSON.parse(jsonPayload);
        } catch (err) {
        console.error("Error decoding token:", err);
        return {};
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
        const response = await api.post("/api/authentication/login", {
            usernameOrEmail: formData.usernameOrEmail,
            password: formData.password,
        });
        console.log("API Response:", response.data);

        const { id, token } = response.data;
        let role;

        if (token) {
            const decodedToken = decodeToken(token);
            role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            console.log("Decoded role from token:", role);
        } else {
            console.error("No token in response");
            role = response.data.role || "Unknown";
        }

        if (!id) {
            throw new Error("AccountId not found in login response. Please check backend configuration.");
        }

        localStorage.setItem("authToken", token);
        localStorage.setItem("userRole", role);
        localStorage.setItem("accountId", id); // Store the id directly from response
        console.log("localStorage after login:", {
            authToken: localStorage.getItem("authToken"),
            userRole: localStorage.getItem("userRole"),
            accountId: localStorage.getItem("accountId"),
        });

        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
            if (role === "Admin" || role === "Staff") {
            window.location.href = "/admin";
            } else {
            window.location.href = "/";
            }
        }, 1500);
        } catch (err) {
        setError(err.response?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <button
            type="button"
            className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2 w-100 mb-4"
            onClick={() => alert("Google login not implemented yet.")}
        >
            <i className="fa-brands fa-google me-2"></i>
            <span>Continue with Google</span>
        </button>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="mb-3">
            <label className="form-label">Email</label>
            <input
            type="text"
            name="usernameOrEmail"
            className="form-control"
            placeholder="Enter your email or username"
            value={formData.usernameOrEmail}
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
        </div>
        <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
            <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
            </div>
            <Link to="/forgot-password" className="text-primary">Forgot password?</Link>
        </div>
        <button type="submit" className="btn btn-primary w-100">Sign In</button>
        </form>
    );
};

export default LoginForm;