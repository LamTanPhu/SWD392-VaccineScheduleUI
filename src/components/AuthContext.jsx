import React, { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode'; // Install: npm install jwt-decode

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check for token on page load
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000; // Convert to seconds
                if (decoded.exp < currentTime) {
                    // Token expired, log out
                    logout();
                } else {
                    setIsAuthenticated(true);
                    setUser({ username: decoded[ClaimTypes.Name], role: decoded[ClaimTypes.Role] });
                }
            } catch (error) {
                console.error('Invalid token:', error);
                logout();
            }
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setIsAuthenticated(true);
        setUser({ username: decoded[ClaimTypes.Name], role: decoded[ClaimTypes.Role] });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};