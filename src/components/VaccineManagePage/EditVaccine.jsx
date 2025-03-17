import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '.././api/axios';

const EditVaccine = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        Name: '',
        IngredientsDescription: '',
        UnitOfVolume: '',
        MinAge: '',
        MaxAge: '',
        BetweenPeriod: '',
        QuantityAvailable: '',
        Price: '',
        ProductionDate: '',
        ExpirationDate: '',
        VaccineCategoryId: '',
        BatchId: '',
        Image: null
    });
    const [categories, setCategories] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch categories
                const categoryResponse = await api.get('/api/VaccineCategory');
                const activeCategories = categoryResponse.data.filter(cat => cat.status === 'Active' && cat.deletedTime === null);
                setCategories(activeCategories);

                // Fetch batches
                const batchResponse = await api.get('/api/VaccineBatch');
                const activeBatches = batchResponse.data.filter(batch => batch.activeStatus === 'Active');
                setBatches(activeBatches);

                // Fetch existing vaccine data if editing
                if (id) {
                    const vaccineResponse = await api.get(`/api/Vaccine/${id}`);
                    const vaccine = vaccineResponse.data;
                    setFormData({
                        Name: vaccine.name,
                        IngredientsDescription: vaccine.ingredientsDescription || '',
                        UnitOfVolume: vaccine.unitOfVolume || '',
                        MinAge: vaccine.minAge || '',
                        MaxAge: vaccine.maxAge || '',
                        BetweenPeriod: vaccine.betweenPeriod || '',
                        QuantityAvailable: vaccine.quantityAvailable || '',
                        Price: vaccine.price || '',
                        ProductionDate: vaccine.productionDate || '',
                        ExpirationDate: vaccine.expirationDate || '',
                        VaccineCategoryId: vaccine.vaccineCategoryId || '',
                        BatchId: vaccine.batchId || '',
                        Image: null // Image is not pre-filled; user can upload a new one
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

    const handleFileChange = (e) => {
        setFormData({ ...formData, Image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'Image' && formData[key]) {
                    data.append('Image', formData[key]);
                } else {
                    data.append(key, formData[key]);
                }
            });

            if (id) {
                await api.put(`/api/Vaccine/${id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/api/Vaccine', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            navigate('/admin/vaccines');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save vaccine');
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
            <h1 className="text-gradient text-center mb-4">{id ? 'Edit' : 'Create'} Vaccine</h1>
            <div className="card shadow-lg">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input type="text" className="form-control" name="Name" value={formData.Name} onChange={handleInputChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Ingredients Description</label>
                            <textarea className="form-control" name="IngredientsDescription" value={formData.IngredientsDescription} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Unit of Volume (mL)</label>
                            <input type="number" className="form-control" name="UnitOfVolume" value={formData.UnitOfVolume} onChange={handleInputChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Minimum Age</label>
                            <input type="number" className="form-control" name="MinAge" value={formData.MinAge} onChange={handleInputChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Maximum Age</label>
                            <input type="number" className="form-control" name="MaxAge" value={formData.MaxAge} onChange={handleInputChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Between Period</label>
                            <input type="date" className="form-control" name="BetweenPeriod" value={formData.BetweenPeriod} onChange={handleInputChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Quantity Available</label>
                            <input type="number" className="form-control" name="QuantityAvailable" value={formData.QuantityAvailable} onChange={handleInputChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Price (VND)</label>
                            <input type="number" className="form-control" name="Price" value={formData.Price} onChange={handleInputChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Production Date</label>
                            <input type="date" className="form-control" name="ProductionDate" value={formData.ProductionDate} onChange={handleInputChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Expiration Date</label>
                            <input type="date" className="form-control" name="ExpirationDate" value={formData.ExpirationDate} onChange={handleInputChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Category</label>
                            <select
                                className="form-select"
                                name="VaccineCategoryId"
                                value={formData.VaccineCategoryId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Batch</label>
                            <select
                                className="form-select"
                                name="BatchId"
                                value={formData.BatchId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select a batch</option>
                                {batches.map(batch => (
                                    <option key={batch.batchNumber} value={batch.batchNumber}>
                                        {batch.batchNumber} (Qty: {batch.quantity})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Image</label>
                            <input type="file" className="form-control" name="Image" onChange={handleFileChange} accept="image/*" />
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/vaccines')}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditVaccine;