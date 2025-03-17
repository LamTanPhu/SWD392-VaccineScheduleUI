import '@fortawesome/fontawesome-free/css/all.min.css'; // For Font Awesome
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useMemo } from "react";
import About from "./components/About/about.jsx"; // Import the About component
import AuthPage from "./components/auth/AuthPage";
import Cart from "./components/cart/cart";
import Checkout from "./components/checkout/checkout.jsx";
import HomePage from "./components/homePage/HomePage";
import AdminStaffLayout from "./components/layout/AdminStaffLayout";
import Layout from "./components/layout/Layout";
import OrderConfirmation from "./components/orderConfirmation/OrderConfirmation";
import OrderListing from "./components/orderConfirmation/OrderListing"; // Import the OrderListing component
import ChildrenProfilePage from "./components/profile/ChildrenProfile";
import EditProfile from "./components/profile/EditProfile";
import ProfilePage from "./components/profile/ProfilePage";
import Schedule from "./components/Schedule/schedule";
import VaccineListing from "./components/VaccineListing/VaccineListing";
import UserList from "./pages/admin/user/list";
import UserDetail from "./pages/admin/user/detail";
import AdminLayout from "./components/common/admin-layout";

// Placeholder admin pages
const AdminDashboard = () => <h1>Admin Dashboard</h1>;
const AdminVaccines = () => <h1>Vaccines Management</h1>;
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

    // If no token or not Admin/Staff, use regular Layout
    if (!token || (userRole !== 'Admin' && userRole !== 'Staff')) {
        return <Layout>{children}</Layout>;
    }
    // If Admin or Staff, use AdminStaffLayout
    return <AdminStaffLayout>{children}</AdminStaffLayout>;
};

function App() {
    // const _Layout = useMemo(() => { // Đã có layout nên anh để cmt nha
    //     const isAdmin = localStorage.getItem("isAdmin") ?? true;
    //     if (isAdmin) {
    //       return AdminLayout;
    //     }
    //     return Layout;
    //   }, []);
    return (
        <Router>
            <_Layout>
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
                                    <Route path="/admin/users" element={<UserList />} /> {/* AdminUsers */} 
                                    <Route path="/admin/user/detail/:id" element={<UserDetail />} /> {/* AdminUser Details Layout */}
                                    <Route index element={<AdminDashboard />} />
                                    <Route path="dashboard" element={<AdminDashboard />} />
                                    <Route path="vaccines" element={<AdminVaccines />} />
                                    <Route path="schedules" element={<AdminSchedules />} />
                                    {/* <Route path="users" element={<AdminUsers />} /> */}
                                    <Route path="settings" element={<AdminSettings />} />
                                </Routes>
                            </AdminStaffLayout>
                        </PrivateRoute>
                    }
                />
            </Routes>
            </_Layout>
        </Router>
    );
}

export default App;