import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api/axios';
import "./VaccineListing.css";

const VaccineListing = () => {
    const [items, setItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6); // Default matches skeleton cards
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const vaccineResponse = await api.get("/api/Vaccine");
                const vaccineData = vaccineResponse.data;

                const packageResponse = await api.get("/api/VaccinePackage");
                const packageData = packageResponse.data;

                const mappedVaccines = vaccineData.map(v => ({
                    id: v.id,
                    type: "vaccine",
                    name: v.name,
                    price: v.price,
                    prevents: v.ingredientsDescription || "Not specified",
                    origin: v.manufacturerName && v.manufacturerCountry 
                        ? `${v.manufacturerName}, ${v.manufacturerCountry}` 
                        : "Unknown",
                    image: v.image
                }));

                const mappedPackages = packageData.map(p => ({
                    id: p.id,
                    type: "package",
                    name: p.packageName,
                    price: p.vaccines ? p.vaccines.reduce((sum, v) => sum + v.price, 0) : 0,
                    includes: p.vaccines ? p.vaccines.map(v => v.name).join(" + ") : "No vaccines included",
                    target: p.packageDescription || "General use"
                }));

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

    const handleToggleCart = (item) => {
        const isInCart = cartItems.find((i) => i.id === item.id);
        let updatedCart;
        if (isInCart) {
            updatedCart = cartItems.filter((i) => i.id !== item.id);
        } else {
            updatedCart = [...cartItems, { ...item, quantity: 1 }];
        }
        setCartItems(updatedCart);
    };

    const handleRemoveFromCart = (itemId) => {
        const updatedCart = cartItems.filter((i) => i.id !== itemId);
        setCartItems(updatedCart);
    };

    const handleRegisterForInjection = () => {
        if (cartItems.length === 0) return;

        const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
        const updatedCart = [
            ...currentCart.filter((item) => !cartItems.some((ci) => ci.id === item.id)),
            ...cartItems,
        ].map(item => ({ ...item, quantity: 1 }));
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        navigate("/checkout");
    };

    const filteredItems = items.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter =
            filterType === "All" ||
            (filterType === "Vaccines" && item.type === "vaccine") ||
            (filterType === "Packages" && item.type === "package");
        return matchesSearch && matchesFilter;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    // Reset to page 1 when filteredItems changes (e.g., due to search or filter)
    useEffect(() => {
        setCurrentPage(1);
    }, [filteredItems]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to page 1 when items per page changes
    };

    // Debugging log
    useEffect(() => {
        console.log("Filtered Items:", filteredItems.length, "Current Page:", currentPage, "Total Pages:", totalPages, "Items Per Page:", itemsPerPage);
    }, [filteredItems, currentPage, totalPages, itemsPerPage]);

    return (
        <div className="vaccine-listing-page">
            <div className="container">
                <div className="content-header">
                    <button className="category-btn">Categories</button>
                    <h1>VACCINE & PACKAGE INFORMATION</h1>
                </div>
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
                <div className="main-content">
                    <div className="product-list">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="vaccine-card skeleton-card"></div>
                            ))
                        ) : error ? (
                            <div className="vaccine-card error-card">
                                <p>Error: {error}</p>
                            </div>
                        ) : currentItems.length === 0 ? (
                            <div className="vaccine-card error-card">
                                <p>No items found.</p>
                            </div>
                        ) : (
                            currentItems.map((item) => (
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
                                            className={`select-btn ${cartItems.find((i) => i.id === item.id) ? "selected" : ""}`}
                                            onClick={() => handleToggleCart(item)}
                                        >
                                            {cartItems.find((i) => i.id === item.id) ? "IN CART" : "ADD TO CART"}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="selected-items">
                        <h3>CART ITEMS</h3>
                        {cartItems.length === 0 ? (
                            <p>No items in cart.</p>
                        ) : (
                            cartItems.map((item) => (
                                <div key={item.id} className="selected-item">
                                    <span>{item.name} - {item.price} USD</span>
                                    <button className="remove-btn" onClick={() => handleRemoveFromCart(item.id)}>
                                        X
                                    </button>
                                </div>
                            ))
                        )}
                        <div className="cart-footer">
                            <button
                                className="register-btn"
                                onClick={handleRegisterForInjection}
                                disabled={cartItems.length === 0}
                            >
                                REGISTER FOR INJECTION
                            </button>
                        </div>
                    </div>
                </div>
                {/* Moved Pagination Outside main-content */}
                {(filteredItems.length > 0) && (
                    <div className="pagination-controls">
                        <div className="items-per-page">
                            <label htmlFor="itemsPerPage" className="form-label mb-0 text-primary">Items per page:</label>
                            <select
                                id="itemsPerPage"
                                className="form-select form-select-sm"
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
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
                                                onClick={() => handlePageChange(index + 1)}
                                            >
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
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
    );
};

export default VaccineListing;