import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '.././api/axios';

const EditBatch = () => {
    const { batchNumber } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        batchNumber: '',
        quantity: '',
        manufacturerId: '',
        vaccineCenterId: '',
        activeStatus: 'Active'
    });
    const [manufacturers, setManufacturers] = useState([]);
    const [vaccineCenters, setVaccineCenters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch manufacturers
                const manufacturerResponse = await api.get('/api/Manufacturer');
                setManufacturers(manufacturerResponse.data);

                // Fetch vaccine centers - Corrected to /api/VaccineCenters
                const vaccineCenterResponse = await api.get('/api/VaccineCenters');
                setVaccineCenters(vaccineCenterResponse.data);

                // Fetch existing batch data if editing
                if (batchNumber) {
                    const response = await api.get(`/api/VaccineBatch/${batchNumber}`);
                    const batch = response.data;
                    setFormData({
                        batchNumber: batch.batchNumber,
                        quantity: batch.quantity,
                        manufacturerId: batch.manufacturerId,
                        vaccineCenterId: batch.vaccineCenterId,
                        activeStatus: batch.activeStatus
                    });
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load batch data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [batchNumber]);

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
            if (batchNumber) {
                await api.put(`/api/VaccineBatch/${batchNumber}`, data);
            } else {
                const response = await api.post('/api/VaccineBatch', data);
                if (response.data.success) {
                    setFormData(prev => ({ ...prev, batchNumber: response.data.batchNumber }));
                }
            }
            navigate('/admin/batches');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save batch');
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
            <h1 className="text-gradient text-center mb-4">{batchNumber ? 'Edit' : 'Create'} Batch</h1>
            <div className="card shadow-lg">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Batch Number</label>
                            <input
                                type="text"
                                className="form-control"
                                name="batchNumber"
                                value={formData.batchNumber}
                                onChange={handleInputChange}
                                required
                                disabled={!!batchNumber} // Disable if editing
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Quantity</label>
                            <input
                                type="number"
                                className="form-control"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Manufacturer</label>
                            <select
                                className="form-select"
                                name="manufacturerId"
                                value={formData.manufacturerId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select a manufacturer</option>
                                {manufacturers.map(manufacturer => (
                                    <option key={manufacturer.id} value={manufacturer.id}>
                                        {manufacturer.name || manufacturer.id}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Vaccine Center</label>
                            <select
                                className="form-select"
                                name="vaccineCenterId"
                                value={formData.vaccineCenterId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select a vaccine center</option>
                                {vaccineCenters.map(center => (
                                    <option key={center.id} value={center.id}>
                                        {center.name || center.id}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Active Status</label>
                            <select
                                className="form-select"
                                name="activeStatus"
                                value={formData.activeStatus}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/admin/batches')}
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

export default EditBatch;