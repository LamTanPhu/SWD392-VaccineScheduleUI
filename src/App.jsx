import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import About from "./components/About/about.jsx";
import AdminEditProfile from "./components/admin/AdminEditProfile.jsx"; // New import
import AdminOrders from "./components/admin/AdminOrders";
import AdminProfile from "./components/admin/AdminProfile";
import AuthPage from "./components/auth/AuthPage";
import Cart from "./components/cart/cart";
import Checkout from "./components/checkout/checkout.jsx";
import HomePage from "./components/homePage/HomePage";
import AdminStaffLayout from "./components/layout/AdminStaffLayout";
import Layout from "./components/layout/Layout";
import OrderConfirmation from "./components/orderConfirmation/OrderConfirmation";
import OrderListing from "./components/Orderconfirmation/OrderListing";
import ChildrenProfilePage from "./components/profile/ChildrenProfile";
import EditProfile from "./components/profile/EditProfile";
import ProfilePage from "./components/profile/ProfilePage";
import Schedule from "./components/Schedule/schedule";
import VaccineListing from "./components/VaccineListing/VaccineListing";
import VaccineManagePage from "./components/VaccineManagePage/VaccineManagePage";
import EditVaccine from "./components/VaccineManagePage/EditVaccine";

// Placeholder admin pages
const AdminDashboard = () => <h1>Admin Dashboard</h1>;
const AdminSchedules = () => <h1>Schedules Management</h1>;
const AdminUsers = () => <h1>Users Management</h1>;
const AdminSettings = () => <h1>Settings</h1>;

// PrivateRoute for admin/staff access only
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    console.log('PrivateRoute Check:', { token, userRole });
    const isAuthorized = token && (userRole === 'Admin' || userRole === 'Staff');
    console.log('Is Authorized:', isAuthorized);
    return isAuthorized ? children : <Navigate to="/auth" />;
};

// AuthenticatedRoute for logged-in users
const AuthenticatedRoute = ({ children }) => {
    const token = localStorage.getItem('authToken');
    return token ? children : <Navigate to="/auth?mode=signin" />;
};

// Determine layout based on user role
const getLayout = (children) => {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    if (!token || (userRole !== 'Admin' && userRole !== 'Staff')) {
        return <Layout>{children}</Layout>;
    }
    return <AdminStaffLayout>{children}</AdminStaffLayout>;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes (always use Layout) */}
                <Route path="/" element={<Layout><HomePage /></Layout>} />
                <Route path="/auth" element={<Layout><AuthPage /></Layout>} />
                <Route path="/about" element={<Layout><About /></Layout>} />
                <Route path="/schedule" element={getLayout(<Schedule />)} />
                <Route path="/vaccines" element={getLayout(<VaccineListing />)} />
                <Route path="/cart" element={<Layout><Cart /></Layout>} />
                <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                {/* Orders Route - Protected for logged-in users */}
                <Route
                    path="/orders"
                    element={
                        <AuthenticatedRoute>
                            <Layout>
                                <OrderListing />
                            </Layout>
                        </AuthenticatedRoute>
                    }
                />
                {/* Profile Routes */}
                <Route path="/profile" element={getLayout(<ProfilePage />)} />
                <Route path="/edit-profile" element={getLayout(<EditProfile />)} />
                <Route path="/children-profiles" element={getLayout(<ChildrenProfilePage />)} />

                {/* Admin/Staff Routes */}
                <Route
                    path="/admin/*"
                    element={
                        <PrivateRoute>
                            <AdminStaffLayout>
                                <Routes>
                                    <Route index element={<AdminDashboard />} />
                                    <Route path="dashboard" element={<AdminDashboard />} />
                                    <Route path="schedules" element={<AdminSchedules />} />
                                    <Route path="users" element={<AdminUsers />} />
                                    <Route path="settings" element={<AdminSettings />} />
                                    <Route path="orders" element={<AdminOrders />} />
                                    <Route path="profile" element={<AdminProfile />} />
                                    <Route path="vaccines" element={<VaccineManagePage />} /> {/* Updated route */}
                                    <Route path="edit-vaccine/:id?" element={<EditVaccine />} /> {/* Unchanged route */}
                                    <Route path="edit-profile" element={<AdminEditProfile />} /> {/* New route */}
                                </Routes>
                            </AdminStaffLayout>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;