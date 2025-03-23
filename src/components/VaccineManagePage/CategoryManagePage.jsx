import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '.././api/axios';

const CategoryManagePage = () => {
    const [categories, setCategories] = useState([]);
    const [originalCategories, setOriginalCategories] = useState([]);
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
                const response = await api.get('/api/VaccineCategory');
                const categoryData = response.data.map(cat => ({
                    id: cat.id,
                    name: cat.categoryName,
                    description: cat.description || 'Not specified',
                    parentCategory: cat.parentCategoryId ? `ID: ${cat.parentCategoryId}` : 'None',
                    status: cat.status || 'Active',
                }));

                setCategories(categoryData);
                setOriginalCategories(categoryData);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.Message || 'Failed to load categories');
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
        let filtered = [...originalCategories];
        if (status !== 'All') {
            filtered = filtered.filter(cat => cat.status.toLowerCase() === status.toLowerCase());
        }
        if (search) {
            filtered = filtered.filter(cat =>
                cat.name.toLowerCase().includes(search.toLowerCase()) ||
                cat.description.toLowerCase().includes(search.toLowerCase())
            );
        }
        setCategories(filtered);
    };

    const handleCreateCategory = () => {
        navigate('/admin/edit-category');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await api.delete(`/api/VaccineCategory/${id}`);
                setCategories(categories.filter(cat => cat.id !== id));
                setOriginalCategories(originalCategories.filter(cat => cat.id !== id));
            } catch (err) {
                alert(err.response?.data?.Message || 'Failed to delete category');
            }
        }
    };

    // Pagination logic
    const totalPages = Math.ceil(categories.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

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
        <div className="category-manage-page container py-2">
            <h1 className="text-gradient text-center mb-4">Category Manage Page</h1>
            <div className="card shadow-lg">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h5>Category List</h5>
                    <button
                        className="btn btn-light btn-animated"
                        onClick={handleCreateCategory}
                    >
                        <i className="fas fa-plus me-2"></i>Create Category
                    </button>
                </div>
                <div className="card-body">
                    <div className="mb-3 d-flex gap-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by name or description..."
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
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Parent Category</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCategories.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center">No categories found.</td>
                                </tr>
                            ) : (
                                currentCategories.map((category) => (
                                    <tr key={category.id}>
                                        <td className="align-middle">{category.id}</td>
                                        <td className="align-middle">{category.name}</td>
                                        <td className="align-middle">{category.description}</td>
                                        <td className="align-middle">{category.parentCategory}</td>
                                        <td className="align-middle">{category.status}</td>
                                        <td className="align-middle">
                                            <a
                                                href={`/admin/edit-category/${category.id}`}
                                                className="btn btn-outline-primary btn-sm me-2"
                                                style={{ borderRadius: '20px' }}
                                            >
                                                Edit
                                            </a>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                style={{ borderRadius: '20px' }}
                                                onClick={() => handleDelete(category.id)}
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
                    {categories.length > 0 && (
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

export default CategoryManagePage;