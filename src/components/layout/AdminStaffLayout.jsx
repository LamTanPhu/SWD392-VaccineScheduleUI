import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './adminStaffLayout.css'; // Custom CSS for this layout

const AdminStaffLayout = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear token from localStorage (or wherever you store it)
        localStorage.removeItem('authToken');
        navigate('/auth'); // Redirect to auth page
    };

    return (
        <div className="d-flex min-vh-100">
            {/* Sidebar */}
            <div className={`sidebar bg-primary text-white ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header p-3">
                    <Link to="/admin" className="text-white text-decoration-none">
                        <span className="fs-4 fw-bold sidebar-logo">VaccineVN Admin</span>
                    </Link>
                    <button
                        className="btn btn-link text-white p-0 ms-2"
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    >
                        <i className={`bi ${isSidebarCollapsed ? 'bi-arrow-right' : 'bi-arrow-left'}`}></i>
                    </button>
                </div>
                <nav className="sidebar-nav p-3">
                    <ul className="list-unstyled">
                        <li className="mb-3">
                            <Link to="/admin/dashboard" className="text-white text-decoration-none sidebar-link">
                                <i className="bi bi-house-door me-2"></i>
                                {!isSidebarCollapsed && 'Dashboard'}
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link to="/admin/vaccines" className="text-white text-decoration-none sidebar-link">
                                <i className="bi bi-syringe me-2"></i>
                                {!isSidebarCollapsed && 'Vaccines'}
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link to="/admin/schedules" className="text-white text-decoration-none sidebar-link">
                                <i className="bi bi-calendar me-2"></i>
                                {!isSidebarCollapsed && 'Schedules'}
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link to="/admin/users" className="text-white text-decoration-none sidebar-link">
                                <i className="bi bi-people me-2"></i>
                                {!isSidebarCollapsed && 'Users'}
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link to="/admin/settings" className="text-white text-decoration-none sidebar-link">
                                <i className="bi bi-gear me-2"></i>
                                {!isSidebarCollapsed && 'Settings'}
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="sidebar-footer p-3">
                    <button className="btn btn-outline-light w-100" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        {!isSidebarCollapsed && 'Logout'}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow-1 content-area">
                <main className="p-4 content-fade">
                    {children}
                </main>
                <footer className="bg-light text-center py-2">
                    <small>&copy; {new Date().getFullYear()} VaccineVN. All rights reserved.</small>
                </footer>
            </div>
        </div>
    );
};

export default AdminStaffLayout;