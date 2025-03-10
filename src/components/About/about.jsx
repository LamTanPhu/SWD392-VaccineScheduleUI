import React from 'react';
import './About.css'; // Assuming you have a separate CSS file

export default function About() {
    // Function to handle smooth scrolling
    const handleNavigation = (e, sectionId) => {
        e.preventDefault();
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <div className="container py-5">
                {/* Hero Section */}
                <section className="text-center mb-5">
                    <h1 className="display-4 text-primary fw-bold border-bottom border-2 border-primary pb-2 mb-4 w-auto mx-auto">
                        About Us
                    </h1>
                    <p className="lead text-muted">
                        Welcome to VaccineVN, your trusted partner in managing and scheduling vaccinations with ease and safety. We are committed to empowering parents and caregivers with a seamless platform to protect children from preventable diseases across Vietnam.
                    </p>
                </section>

                {/* Commitment Section with Navigation Links */}
                <section className="mb-5" id="commitment-section">
                    <h2 className="h3 fw-semibold text-dark mb-4">Our Commitment</h2>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                        <a
                            href="#vaccine-coverage"
                            className="col navigation-box text-decoration-none"
                            onClick={(e) => handleNavigation(e, 'vaccine-coverage')}
                        >
                            <div className="w-100 h-100 rounded-3 p-4 text-center commitment-card">
                                <i className="far fa-check-circle fa-3x mb-3"></i>
                                <h4 className="fw-medium text-dark mb-2">Reliable Scheduling</h4>
                                <p className="text-muted small mb-0">
                                    Ensure timely vaccinations with our intuitive system.
                                </p>
                            </div>
                        </a>
                        <a
                            href="#infrastructure"
                            className="col navigation-box text-decoration-none"
                            onClick={(e) => handleNavigation(e, 'infrastructure')}
                        >
                            <div className="w-100 h-100 rounded-3 p-4 text-center commitment-card">
                                <i className="fas fa-shield-alt fa-3x mb-3"></i>
                                <h4 className="fw-medium text-dark mb-2">Safety First</h4>
                                <p className="text-muted small mb-0">
                                    Partnered with certified providers for safety.
                                </p>
                            </div>
                        </a>
                        <a
                            href="#expert-care"
                            className="col navigation-box text-decoration-none"
                            onClick={(e) => handleNavigation(e, 'expert-care')}
                        >
                            <div className="w-100 h-100 rounded-3 p-4 text-center commitment-card">
                                <i className="fas fa-user-md fa-3x mb-3"></i>
                                <h4 className="fw-medium text-dark mb-2">Expert Support</h4>
                                <p className="text-muted small mb-0">
                                    Access to experienced staff for guidance.
                                </p>
                            </div>
                        </a>
                        <a
                            href="#affordability"
                            className="col navigation-box text-decoration-none"
                            onClick={(e) => handleNavigation(e, 'affordability')}
                        >
                            <div className="w-100 h-100 rounded-3 p-4 text-center commitment-card">
                                <i className="fas fa-laptop fa-3x mb-3"></i>
                                <h4 className="fw-medium text-dark mb-2">User-Friendly</h4>
                                <p className="text-muted small mb-0">
                                    Designed for parents with a simple interface.
                                </p>
                            </div>
                        </a>
                    </div>
                </section>

                {/* Detailed Sections */}
                <section className="mb-5" id="detailed-sections">
                    <h2 className="h3 fw-semibold text-dark mb-4">What Sets Us Apart</h2>
                    <div className="row g-4">
                        {/* Section 1: Vaccine Coverage */}
                        <div className="col-12" id="vaccine-coverage">
                            <div className="card shadow-sm border-0">
                                <div className="card-body">
                                    <h3 className="h5 fw-semibold text-dark mb-3">Comprehensive Vaccine Coverage</h3>
                                    <p className="text-muted mb-3">
                                        VaccineVN offers a wide range of over 50 vaccines, safeguarding children against more than 40 diseases. We prioritize availability of cutting-edge and hard-to-find vaccines, including:
                                    </p>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item bg-transparent border-0 ps-0">
                                            Collaborations with industry leaders like Pfizer and Sanofi.
                                        </li>
                                        <li className="list-group-item bg-transparent border-0 ps-0">
                                            Options like Prevenar 13 and Bexsero for critical protection.
                                        </li>
                                        <li className="list-group-item bg-transparent border-0 ps-0">
                                            Consistent pricing to support every family.
                                        </li>
                                    </ul>
                                    <div className="text-center mt-3">
                                        <img
                                            className="img-fluid rounded"
                                            src="https://vnvc.vn/wp-content/uploads/2024/05/kho-lanh-bao-quan-vac-xin-cua-vnvc.jpg"
                                            alt="Vaccine Storage Facility"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Infrastructure */}
                        <div className="col-12" id="infrastructure">
                            <div className="card shadow-sm border-0">
                                <div className="card-body">
                                    <h3 className="h5 fw-semibold text-dark mb-3">Advanced Infrastructure</h3>
                                    <p className="text-muted mb-3">
                                        Our platform leverages Vietnam’s premier Cold Chain network, maintaining vaccine quality with GSP-compliant storage and distribution.
                                    </p>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item bg-transparent border-0 ps-0">
                                            Coverage across 100+ centers in 55 provinces.
                                        </li>
                                        <li className="list-group-item bg-transparent border-0 ps-0">
                                            State-of-the-art cold storage technology.
                                        </li>
                                        <li className="list-group-item bg-transparent border-0 ps-0">
                                            Partnerships with global vaccine giants.
                                        </li>
                                    </ul>
                                    <div className="text-center mt-3">
                                        <img
                                            className="img-fluid rounded"
                                            src="https://vnvc.vn/wp-content/uploads/2024/05/kho-lanh-bao-quan-vac-xin-cua-vnvc.jpg"
                                            alt="Cold Chain Storage"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Expert Care */}
                        <div className="col-12" id="expert-care">
                            <div className="card shadow-sm border-0">
                                <div className="card-body">
                                    <h3 className="h5 fw-semibold text-dark mb-3">Dedicated Expert Care</h3>
                                    <p className="text-muted mb-3">
                                        Connect with our team of certified medical professionals trained to ensure safe and comfortable vaccination experiences.
                                    </p>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item bg-transparent border-0 ps-0">
                                            Adherence to an 8-step safety protocol.
                                        </li>
                                        <li className="list-group-item bg-transparent border-0 ps-0">
                                            Round-the-clock post-vaccination support.
                                        </li>
                                        <li className="list-group-item bg-transparent border-0 ps-0">
                                            Precision in dosing and administration.
                                        </li>
                                    </ul>
                                    <div className="text-center mt-3">
                                        <img
                                            className="img-fluid rounded"
                                            src="https://vnvc.vn/wp-content/uploads/2025/02/vnvc-da-co-mat-tai-55-tinh-thanh.jpg"
                                            alt="Healthcare Team"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Affordability */}
                        <div className="col-12" id="affordability">
                            <div className="card shadow-sm border-0">
                                <div className="card-body">
                                    <h3 className="h5 fw-semibold text-dark mb-3">Affordable Vaccination Plans</h3>
                                    <p className="text-muted mb-3">
                                        We offer cost-effective solutions to ensure every child receives essential vaccinations without financial strain.
                                    </p>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item bg-transparent border-0 ps-0">
                                            Flexible payment options including 0% interest plans.
                                        </li>
                                        <li className="list-group-item bg-transparent border-0 ps-0">
                                            Stable pricing despite market fluctuations.
                                        </li>
                                        <li className="list-group-item bg-transparent border-0 ps-0">
                                            Free consultations and additional perks.
                                        </li>
                                    </ul>
                                    <div className="text-center mt-3">
                                        <img
                                            className="img-fluid rounded"
                                            src="https://vnvc.vn/wp-content/uploads/2024/05/kho-lanh-bao-quan-vac-xin-cua-vnvc.jpg"
                                            alt="Affordable Plans"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="text-center mb-5">
                    <h2 className="h3 fw-semibold text-dark mb-3">Join Us Today</h2>
                    <p className="text-muted mb-4">
                        Schedule your child’s vaccinations with confidence. Download our app or visit a center near you to get started!
                    </p>
                    <a href="/packages" className="btn btn-primary btn-lg">
                        Explore Packages
                    </a>
                </section>
            </div>
        </>
    );
}