import React, { useEffect, useState } from "react";
import api from '../api/axios';
import "./VaccineListing.css"; // Custom CSS for styling

const VaccineListing = () => {
    const [items, setItems] = useState([]); // Combined list of vaccines and packages
    const [selectedItems, setSelectedItems] = useState([]); // Combined selected items
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // State for error handling
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("All"); // New state for filter type

    // Fetch data from API using Axios
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch vaccines
                const vaccineResponse = await api.get("/api/Vaccine");
                const vaccineData = vaccineResponse.data;

                // Fetch packages
                const packageResponse = await api.get("/api/VaccinePackage");
                const packageData = packageResponse.data;

                // Map API responses to the expected structure
                const mappedVaccines = vaccineData.map(v => ({
                    id: v.Id,
                    type: "vaccine",
                    name: v.Name,
                    price: v.Price,
                    prevents: v.IngredientsDescription || "Not specified", // Fallback if no description
                    origin: v.BatchId || "Unknown" // Proxy for origin
                }));

                const mappedPackages = packageData.map(p => ({
                    id: p.Id,
                    type: "package",
                    name: p.PackageName,
                    price: p.Vaccines.reduce((sum, v) => sum + v.Price, 0), // Sum of vaccine prices
                    includes: p.Vaccines.map(v => v.Name).join(" + "), // Concatenate vaccine names
                    target: p.PackageDescription || "General use" // Proxy for target
                }));

                // Combine vaccines and packages
                setItems([...mappedVaccines, ...mappedPackages]);
            } catch (err) {
                setError(err.message || "An error occurred while fetching data");
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle item selection toggle (for both vaccines and packages)
    const handleSelectToggle = (item) => {
        const isSelected = selectedItems.find((i) => i.id === item.id);
        if (isSelected) {
            setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    // Handle removal from selected list
    const handleRemove = (itemId) => {
        setSelectedItems(selectedItems.filter((i) => i.id !== itemId));
    };

    // Filter items based on search and filter type
    const filteredItems = items.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter =
            filterType === "All" ||
            (filterType === "Vaccines" && item.type === "vaccine") ||
            (filterType === "Packages" && item.type === "package");
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="vaccine-listing-page">
            <div className="container">
                {/* Categories and Main Title */}
                <div className="content-header">
                    <button className="category-btn">Categories</button>
                    <h1>VACCINE & PACKAGE INFORMATION</h1>
                </div>

                {/* Search and Filter */}
                <div className="search-filter">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search vaccine or package..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select
                        className="filter-select"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="All">Filter by...</option>
                        <option value="Vaccines">Vaccines</option>
                        <option value="Packages">Packages</option>
                    </select>
                </div>

                {/* Main Content: Side-by-Side Layout */}
                <div className="main-content">
                    {/* Vaccine and Package Product List (Left Column) */}
                    <div className="product-list">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="vaccine-card skeleton-card"></div>
                            ))
                        ) : error ? (
                            <div className="vaccine-card error-card">
                                <p>Error: {error}</p>
                            </div>
                        ) : (
                            filteredItems.map((item) => (
                                <div key={item.id} className="vaccine-card">
                                    <div className="card-content">
                                        <h5 className="card-title">{item.name}</h5>
                                        {item.type === "vaccine" ? (
                                            <>
                                                <p><strong>Prevents:</strong> {item.prevents}</p>
                                                <p><strong>Origin:</strong> {item.origin}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p><strong>Includes:</strong> {item.includes}</p>
                                                <p><strong>Target:</strong> {item.target}</p>
                                            </>
                                        )}
                                        <div className="price-badge">{item.price} USD</div>
                                    </div>
                                    <div className="card-footer">
                                        <button
                                            className={`select-btn ${selectedItems.find((i) => i.id === item.id) ? "selected" : ""}`}
                                            onClick={() => handleSelectToggle(item)}
                                        >
                                            {selectedItems.find((i) => i.id === item.id) ? "SELECTED" : "SELECT"}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Selected Items List (Right Column) */}
                    <div className="selected-items">
                        <h3>SELECTED ITEMS LIST</h3>
                        {selectedItems.length === 0 ? (
                            <p>No items selected.</p>
                        ) : (
                            selectedItems.map((item) => (
                                <div key={item.id} className="selected-item">
                                    <span>{item.name} - {item.price} USD</span>
                                    <button className="remove-btn" onClick={() => handleRemove(item.id)}>
                                        X
                                    </button>
                                </div>
                            ))
                        )}
                        <div className="cart-footer">
                            <button className="register-btn">REGISTER FOR INJECTION</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VaccineListing;