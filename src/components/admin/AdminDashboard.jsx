// src/components/admin/AdminDashboard.jsx
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
    FaUsers, 
    FaSyringe, 
    FaCalendarAlt, 
    FaShoppingCart 
} from 'react-icons/fa';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement, // For Pie chart
    Title,
    Tooltip,
    Legend 
} from 'chart.js';
import './AdminDashboard.css';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    const dashboardStats = {
        totalUsers: 150,
        totalVaccines: 45,
        pendingOrders: 12,
        scheduledAppointments: 28
    };

    // Main chart data (Orders Over Time - Full Width)
    const mainOrderData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Orders',
            data: [12, 19, 3, 5, 2, 15, 25, 30, 22, 18, 10, 28],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.3
        }]
    };

    // Vaccine Distribution (Bar)
    const vaccineData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Vaccine Distribution',
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1
        }]
    };

    // Vaccine Type Distribution (Pie)
    const vaccineTypeData = {
        labels: ['Pfizer', 'Moderna', 'AstraZeneca', 'Johnson & Johnson'],
        datasets: [{
            label: 'Vaccine Types',
            data: [40, 30, 20, 10],
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 206, 86)',
                'rgb(75, 192, 192)'
            ],
            borderWidth: 1
        }]
    };

    // Appointment Trends (Bar)
    const appointmentData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
            label: 'Appointments',
            data: [25, 35, 20, 30],
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
            borderColor: 'rgb(153, 102, 255)',
            borderWidth: 1
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: true }
        }
    };

    const pieOptions = {
        ...chartOptions,
        plugins: {
            ...chartOptions.plugins,
            legend: { position: 'right' } // Better for Pie charts
        }
    };

    return (
        <Container fluid className="py-4">
            <h2 className="mb-4">Admin Dashboard</h2>

            {/* Main Full-Width Chart */}
            <Row className="mb-5">
                <Col md={12}>
                    <Card>
                        <Card.Header>
                            <h5>Orders Throughout the Year</h5>
                        </Card.Header>
                        <Card.Body style={{ height: '400px' }}>
                            <Line 
                                data={mainOrderData} 
                                options={{ 
                                    ...chartOptions, 
                                    plugins: { 
                                        ...chartOptions.plugins, 
                                        title: { text: 'Annual Order Trends' } 
                                    }
                                }}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Stats Cards */}
            <Row className="mb-5">
                <Col md={3}>
                    <Card className="h-100">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <FaUsers size={30} className="me-3 text-primary" />
                                <div>
                                    <Card.Title>{dashboardStats.totalUsers}</Card.Title>
                                    <Card.Text>Total Users</Card.Text>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="h-100">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <FaSyringe size={30} className="me-3 text-success" />
                                <div>
                                    <Card.Title>{dashboardStats.totalVaccines}</Card.Title>
                                    <Card.Text>Vaccines Available</Card.Text>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="h-100">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <FaShoppingCart size={30} className="me-3 text-warning" />
                                <div>
                                    <Card.Title>{dashboardStats.pendingOrders}</Card.Title>
                                    <Card.Text>Pending Orders</Card.Text>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="h-100">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <FaCalendarAlt size={30} className="me-3 text-info" />
                                <div>
                                    <Card.Title>{dashboardStats.scheduledAppointments}</Card.Title>
                                    <Card.Text>Appointments</Card.Text>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Secondary Charts */}
            <Row className="mb-5">
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <h5>Weekly Vaccine Distribution</h5>
                        </Card.Header>
                        <Card.Body style={{ height: '300px' }}>
                            <Bar 
                                data={vaccineData} 
                                options={{ 
                                    ...chartOptions, 
                                    plugins: { 
                                        ...chartOptions.plugins, 
                                        title: { text: 'Weekly Vaccine Distribution' } 
                                    }
                                }}
                            />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <h5>Vaccine Type Distribution</h5>
                        </Card.Header>
                        <Card.Body style={{ height: '300px' }}>
                            <Pie 
                                data={vaccineTypeData} 
                                options={{ 
                                    ...pieOptions, 
                                    plugins: { 
                                        ...pieOptions.plugins, 
                                        title: { text: 'Vaccine Type Breakdown' } 
                                    }
                                }}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <h5>Monthly Appointment Trends</h5>
                        </Card.Header>
                        <Card.Body style={{ height: '300px' }}>
                            <Bar 
                                data={appointmentData} 
                                options={{ 
                                    ...chartOptions, 
                                    plugins: { 
                                        ...chartOptions.plugins, 
                                        title: { text: 'Appointments per Week' } 
                                    }
                                }}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions */}
            <Row>
                <Col md={3}>
                    <Button as={Link} to="/admin/vaccines" variant="primary" className="w-100 mb-3">
                        <FaSyringe className="me-2" /> Manage Vaccines
                    </Button>
                </Col>
                <Col md={3}>
                    <Button as={Link} to="/admin/orders" variant="primary" className="w-100 mb-3">
                        <FaShoppingCart className="me-2" /> View Orders
                    </Button>
                </Col>
                <Col md={3}>
                    <Button as={Link} to="/admin/schedules" variant="primary" className="w-100 mb-3">
                        <FaCalendarAlt className="me-2" /> Manage Schedules
                    </Button>
                </Col>
                <Col md={3}>
                    <Button as={Link} to="/admin/users" variant="primary" className="w-100 mb-3">
                        <FaUsers className="me-2" /> Manage Users
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;