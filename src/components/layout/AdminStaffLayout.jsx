import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './adminStaffLayout.css';

const AdminStaffLayout = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState('Admin');

    React.useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const usernameClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
                setUsername(decoded[usernameClaim] || 'Admin');
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/auth');
    };

    // Placeholder for notification click (can be expanded later)
    const handleNotificationClick = () => {
        alert('No new notifications');
    };

    return (
        <div className="d-flex min-vh-100 admin-layout">
            {/* Sidebar */}
            <div className={`sidebar text-white ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header p-3 d-flex justify-content-between align-items-center">
                    <Link to="/admin" className="text-white text-decoration-none">
                        <span className="fs-4 fw-bold sidebar-logo">
                            <i className="bi bi-syringe me-2"></i>
                            VaccineVN Admin
                        </span>
                    </Link>
                    <button
                        className="btn btn-link text-white p-0"
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    >
                        <i className={`bi ${isSidebarCollapsed ? 'bi-arrow-right' : 'bi-arrow-left'}`}></i>
                    </button>
                </div>
                <nav className="sidebar-nav p-3">
                    <ul className="list-unstyled">
                        <li className="mb-3">
                            <Link
                                to="/admin/dashboard"
                                className={`text-white text-decoration-none sidebar-link ${
                                    location.pathname === '/admin/dashboard' ? 'active' : ''
                                }`}
                            >
                                <i className="bi bi-house-door me-2"></i>
                                <span>{!isSidebarCollapsed && 'Dashboard'}</span>
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link
                                to="/admin/vaccines"
                                className={`text-white text-decoration-none sidebar-link ${
                                    location.pathname === '/admin/vaccines' ? 'active' : ''
                                }`}
                            >
                                <i className="bi bi-syringe me-2"></i>
                                <span>{!isSidebarCollapsed && 'Vaccines'}</span>
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link
                                to="/admin/schedules"
                                className={`text-white text-decoration-none sidebar-link ${
                                    location.pathname === '/admin/schedules' ? 'active' : ''
                                }`}
                            >
                                <i className="bi bi-calendar me-2"></i>
                                <span>{!isSidebarCollapsed && 'Schedules'}</span>
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link
                                to="/admin/users"
                                className={`text-white text-decoration-none sidebar-link ${
                                    location.pathname === '/admin/users' ? 'active' : ''
                                }`}
                            >
                                <i className="bi bi-people me-2"></i>
                                <span>{!isSidebarCollapsed && 'Users'}</span>
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link
                                to="/admin/settings"
                                className={`text-white text-decoration-none sidebar-link ${
                                    location.pathname === '/admin/settings' ? 'active' : ''
                                }`}
                            >
                                <i className="bi bi-gear me-2"></i>
                                <span>{!isSidebarCollapsed && 'Settings'}</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="sidebar-footer p-3">
                    <button className="btn btn-outline-light w-100" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        <span>{!isSidebarCollapsed && 'Logout'}</span>
                    </button>
                </div>
            </div>

            {/* Main Content with Updated Header */}
            <div className="flex-grow-1 content-area">
                <header className="admin-header">
                    <div className="container py-2">
                        <div className="d-flex align-items-center justify-content-end gap-3">
                            {/* Notification Bell */}
                            <button
                                className="btn btn-outline-primary position-relative rounded-circle"
                                onClick={handleNotificationClick}
                            >
                                <i className="bi bi-bell"></i>
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    3
                                    <span className="visually-hidden">unread notifications</span>
                                </span>
                            </button>
                            {/* User Dropdown */}
                            <div className="dropdown">
                                <button
                                    className="btn btn-outline-primary dropdown-toggle rounded-pill d-flex align-items-center"
                                    type="button"
                                    id="adminAuthDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="bi bi-heart-pulse me-2"></i>
                                    <span className="fw-bold">{username}</span>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="adminAuthDropdown">
                                    <li>
                                        <button className="dropdown-item" onClick={handleLogout}>
                                            Sign Out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-4 content-fade">{children}</main>

                <footer className="bg-light text-center py-2">
                    <small>© {new Date().getFullYear()} VaccineVN. All rights reserved.</small>
                </footer>
            </div>
        </div>
    );
};

export default AdminStaffLayout;