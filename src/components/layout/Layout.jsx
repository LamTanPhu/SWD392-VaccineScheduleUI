import { jwtDecode } from 'jwt-decode'; // Use named import
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './layout.css';

const locations = {
    north: ["Bắc Giang", "Hà Nội", "Hải Phòng", "Yên Bái", "Hải Dương", "Phú Thọ"],
    central: ["Thanh Hóa", "Nghệ An", "Hà Tĩnh", "Quảng Bình", "Huế", "Đà Nẵng"],
    south: ["Hồ Chí Minh", "Bình Dương", "Đồng Nai", "Cần Thơ", "Vũng Tàu", "Long An"]
};

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log('Decoded Token:', decoded); // Debug: Confirm token structure
                const currentTime = Date.now() / 1000; // Current time in seconds
                if (decoded.exp < currentTime) {
                    // Token expired
                    localStorage.removeItem('token');
                    setIsLoggedIn(false);
                    setUsername('');
                } else {
                    setIsLoggedIn(true);
                    // Use the correct claim name from the token
                    const usernameClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
                    setUsername(decoded[usernameClaim] || 'User');
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                localStorage.removeItem('token');
                setIsLoggedIn(false);
                setUsername('');
            }
        } else {
            setIsLoggedIn(false);
            setUsername('');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUsername('');
        window.location.href = '/auth?mode=signin';
    };

    return (
        <header className="bg-white shadow-sm header-sticky">
            <div className="container py-3">
                <div className="d-flex flex-wrap align-items-center justify-content-between">
                    <div className="col-md-3 mb-2 mb-md-0">
                        <Link to="/" className="d-flex align-items-center text-decoration-none logo-pulse">
                            <span className="fs-3 fw-bold text-primary">VaccineVN</span>
                        </Link>
                    </div>
                    <nav className="col-md-6 d-flex justify-content-center gap-4">
                        <Link to="/" className="nav-link fw-medium text-dark nav-hover">Home</Link>
                        <Link to="/about" className="nav-link fw-medium text-dark nav-hover">About</Link>
                        <Link to="/vaccines" className="nav-link fw-medium text-dark nav-hover">Vaccines</Link>
                        <Link to="/packages" className="nav-link fw-medium text-dark nav-hover">Packages</Link>
                        <Link to="/pricing" className="nav-link fw-medium text-dark nav-hover">Pricing</Link>
                    </nav>
                    <div className="col-md-3 d-flex justify-content-end gap-3">
                        <Link to="/search" className="btn btn-outline-primary btn-grow">
                            <i className="bi bi-search me-1"></i> Search
                        </Link>
                        <div className="dropdown">
                            <button
                                className="btn btn-primary btn-grow dropdown-toggle"
                                type="button"
                                id="authDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {isLoggedIn ? `Welcome, ${username}` : 'Account'}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="authDropdown">
                                {isLoggedIn ? (
                                    <li>
                                        <button className="dropdown-item" onClick={handleLogout}>
                                            Sign Out
                                        </button>
                                    </li>
                                ) : (
                                    <>
                                        <li>
                                            <Link to="/auth?mode=signin" className="dropdown-item">
                                                Sign In
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/auth?mode=signup" className="dropdown-item">
                                                Sign Up
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

// Rest of Layout (Footer and main structure) remains unchanged
const Footer = () => (
    <footer className="bg-primary text-white py-5 footer-fade">
        <div className="container">
            <div className="row">
                <div className="col-md-4 mb-4 mb-md-0">
                    <Link to="/" className="d-flex align-items-center text-decoration-none mb-3 logo-pulse">
                        <span className="fs-3 fw-bold text-white">VaccineVN</span>
                    </Link>
                    <p className="fw-bold mb-2">VACCINE SCHEDULE FOR KIDS</p>
                    <p className="small">Open: 7:30 - 17:00 (No lunch break)</p>
                    <p className="small">Schedule vaccinations easily & safely</p>
                </div>
                <div className="col-md-5">
                    <div className="row">
                        {Object.entries(locations).map(([region, cities]) => (
                            <div key={region} className="col-4 mb-4 location-slide">
                                <h6 className="fw-bold text-uppercase mb-3">{`System ${region === 'north' ? 'North' : region === 'central' ? 'Central' : 'South'}`}</h6>
                                <ul className="list-unstyled small">
                                    {cities.map((city) => (
                                        <li key={city} className="mb-1">
                                            <Link to={`/locations/${city.toLowerCase().replace(/\s/g, '-')}`} className="text-white text-decoration-none link-hover">
                                                {city}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-md-3">
                    <h6 className="fw-bold mb-3">Quick Links</h6>
                    <ul className="list-unstyled small">
                        <li className="mb-2"><Link to="/privacy" className="text-white text-decoration-none link-hover">Privacy Policy</Link></li>
                        <li className="mb-2"><Link to="/survey" className="text-white text-decoration-none link-hover">Vaccination Survey</Link></li>
                        <li className="mb-2"><Link to="/payment-policy" className="text-white text-decoration-none link-hover">Payment Policy</Link></li>
                    </ul>
                    <h6 className="fw-bold mt-4 mb-2">Contact</h6>
                    <p className="small mb-0">VIETNAM VACCINE JOINT STOCK COMPANY</p>
                    <a href="mailto:vaccineschedulevip@gmail.com" className="text-white text-decoration-none small link-hover">
                        vaccineschedulevip@gmail.com
                    </a>
                </div>
            </div>
            <hr className="my-4 opacity-25" />
            <div className="text-center small footer-text-reveal">
                © {new Date().getFullYear()} VaccineVN. All rights reserved.
            </div>
        </div>
    </footer>
);

const Layout = ({ children }) => (
    <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1 content-fade">
            <div className="container py-5">
                {children}
            </div>
        </main>
        <Footer />
    </div>
);

export default Layout;