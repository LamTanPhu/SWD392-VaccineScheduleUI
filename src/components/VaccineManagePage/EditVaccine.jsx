import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '.././api/axios';

const EditVaccine = () => {
    const { id } = useParams();
    const [vaccine, setVaccine] = useState({
        id: '',
        name: '',
        price: '',
        description: '',
        imageUrl: '',
        type: 'single',
        status: 'active',
        categories: []
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const fetchVaccine = async () => {
                try {
                    const response = await api.get(`/api/vaccines/${id}`); // Adjust endpoint
                    setVaccine(response.data);
                } catch (err) {
                    console.error('Failed to fetch vaccine:', err);
                }
            };
            fetchVaccine();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'imageUrl' && files) {
            const file = files[0];
            setVaccine(prev => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
            return;
        }
        setVaccine(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await api.put(`/api/vaccines/${id}`, vaccine);
            } else {
                await api.post('/api/vaccines', vaccine);
            }
            navigate('/admin/vaccines');
        } catch (err) {
            console.error('Failed to save vaccine:', err);
        }
    };

    return (
        <div className="edit-vaccine-page container py-2">
            <h1 className="text-gradient text-center mb-4">
                {id ? 'Edit Vaccine' : 'Add Vaccine'}
            </h1>
            <div className="card shadow-lg mx-auto" style={{ maxWidth: '800px' }}>
                <div className="card-header bg-primary text-white">
                    <h5>{id ? 'Edit Vaccine' : 'Add New Vaccine'}</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={vaccine.name}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={vaccine.price}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Image</label>
                                    <input
                                        type="file"
                                        name="imageUrl"
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                    {vaccine.imageUrl && (
                                        <img src={vaccine.imageUrl} alt="Vaccine" className="mt-2 img-fluid" style={{ maxHeight: '200px' }} />
                                    )}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Type</label>
                                    <select
                                        name="type"
                                        value={vaccine.type}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    >
                                        <option value="single">Single Vaccine</option>
                                        <option value="package">Vaccine Package</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Status</label>
                                    <select
                                        name="status"
                                        value={vaccine.status}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                {/* Categories can be added later with an API call */}
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-animated">
                            Save Vaccine
                        </button>
                    </form>
                </div>
                <div className="card-footer bg-light d-flex justify-content-end">
                    <button
                        className="btn btn-outline-secondary btn-animated"
                        onClick={() => navigate('/admin/vaccines')}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditVaccine;