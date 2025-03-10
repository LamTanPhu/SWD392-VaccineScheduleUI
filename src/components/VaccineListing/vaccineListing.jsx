import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import "./VaccineListing.css"; // Custom CSS for styling

const VaccineListing = () => {
    const [items, setItems] = useState([]); // Combined list of vaccines and packages
    const [selectedItems, setSelectedItems] = useState([]); // Combined selected items
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("All"); // New state for filter type

    // Simulate fetching vaccine and package data
    useEffect(() => {
        setTimeout(() => {
        setItems([
            // Vaccines
            { id: 1, type: "vaccine", name: "VAXIGRIP TETRA QUADRIVALENT FLU VACCINE", price: 35.60, origin: "Sanofi (France)", prevents: "Influenza" },
            { id: 2, type: "vaccine", name: "INFLUVAC TETRA QUADRIVALENT FLU VACCINE", price: 35.60, origin: "Abbott (South Korea)", prevents: "Influenza" },
            { id: 3, type: "vaccine", name: "IVACFLU-S 0.5ML VACCINE", price: 31.50, origin: "IVAC (Vietnam)", prevents: "Influenza (adults 18+)" },
            { id: 4, type: "vaccine", name: "GCFLU QUADRIVALENT VACCINE", price: 36.00, origin: "Green Cross (South Korea)", prevents: "Influenza" },
            { id: 5, type: "vaccine", name: "MMR II MEASLES, MUMPS, RUBELLA VACCINE", price: 44.50, origin: "MSD (USA)", prevents: "Measles, Mumps, Rubella" },
            { id: 6, type: "vaccine", name: "VARILRIX CHICKENPOX VACCINE", price: 108.50, origin: "GSK (Belgium)", prevents: "Chickenpox" },
            // Vaccine Packages
            { id: 7, type: "package", name: "Flu Protection Package", price: 90.00, includes: "VAXIGRIP + INFLUVAC", target: "Adults" },
            { id: 8, type: "package", name: "Childhood Immunity Package", price: 150.00, includes: "MMR II + VARILRIX", target: "Children (1-12 years)" },
            { id: 9, type: "package", name: "Travel Safety Package", price: 120.00, includes: "IVACFLU + GCFLU", target: "Travelers" },
        ]);
        setLoading(false);
        }, 2000); // Simulate 2-second loading delay
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
        (filterType === "Packages" && item.type === "package")
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="container py-4">
        {/* Categories and Main Title */}
        <div className="mb-3">
            <button className="btn btn-warning mb-2">Categories</button>
            <h1 className="display-4">VACCINE & PACKAGE INFORMATION</h1>
        </div>

        {/* Search and Filter */}
        <div className="mb-4">
            <input
            type="text"
            className="form-control mb-2"
            placeholder="Search vaccine or package name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Updated filter dropdown */}
            <select
            className="form-control"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            >
            <option value="All">Filter by...</option>
            <option value="Vaccines">Vaccines</option>
            <option value="Packages">Packages</option>
            </select>
        </div>

        {/* Main Content: Side-by-Side Layout */}
        <div className="row">
            {/* Vaccine and Package Product List (Left Column) */}
            <div className="col-md-8">
            <div className="row">
                {loading
                ? // Loading Skeleton (simplified, can be enhanced)
                    Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="col-md-4 mb-4">
                        <div className="card skeleton-card"></div>
                    </div>
                    ))
                : filteredItems.map((item) => (
                    <div key={item.id} className="col-md-4 mb-4">
                        <div className="card vaccine-card">
                        <div className="card-body">
                            <h5 className="card-title">{item.name}</h5>
                            {item.type === "vaccine" ? (
                            <>
                                <p className="card-text">Prevents: {item.prevents}</p>
                                <p className="card-text">Origin: {item.origin}</p>
                            </>
                            ) : (
                            <>
                                <p className="card-text">Includes: {item.includes}</p>
                                <p className="card-text">Target: {item.target}</p>
                            </>
                            )}
                            <p className="card-text">
                            <span role="img" aria-label="price">💲</span> {item.price} USD
                            </p>
                            <button
                            className={`btn ${selectedItems.find((i) => i.id === item.id) ? "btn-success" : "btn-primary"}`}
                            onClick={() => handleSelectToggle(item)}
                            >
                            {selectedItems.find((i) => i.id === item.id) ? "SELECTED" : "SELECT"}
                            </button>
                        </div>
                        </div>
                    </div>
                    ))}
            </div>
            </div>

            {/* Selected Items List (Right Column) */}
            <div className="col-md-4">
            <h3>SELECTED ITEMS LIST</h3>
            {selectedItems.length === 0 ? (
                <p>No items selected.</p>
            ) : (
                <ul className="list-group">
                {selectedItems.map((item) => (
                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {item.name} - {item.price} USD
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemove(item.id)}
                    >
                        X
                    </button>
                    </li>
                ))}
                </ul>
            )}
            <button className="btn btn-info mt-2 w-100">REGISTER FOR INJECTION</button>
            </div>
        </div>
        </div>
    );
};

export default VaccineListing;