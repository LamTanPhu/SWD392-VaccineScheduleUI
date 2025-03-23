import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '.././api/axios';
import { formatCurrency } from '.././utils/utils';

const VaccineManagePage = () => {
    const [vaccines, setVaccines] = useState([]);
    const [originalVaccines, setOriginalVaccines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5); // Default 5 for admin table
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const vaccineResponse = await api.get('/api/Vaccine');
                const vaccineData = vaccineResponse.data.map(v => ({
                    id: v.id,
                    type: 'vaccine',
                    name: v.name,
                    price: v.price,
                    prevents: v.ingredientsDescription || 'Not specified',
                    origin: v.manufacturerName && v.manufacturerCountry 
                        ? `${v.manufacturerName}, ${v.manufacturerCountry}` 
                        : 'Unknown',
                    imageUrl: v.image,
                    status: 'active'
                }));

                const packageResponse = await api.get('/api/VaccinePackage');
                const packageData = packageResponse.data.map(p => ({
                    id: p.id,
                    type: 'package',
                    name: p.packageName,
                    price: p.vaccines ? p.vaccines.reduce((sum, v) => sum + v.price, 0) : 0,
                    includes: p.vaccines ? p.vaccines.map(v => v.name).join(' + ') : 'No vaccines included',
                    target: p.packageDescription || 'General use',
                    status: 'active'
                }));

                const allVaccines = [...vaccineData, ...packageData];
                setVaccines(allVaccines);
                setOriginalVaccines(allVaccines);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.Message || 'Failed to load vaccines');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleFilterType = (e) => {
        setFilterType(e.target.value);
        applyFilters(e.target.value, searchQuery);
        setCurrentPage(1);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        applyFilters(filterType, e.target.value);
        setCurrentPage(1);
    };

    const applyFilters = (type, search) => {
        let filtered = [...originalVaccines];
        if (type !== 'All') {
            filtered = filtered.filter(v => 
                (type === 'Vaccines' && v.type === 'vaccine') || 
                (type === 'Packages' && v.type === 'package')
            );
        }
        if (search) {
            filtered = filtered.filter(v => 
                v.name.toLowerCase().includes(search.toLowerCase())
            );
        }
        setVaccines(filtered);
    };

    const handleCreateVaccine = () => {
        navigate('/admin/edit-vaccine');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this vaccine/package?')) {
            try {
                await api.delete(`/api/Vaccine/${id}`); // Adjust endpoint based on type
                setVaccines(vaccines.filter(v => v.id !== id));
                setOriginalVaccines(originalVaccines.filter(v => v.id !== id));
            } catch (err) {
                alert(err.response?.data?.Message || 'Failed to delete vaccine');
            }
        }
    };

    // Pagination logic
    const totalPages = Math.ceil(vaccines.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentVaccines = vaccines.slice(indexOfFirstItem, indexOfLastItem);

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
        <div className="vaccine-manage-page container py-2">
            <h1 className="text-gradient text-center mb-4">Vaccine Manage Page</h1>
            <div className="card shadow-lg">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h5>Vaccine & Package List</h5>
                    <button
                        className="btn btn-light btn-animated"
                        onClick={handleCreateVaccine}
                    >
                        <i className="fas fa-plus me-2"></i>Create Vaccine/Package
                    </button>
                </div>
                <div className="card-body">
                    <div className="mb-3 d-flex gap-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        <select
                            className="form-select"
                            value={filterType}
                            onChange={handleFilterType}
                        >
                            <option value="All">All Types</option>
                            <option value="Vaccines">Single Vaccines</option>
                            <option value="Packages">Vaccine Packages</option>
                        </select>
                    </div>
                    <table className="table table-striped">
                        <thead className="table-primary">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentVaccines.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center">No items found.</td>
                                </tr>
                            ) : (
                                currentVaccines.map((vaccine) => (
                                    <tr key={vaccine.id}>
                                        <td className="align-middle">{vaccine.id}</td>
                                        <td className="align-middle">{vaccine.name}</td>
                                        <td className="align-middle">{formatCurrency(vaccine.price)}</td>
                                        <td className="align-middle">
                                            {vaccine.type === 'vaccine' ? 'Single Vaccine' : 'Vaccine Package'}
                                        </td>
                                        <td className="align-middle">{vaccine.status}</td>
                                        <td className="align-middle">
                                            <a
                                                href={`/admin/edit-vaccine/${vaccine.id}`}
                                                className="btn btn-outline-primary btn-sm me-2"
                                                style={{ borderRadius: '20px' }}
                                            >
                                                Edit
                                            </a>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                style={{ borderRadius: '20px' }}
                                                onClick={() => handleDelete(vaccine.id)}
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
                    {(vaccines.length > 0) && (
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

export default VaccineManagePage;