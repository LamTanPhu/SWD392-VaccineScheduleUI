import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '.././api/axios';

const EditCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        CategoryName: '',
        Description: '',
        Status: 'Active',
        ParentCategoryId: ''
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/VaccineCategory');
                const activeCategories = response.data.filter(cat => cat.status === 'Active' && cat.deletedTime === null && cat.id !== id); // Exclude the current category
                setCategories(activeCategories);

                if (id) {
                    const categoryResponse = await api.get(`/api/VaccineCategory/${id}`);
                    const category = categoryResponse.data;
                    setFormData({
                        CategoryName: category.categoryName,
                        Description: category.description || '',
                        Status: category.status,
                        ParentCategoryId: category.parentCategoryId || ''
                    });
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = { ...formData };
            if (id) {
                await api.put(`/api/VaccineCategory/${id}`, data);
            } else {
                await api.post('/api/VaccineCategory', data);
            }
            navigate('/admin/categories');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save category');
        } finally {
            setLoading(false);
        }
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
        <div className="container py-4">
            <h1 className="text-gradient text-center mb-4">{id ? 'Edit' : 'Create'} Category</h1>
            <div className="card shadow-lg">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Category Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="CategoryName"
                                value={formData.CategoryName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                name="Description"
                                value={formData.Description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Status</label>
                            <select
                                className="form-select"
                                name="Status"
                                value={formData.Status}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Parent Category</label>
                            <select
                                className="form-select"
                                name="ParentCategoryId"
                                value={formData.ParentCategoryId}
                                onChange={handleInputChange}
                            >
                                <option value="">None</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/admin/categories')}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditCategory;