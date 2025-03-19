import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '.././api/axios';

const BatchManagePage = () => {
    const [batches, setBatches] = useState([]);
    const [originalBatches, setOriginalBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5); // Default 5 for admin table
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/api/VaccineBatch');
                const batchData = response.data.map(batch => ({
                    id: batch.batchNumber, // Using batchNumber as a unique identifier
                    batchNumber: batch.batchNumber,
                    quantity: batch.quantity,
                    manufacturerId: batch.manufacturerId,
                    vaccineCenterId: batch.vaccineCenterId,
                    activeStatus: batch.activeStatus,
                }));

                setBatches(batchData);
                setOriginalBatches(batchData);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.Message || 'Failed to load batches');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleFilterStatus = (e) => {
        setFilterStatus(e.target.value);
        applyFilters(e.target.value, searchQuery);
        setCurrentPage(1);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        applyFilters(filterStatus, e.target.value);
        setCurrentPage(1);
    };

    const applyFilters = (status, search) => {
        let filtered = [...originalBatches];
        if (status !== 'All') {
            filtered = filtered.filter(batch => batch.activeStatus.toLowerCase() === status.toLowerCase());
        }
        if (search) {
            filtered = filtered.filter(batch =>
                batch.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
                batch.manufacturerId.toLowerCase().includes(search.toLowerCase()) ||
                batch.vaccineCenterId.toLowerCase().includes(search.toLowerCase())
            );
        }
        setBatches(filtered);
    };

    const handleCreateBatch = () => {
        navigate('/admin/edit-batch');
    };

    const handleDelete = async (batchNumber) => {
        if (window.confirm('Are you sure you want to delete this batch?')) {
            try {
                await api.delete(`/api/VaccineBatch/${batchNumber}`);
                setBatches(batches.filter(batch => batch.batchNumber !== batchNumber));
                setOriginalBatches(originalBatches.filter(batch => batch.batchNumber !== batchNumber));
            } catch (err) {
                alert(err.response?.data?.Message || 'Failed to delete batch');
            }
        }
    };

    // Pagination logic
    const totalPages = Math.ceil(batches.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBatches = batches.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to page 1 when items per page changes
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center" role="alert">
                {error}
                <button className="btn btn-link" onClick={() => window.location.reload()}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="batch-manage-page container py-2">
            <h1 className="text-gradient text-center mb-4">Batch Manage Page</h1>
            <div className="card shadow-lg">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h5>Batch List</h5>
                    <button
                        className="btn btn-light btn-animated"
                        onClick={handleCreateBatch}
                    >
                        <i className="fas fa-plus me-2"></i>Create Batch
                    </button>
                </div>
                <div className="card-body">
                    <div className="mb-3 d-flex gap-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by batch number, manufacturer, or center..."
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        <select
                            className="form-select"
                            value={filterStatus}
                            onChange={handleFilterStatus}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <table className="table table-striped">
                        <thead className="table-primary">
                            <tr>
                                <th>Batch Number</th>
                                <th>Quantity</th>
                                <th>Manufacturer ID</th>
                                <th>Vaccine Center ID</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBatches.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center">No batches found.</td>
                                </tr>
                            ) : (
                                currentBatches.map((batch) => (
                                    <tr key={batch.batchNumber}>
                                        <td className="align-middle">{batch.batchNumber}</td>
                                        <td className="align-middle">{batch.quantity}</td>
                                        <td className="align-middle">{batch.manufacturerId}</td>
                                        <td className="align-middle">{batch.vaccineCenterId}</td>
                                        <td className="align-middle">{batch.activeStatus}</td>
                                        <td className="align-middle">
                                            <a
                                                href={`/admin/edit-batch/${batch.batchNumber}`}
                                                className="btn btn-outline-primary btn-sm me-2"
                                                style={{ borderRadius: '20px' }}
                                            >
                                                Edit
                                            </a>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                style={{ borderRadius: '20px' }}
                                                onClick={() => handleDelete(batch.batchNumber)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {/* Pagination and Items Per Page Controls */}
                    {batches.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-4 px-3">
                            <div className="d-flex align-items-center gap-2">
                                <label htmlFor="itemsPerPage" className="form-label mb-0 text-primary">Items per page:</label>
                                <select
                                    id="itemsPerPage"
                                    className="form-select form-select-sm"
                                    value={itemsPerPage}
                                    onChange={handleItemsPerPageChange}
                                    style={{ width: 'auto', borderColor: '#007bff', borderRadius: '5px' }}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                </select>
                            </div>
                            {totalPages > 1 && (
                                <nav aria-label="Page navigation">
                                    <ul className="pagination">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                style={{ color: '#007bff', borderColor: '#007bff', borderRadius: '5px' }}
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            >
                                                Previous
                                            </button>
                                        </li>
                                        {Array.from({ length: totalPages }, (_, index) => (
                                            <li
                                                key={index + 1}
                                                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                                            >
                                                <button
                                                    className="page-link"
                                                    style={{ color: currentPage === index + 1 ? '#fff' : '#007bff', backgroundColor: currentPage === index + 1 ? '#007bff' : 'transparent', borderRadius: '5px' }}
                                                    onClick={() => handlePageChange(index + 1)}
                                                >
                                                    {index + 1}
                                                </button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                style={{ color: '#007bff', borderColor: '#007bff', borderRadius: '5px' }}
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                            >
                                                Next
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BatchManagePage;