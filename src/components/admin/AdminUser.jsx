// src/components/admin/AdminUsers.jsx
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';
import api from "../api/axios"; // Adjust path as needed
import './AdminUser.css';

// Role mapping functions
const getRoleName = (roleNumber) => {
    const roleMap = {
        0: 'Parent',
        1: 'Admin',
        2: 'Staff'
    };
    return roleMap[roleNumber] || 'Unknown';
};

const getRoleNumber = (roleName) => {
    const roleMap = {
        'Parent': 0,
        'Admin': 1,
        'Staff': 2
    };
    return roleMap[roleName] !== undefined ? roleMap[roleName] : 0; // Default to 0 (Parent) if invalid
};

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newUser, setNewUser] = useState({ 
        username: '', 
        email: '', 
        password: '', 
        confirmPassword: '', 
        role: 'Parent', 
        status: 'Active',
        phoneNumber: '',
        imageProfile: '',
        vaccineCenterId: '' // Will now be selected from dropdown
    });
    const [vaccineCenters, setVaccineCenters] = useState([]); // New state for centers
    const [error, setError] = useState('');

    // Fetch users and vaccine centers on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersResponse, centersResponse] = await Promise.all([
                    api.get('/api/Account'),
                    api.get('/api/VaccineCenters') // Fetch vaccine centers
                ]);
                
                const formattedUsers = usersResponse.data.map(user => ({
                    ...user,
                    role: getRoleName(user.role)
                }));
                setUsers(formattedUsers);
                setVaccineCenters(centersResponse.data); // Store centers
            } catch (err) {
                setError('Failed to fetch data');
                console.error(err);
                // Fallback mock data
                setUsers([
                    { accountId: '1', username: 'john_doe', email: 'john@example.com', role: 'Parent', status: 'Active' },
                    { accountId: '2', username: 'jane_smith', email: 'jane@example.com', role: 'Staff', status: 'Active' },
                    { accountId: '3', username: 'bob_admin', email: 'bob@example.com', role: 'Admin', status: 'Inactive' }
                ]);
                setVaccineCenters([
                    { id: '1', name: 'Center A' },
                    { id: '2', name: 'Center B' }
                ]);
            }
        };
        fetchData();
    }, []);

    // Handlers
    const handleDelete = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

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
            vaccineCenterId: '' // Reset to empty for dropdown
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
                role: getRoleNumber(newUser.role) // Convert role to number
            });

            if (response.data.success) {
                // If assigning to a vaccine center is needed post-registration, use a separate API call
                if (newUser.vaccineCenterId) {
                    await api.post('/api/Account/assign-to-vaccine-center', {
                        accountId: response.data.userId,
                        vaccineCenterId: newUser.vaccineCenterId
                    });
                }

                setUsers([...users, { 
                    accountId: response.data.userId, 
                    username: newUser.username, 
                    email: newUser.email, 
                    role: getRoleName(response.data.role), 
                    status: 'Active',
                    phoneNumber: newUser.phoneNumber || 'Not Update',
                    imageProfile: newUser.imageProfile || 'Not Update',
                    vaccineCenterId: newUser.vaccineCenterId || null
                }]);
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

    const handleConfirmDelete = async () => {
        try {
            await api.delete(`/api/Account/${selectedUser.accountId}`);
            setUsers(users.filter(u => u.accountId !== selectedUser.accountId));
            setShowDeleteModal(false);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete user');
            console.error(err);
        }
    };

    return (
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col>
                    <h2>Manage Users</h2>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={handleAddUser}>
                        <FaPlus className="me-2" /> Add User
                    </Button>
                </Col>
            </Row>

            {error && <div className="alert alert-danger">{error}</div>}

            <Card>
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Phone</th>
                                <th>Vaccine Center</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.accountId}>
                                    <td>{user.accountId}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.status}</td>
                                    <td>{user.phoneNumber}</td>
                                    <td>{vaccineCenters.find(c => c.id === user.vaccineCenterId)?.name || 'Not Assigned'}</td>
                                    <td>
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm"
                                            onClick={() => handleDelete(user)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

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

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete {selectedUser?.username} ({selectedUser?.email})?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminUsers;