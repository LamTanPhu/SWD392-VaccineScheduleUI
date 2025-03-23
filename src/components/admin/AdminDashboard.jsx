// src/components/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import api from "../api/axios";
import './AdminDashboard.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const getRoleName = (roleNumber) => {
    const roleMap = { 0: 'Parent', 1: 'Admin', 2: 'Staff' };
    return roleMap[roleNumber] || 'Unknown';
};

const getRoleNumber = (roleName) => {
    const roleMap = { 'Parent': 0, 'Admin': 1, 'Staff': 2 };
    return roleMap[roleName] !== undefined ? roleMap[roleName] : 0;
};

const AdminDashboard = () => {
    const [overview, setOverview] = useState(null);
    const [revenueByDay, setRevenueByDay] = useState([]);
    const [revenueByMonth, setRevenueByMonth] = useState([]);
    const [revenueByYear, setRevenueByYear] = useState([]);
    const [vaccineCenters, setVaccineCenters] = useState([]);
    const [filteredRevenueByDay, setFilteredRevenueByDay] = useState([]);
    const [filteredRevenueByMonth, setFilteredRevenueByMonth] = useState([]);
    const [filteredRevenueByYear, setFilteredRevenueByYear] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(''); // Frontend-only filter for payment method
    const [paymentOptions, setPaymentOptions] = useState([]); // Unique payment methods
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Parent',
        status: 'Active',
        phoneNumber: '',
        imageProfile: '',
        vaccineCenterId: ''
    });
    const [error, setError] = useState('');
    const [dateRange, setDateRange] = useState({
        dayStart: '2025-03-17',
        dayEnd: '2025-03-29',
        monthYear: 2025,
        yearStart: 2024,
        yearEnd: 2025
    });

    // Fetch dashboard data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [overviewResponse, centersResponse] = await Promise.all([
                    api.get('/api/Dashboard/overview'),
                    api.get('/api/VaccineCenters')
                ]);
                setOverview(overviewResponse.data);
                setVaccineCenters(centersResponse.data);
                fetchRevenueData();
            } catch (err) {
                setError('Failed to fetch dashboard data');
                console.error(err);
                setOverview({
                    totalAccounts: 100,
                    adminAccounts: 5,
                    staffAccounts: 20,
                    parentAccounts: 75,
                    totalChildrenProfile: 150,
                    totalVaccineCenters: 10,
                    totalVaccinesAvailable: 500,
                    totalOrdersPaid: 80,
                    totalSchedule: 200
                });
                setVaccineCenters([{ id: '1', name: 'Center A' }, { id: '2', name: 'Center B' }]);
            }
        };
        fetchData();
    }, []);

    // Fetch revenue/order data
    const fetchRevenueData = async () => {
        try {
            const [dayResponse, monthResponse, yearResponse] = await Promise.all([
                api.get(`/api/Dashboard/revenue-orders/day?startDate=${dateRange.dayStart}&endDate=${dateRange.dayEnd}`),
                api.get(`/api/Dashboard/revenue-orders/month?year=${dateRange.monthYear}`),
                api.get(`/api/Dashboard/revenue-orders/year?startYear=${dateRange.yearStart}&endYear=${dateRange.yearEnd}`)
            ]);
            setRevenueByDay(dayResponse.data);
            setRevenueByMonth(monthResponse.data);
            setRevenueByYear(yearResponse.data);
            console.log('Raw revenueByYear from API:', yearResponse.data);
        } catch (err) {
            setError('Failed to fetch revenue data');
            console.error(err);
            setRevenueByDay([
                { period: '2025-03-17', totalOrders: 0, totalOrderAmount: 0, totalRevenue: 0, vaccineQuantity: 0, paymentName: 'N/A' },
                { period: '2025-03-18', totalOrders: 0, totalOrderAmount: 0, totalRevenue: 0, vaccineQuantity: 0, paymentName: 'N/A' },
                { period: '2025-03-19', totalOrders: 0, totalOrderAmount: 0, totalRevenue: 0, vaccineQuantity: 0, paymentName: 'N/A' },
                { period: '2025-03-20', totalOrders: 2, totalOrderAmount: 2500, totalRevenue: 2500, vaccineQuantity: 5, paymentName: 'Credit Card' },
                { period: '2025-03-21', totalOrders: 0, totalOrderAmount: 0, totalRevenue: 0, vaccineQuantity: 0, paymentName: 'N/A' },
                { period: '2025-03-22', totalOrders: 0, totalOrderAmount: 0, totalRevenue: 0, vaccineQuantity: 0, paymentName: 'N/A' },
                { period: '2025-03-23', totalOrders: 0, totalOrderAmount: 0, totalRevenue: 0, vaccineQuantity: 0, paymentName: 'N/A' },
                { period: '2025-03-24', totalOrders: 0, totalOrderAmount: 0, totalRevenue: 0, vaccineQuantity: 0, paymentName: 'N/A' },
                { period: '2025-03-25', totalOrders: 0, totalOrderAmount: 0, totalRevenue: 0, vaccineQuantity: 0, paymentName: 'N/A' },
                { period: '2025-03-26', totalOrders: 0, totalOrderAmount: 0, totalRevenue: 0, vaccineQuantity: 0, paymentName: 'N/A' },
                { period: '2025-03-27', totalOrders: 0, totalOrderAmount: 0, totalRevenue: 0, vaccineQuantity: 0, paymentName: 'N/A' },
                { period: '2025-03-28', totalOrders: 0, totalOrderAmount: 0, totalRevenue: 0, vaccineQuantity: 0, paymentName: 'N/A' },
                { period: '2025-03-29', totalOrders: 0, totalOrderAmount: 0, totalRevenue: 0, vaccineQuantity: 0, paymentName: 'N/A' }
            ]);
            setRevenueByMonth([
                { period: '2025-01', totalOrders: 0, totalOrderAmount: 0, totalRevenue: 0, vaccineQuantity: 0, paymentName: 'N/A' },
                { period: '2025-02', totalOrders: 0, totalOrderAmount: 0, totalRevenue: 0, vaccineQuantity: 0, paymentName: 'N/A' },
                { period: '2025-03', totalOrders: 50, totalOrderAmount: 5000, totalRevenue: 4500, vaccineQuantity: 200, paymentName: 'PayPal' },
                { period: '2025-04', totalOrders: 0, totalOrderAmount: 0, totalRevenue: 0, vaccineQuantity: 0, paymentName: 'N/A' },
                { period: '2025-05', totalOrders: 0, totalOrderAmount: 0, totalRevenue: 0, vaccineQuantity: 0, paymentName: 'N/A' },
                { period: '2025-06', totalOrders: 0, totalOrderAmount: 0, totalRevenue: 0, vaccineQuantity: 0, paymentName: 'N/A' },
                { period: '2025-07', totalOrders: 0, totalOrderAmount: 0, totalRevenue: 0, vaccineQuantity: 0, paymentName: 'N/A' },
                { period: '2025-08', totalOrders: 0, totalOrderAmount: 0, totalRevenue: 0, vaccineQuantity: 0, paymentName: 'N/A' },
                { period: '2025-09', totalOrders: 0, totalOrderAmount: 0, totalRevenue: 0, vaccineQuantity: 0, paymentName: 'N/A' },
                { period: '2025-10', totalOrders: 0, totalOrderAmount: 0, totalRevenue: 0, vaccineQuantity: 0, paymentName: 'N/A' },
                { period: '2025-11', totalOrders: 0, totalOrderAmount: 0, totalRevenue: 0, vaccineQuantity: 0, paymentName: 'N/A' },
                { period: '2025-12', totalOrders: 0, totalOrderAmount: 0, totalRevenue: 0, vaccineQuantity: 0, paymentName: 'N/A' }
            ]);
            setRevenueByYear([]);
            setPaymentOptions(['Credit Card', 'PayPal']);
        }
    };

    // Apply frontend filter whenever revenue data or selected payment changes
    useEffect(() => {
        const filterData = (data) => {
            if (!selectedPayment) return data;
            return data.map(item => {
                if (item.paymentName === selectedPayment) {
                    return item;
                }
                return {
                    ...item,
                    totalOrders: 0,
                    totalOrderAmount: 0,
                    totalRevenue: 0,
                    vaccineQuantity: 0,
                    paymentName: 'N/A'
                };
            });
        };

        const filteredDay = filterData(revenueByDay);
        const filteredMonth = filterData(revenueByMonth);
        const filteredYear = filterData(revenueByYear);

        // Validate data consistency
        filteredDay.forEach(item => {
            if (item.totalRevenue > 0 && item.totalOrders === 0) {
                console.warn(`Data inconsistency on ${item.period}: Revenue (${item.totalRevenue}) exists but Orders (${item.totalOrders}) is zero.`);
            }
        });
        filteredMonth.forEach(item => {
            if (item.totalRevenue > 0 && item.totalOrders === 0) {
                console.warn(`Data inconsistency on ${item.period}: Revenue (${item.totalRevenue}) exists but Orders (${item.totalOrders}) is zero.`);
            }
        });
        filteredYear.forEach(item => {
            if (item.totalRevenue > 0 && item.totalOrders === 0) {
                console.warn(`Data inconsistency on ${item.period}: Revenue (${item.totalRevenue}) exists but Orders (${item.totalOrders}) is zero.`);
            }
        });

        console.log('Filtered revenueByYear:', filteredYear);

        setFilteredRevenueByDay(filteredDay);
        setFilteredRevenueByMonth(filteredMonth);
        setFilteredRevenueByYear(filteredYear);
    }, [revenueByDay, revenueByMonth, revenueByYear, selectedPayment]);

    // Chart data preparation using filtered data
    const dayChartData = {
        labels: filteredRevenueByDay.map(item => item.period),
        datasets: [
            {
                label: 'Revenue ($)',
                data: filteredRevenueByDay.map(item => item.totalRevenue),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                yAxisID: 'y' // Assign to the left y-axis
            },
            {
                label: 'Orders',
                data: filteredRevenueByDay.map(item => item.totalOrders),
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: true,
                yAxisID: 'yOrders' // Assign to the right y-axis
            }
        ]
    };

    const monthChartData = {
        labels: filteredRevenueByMonth.map(item => item.period),
        datasets: [
            {
                label: 'Revenue ($)',
                data: filteredRevenueByMonth.map(item => item.totalRevenue),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
                yAxisID: 'y' // Assign to the left y-axis
            },
            {
                label: 'Orders',
                data: filteredRevenueByMonth.map(item => item.totalOrders),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                yAxisID: 'yOrders' // Assign to the right y-axis
            }
        ]
    };

    // Since revenueByYear is empty, generate labels dynamically based on yearStart and yearEnd
    const yearLabels = Array.from(
        { length: dateRange.yearEnd - dateRange.yearStart + 1 },
        (_, i) => (dateRange.yearStart + i).toString()
    );

    const yearChartData = {
        labels: yearLabels,
        datasets: [
            {
                label: 'Revenue ($)',
                data: filteredRevenueByYear.length > 0
                    ? filteredRevenueByYear.map(item => item.totalRevenue)
                    : yearLabels.map(() => 0), // Default to 0 if no data
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                fill: true,
                yAxisID: 'y' // Assign to the left y-axis
            },
            {
                label: 'Orders',
                data: filteredRevenueByYear.length > 0
                    ? filteredRevenueByYear.map(item => item.totalOrders)
                    : yearLabels.map(() => 0), // Default to 0 if no data
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                yAxisID: 'yOrders' // Assign to the right y-axis
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y;
                        if (label === 'Revenue ($)') {
                            return `${label}: $${value.toLocaleString()}`;
                        }
                        return `${label}: ${value}`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Period'
                }
            },
            y: {
                beginAtZero: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Revenue ($)'
                },
                ticks: {
                    callback: (value) => `$${value.toLocaleString()}`
                }
            },
            yOrders: {
                beginAtZero: true,
                position: 'right',
                title: {
                    display: true,
                    text: 'Orders'
                },
                grid: {
                    drawOnChartArea: false // Avoid overlapping grid lines with the left y-axis
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    // Handlers
    const handleAddUser = () => {
        setNewUser({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'Parent',
            status: 'Active',
            phoneNumber: '',
            imageProfile: '',
            vaccineCenterId: ''
        });
        setShowAddModal(true);
    };

    const handleSaveAdd = async () => {
        try {
            const response = await api.post('/api/Authentication/register', {
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                confirmPassword: newUser.confirmPassword,
                role: getRoleNumber(newUser.role)
            });

            if (response.data.success) {
                if (newUser.vaccineCenterId) {
                    await api.post('/api/Account/assign-to-vaccine-center', {
                        accountId: response.data.userId,
                        vaccineCenterId: newUser.vaccineCenterId
                    });
                }
                setOverview(prev => ({
                    ...prev,
                    totalAccounts: prev.totalAccounts + 1,
                    [`${newUser.role.toLowerCase()}Accounts`]: prev[`${newUser.role.toLowerCase()}Accounts`] + 1
                }));
                setShowAddModal(false);
                setError('');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user');
            console.error(err);
        }
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentChange = (e) => {
        setSelectedPayment(e.target.value);
    };

    const handleFetchRevenue = () => {
        fetchRevenueData();
    };

    return (
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col>
                    <h2>Admin Dashboard</h2>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={handleAddUser}>
                        <FaPlus className="me-2" /> Add User
                    </Button>
                </Col>
            </Row>

            {error && <div className="alert alert-danger">{error}</div>}

            {overview && (
                <>
                    <Row className="mb-4">
                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Total Accounts</Card.Title>
                                    <Card.Text className="text-3xl font-bold">{overview.totalAccounts}</Card.Text>
                                    <Card.Text>
                                        Admins: {overview.adminAccounts}<br />
                                        Staff: {overview.staffAccounts}<br />
                                        Parents: {overview.parentAccounts}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Children & Centers</Card.Title>
                                    <Card.Text>
                                        Children Profiles: {overview.totalChildrenProfile}<br />
                                        Vaccine Centers: {overview.totalVaccineCenters}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Orders & Schedules</Card.Title>
                                    <Card.Text>
                                        Paid Orders: {overview.totalOrdersPaid}<br />
                                        Schedules: {overview.totalSchedule}<br />
                                        Vaccines Available: {overview.totalVaccinesAvailable}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Revenue and Orders Section */}
                    <Row className="mb-4">
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Revenue and Orders Trends</Card.Title>
                                    <Form className="mb-3">
                                        <Row>
                                            <Col md={2}>
                                                <Form.Group>
                                                    <Form.Label>Payment Method</Form.Label>
                                                    <Form.Select
                                                        value={selectedPayment}
                                                        onChange={handlePaymentChange}
                                                    >
                                                        <option value="">All Payments</option>
                                                        {paymentOptions.map((payment, index) => (
                                                            <option key={index} value={payment}>
                                                                {payment}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col md={2}>
                                                <Form.Group>
                                                    <Form.Label>Day Range Start</Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        name="dayStart"
                                                        value={dateRange.dayStart}
                                                        onChange={handleDateChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={2}>
                                                <Form.Group>
                                                    <Form.Label>Day Range End</Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        name="dayEnd"
                                                        value={dateRange.dayEnd}
                                                        onChange={handleDateChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={2}>
                                                <Form.Group>
                                                    <Form.Label>Month Year</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="monthYear"
                                                        value={dateRange.monthYear}
                                                        onChange={handleDateChange}
                                                        min="2000"
                                                        max={new Date().getFullYear()}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={2}>
                                                <Form.Group>
                                                    <Form.Label>Year Start</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="yearStart"
                                                        value={dateRange.yearStart}
                                                        onChange={handleDateChange}
                                                        min="2000"
                                                        max={new Date().getFullYear()}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={2}>
                                                <Form.Group>
                                                    <Form.Label>Year End</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="yearEnd"
                                                        value={dateRange.yearEnd}
                                                        onChange={handleDateChange}
                                                        min="2000"
                                                        max={new Date().getFullYear()}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Button className="mt-3" variant="primary" onClick={handleFetchRevenue}>
                                            Update Charts
                                        </Button>
                                    </Form>

                                    {/* Daily Chart */}
                                    <h5>Daily Revenue & Orders</h5>
                                    <Line 
                                        data={dayChartData} 
                                        options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: 'Daily Trends' } } }} 
                                    />
                                    
                                    {/* Monthly Chart */}
                                    <h5 className="mt-4">Monthly Revenue & Orders ({dateRange.monthYear})</h5>
                                    <Line 
                                        data={monthChartData} 
                                        options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: `Monthly Trends (${dateRange.monthYear})` } } }} 
                                    />
                                    
                                    {/* Yearly Chart */}
                                    <h5 className="mt-4">Yearly Revenue & Orders</h5>
                                    <Line 
                                        data={yearChartData} 
                                        options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: 'Yearly Trends' } } }} 
                                    />

                                    {/* Daily Details Table */}
                                    <h5 className="mt-4">Daily Details</h5>
                                    <Table striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Orders</th>
                                                <th>Order Amount</th>
                                                <th>Revenue</th>
                                                <th>Vaccine Qty</th>
                                                <th>Top Payment</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredRevenueByDay.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.period}</td>
                                                    <td>{item.totalOrders}</td>
                                                    <td>${item.totalOrderAmount.toFixed(2)}</td>
                                                    <td>${item.totalRevenue.toFixed(2)}</td>
                                                    <td>{item.vaccineQuantity}</td>
                                                    <td>{item.paymentName}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}

            {/* Add User Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={newUser.username} 
                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                value={newUser.email} 
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                value={newUser.password} 
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                value={newUser.confirmPassword} 
                                onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select 
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            >
                                <option value="Parent">Parent</option>
                                <option value="Staff">Staff</option>
                                <option value="Admin">Admin</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select 
                                value={newUser.status}
                                onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={newUser.phoneNumber} 
                                onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Image Profile URL</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={newUser.imageProfile} 
                                onChange={(e) => setNewUser({ ...newUser, imageProfile: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Vaccine Center</Form.Label>
                            <Form.Select 
                                value={newUser.vaccineCenterId}
                                onChange={(e) => setNewUser({ ...newUser, vaccineCenterId: e.target.value })}
                            >
                                <option value="">Select a Vaccine Center (Optional)</option>
                                {vaccineCenters.map(center => (
                                    <option key={center.id} value={center.id}>
                                        {center.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveAdd}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminDashboard;