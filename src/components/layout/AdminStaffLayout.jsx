import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './adminStaffLayout.css';

const AdminStaffLayout = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isVaccineMenuOpen, setIsVaccineMenuOpen] = useState(false);
    const [username, setUsername] = useState('Admin');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/auth');
            return;
        }
        try {
            const decoded = jwtDecode(token);
            const usernameClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
            setUsername(decoded[usernameClaim] || 'Admin');
        } catch (error) {
            console.error('Error decoding token:', error);
            navigate('/auth');
        }
    }, [navigate]);

    const handleThemeToggle = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const handleSidebarToggle = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const handleVaccineMenuToggle = () => {
        setIsVaccineMenuOpen(!isVaccineMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/auth');
    };

    const handleNotificationClick = () => {
        alert('No new notifications');
    };

    const getBreadcrumb = () => {
        const pathParts = location.pathname.split('/').filter((part) => part);
        return pathParts.map((part, index) => ({
            name: part.charAt(0).toUpperCase() + part.slice(1),
            path: `/${pathParts.slice(0, index + 1).join('/')}`,
        }));
    };

    return (
        <div className="d-flex min-vh-100 admin-layout" data-theme={theme}>
            {/* Sidebar */}
            <div className={`sidebar text-white ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header p-3 d-flex justify-content-between align-items-center">
                    <Link to="/admin" className="text-white text-decoration-none">
                        <span className="fs-4 fw-bold sidebar-logo">
                            <i className="fas fa-syringe me-2"></i>
                            VaccineVN Admin
                        </span>
                    </Link>
                    <button
                        className="btn btn-link text-white p-0"
                        onClick={handleSidebarToggle}
                        aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <i className={`fas ${isSidebarCollapsed ? 'fa-arrow-right' : 'fa-arrow-left'}`}></i>
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
                                <i className="fas fa-home me-2"></i>
                                <span>{!isSidebarCollapsed && 'Dashboard'}</span>
                            </Link>
                        </li>
                        {/* Vaccines with Submenu */}
                        <li className="mb-3">
                            <div
                                className={`text-white text-decoration-none sidebar-link ${
                                    location.pathname.startsWith('/admin/vaccines') ||
                                    location.pathname === '/admin/batches' ||
                                    location.pathname === '/admin/categories'
                                        ? 'active'
                                        : ''
                                }`}
                                onClick={handleVaccineMenuToggle}
                                style={{ cursor: 'pointer' }}
                            >
                                <i className="fas fa-syringe me-2"></i>
                                <span>{!isSidebarCollapsed && 'Vaccines'}</span>
                                {!isSidebarCollapsed && (
                                    <i
                                        className={`fas ${
                                            isVaccineMenuOpen ? 'fa-chevron-down' : 'fa-chevron-right'
                                        } float-end`}
                                    ></i>
                                )}
                            </div>
                            {isVaccineMenuOpen && !isSidebarCollapsed && (
                                <ul className="list-unstyled submenu ms-4 mt-2">
                                    <li className="mb-2">
                                        <Link
                                            to="/admin/vaccines"
                                            className={`text-white text-decoration-none sidebar-link ${
                                                location.pathname === '/admin/vaccines' ? 'active' : ''
                                            }`}
                                        >
                                            <i className="fas fa-vial me-2"></i>
                                            Vaccines
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link
                                            to="/admin/batches"
                                            className={`text-white text-decoration-none sidebar-link ${
                                                location.pathname === '/admin/batches' ? 'active' : ''
                                            }`}
                                        >
                                            <i className="fas fa-boxes me-2"></i>
                                            Batches
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link
                                            to="/admin/categories"
                                            className={`text-white text-decoration-none sidebar-link ${
                                                location.pathname === '/admin/categories' ? 'active' : ''
                                            }`}
                                        >
                                            <i className="fas fa-tags me-2"></i>
                                            Categories
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li className="mb-3">
                            <Link
                                to="/admin/schedules"
                                className={`text-white text-decoration-none sidebar-link ${
                                    location.pathname === '/admin/schedules' ? 'active' : ''
                                }`}
                            >
                                <i className="fas fa-calendar me-2"></i>
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
                                <i className="fas fa-users me-2"></i>
                                <span>{!isSidebarCollapsed && 'Users'}</span>
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link
                                to="/admin/orders"
                                className={`text-white text-decoration-none sidebar-link ${
                                    location.pathname === '/admin/orders' ? 'active' : ''
                                }`}
                            >
                                <i className="fas fa-shopping-cart me-2"></i>
                                <span>{!isSidebarCollapsed && 'Orders'}</span>
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link
                                to="/admin/vaccine-history"
                                className={`text-white text-decoration-none sidebar-link ${
                                    location.pathname === '/admin/vaccine-history' ? 'active' : ''
                                }`}
                            >
                                <i className="fas fa-history me-2"></i>
                                <span>{!isSidebarCollapsed && 'Vaccine History'}</span>
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link
                                to="/admin/profile"
                                className={`text-white text-decoration-none sidebar-link ${
                                    location.pathname === '/admin/profile' ? 'active' : ''
                                }`}
                            >
                                <i className="fas fa-user me-2"></i>
                                <span>{!isSidebarCollapsed && 'Profile'}</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="sidebar-footer p-3">
                    <button className="btn btn-outline-light w-100" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt me-2"></i>
                        <span>{!isSidebarCollapsed && 'Logout'}</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow-1 content-area">
                <header className="admin-header">
                    <div className="container py-2">
                        <div className="d-flex align-items-center justify-content-between w-100">
                            <button
                                className="btn btn-outline-primary sidebar-toggle"
                                onClick={handleSidebarToggle}
                                aria-label={isSidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
                            >
                                <i className={`fas ${isSidebarCollapsed ? 'fa-arrow-right' : 'fa-bars'}`}></i>
                            </button>
                            <div className="d-flex align-items-center justify-content-end gap-3">
                                <button
                                    className="btn btn-outline-primary position-relative rounded-circle"
                                    onClick={handleNotificationClick}
                                >
                                    <i className="fas fa-bell"></i>
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        0
                                        <span className="visually-hidden">unread notifications</span>
                                    </span>
                                </button>
                                <button
                                    className="btn btn-outline-primary rounded-circle"
                                    onClick={handleThemeToggle}
                                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                                >
                                    <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
                                </button>
                                <div className="dropdown">
                                    <button
                                        className="btn btn-outline-primary dropdown-toggle rounded-pill d-flex align-items-center"
                                        type="button"
                                        id="adminAuthDropdown"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <i className="fas fa-heartbeat me-2"></i>
                                        <span className="fw-bold">{username}</span>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="adminAuthDropdown">
                                        <li>
                                            <Link to="/admin/profile" className="dropdown-item">
                                                Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <button className="dropdown-item" onClick={handleLogout}>
                                                Sign Out
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="admin-subheader">
                    <div className="container py-2">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0">
                                {getBreadcrumb().map((crumb, index) => (
                                    <li
                                        key={crumb.path}
                                        className={`breadcrumb-item ${
                                            index === getBreadcrumb().length - 1 ? 'active' : ''
                                        }`}
                                    >
                                        {index === getBreadcrumb().length - 1 ? (
                                            crumb.name
                                        ) : (
                                            <Link to={crumb.path} className="text-muted">
                                                {crumb.name}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    </div>
                </div>

                <main className="p-4 content-fade">{children}</main>
                <footer className="bg-light text-center py-2">
                    <small>© {new Date().getFullYear()} VaccineVN. All rights reserved.</small>
                </footer>
            </div>
        </div>
    );
};

export default AdminStaffLayout;