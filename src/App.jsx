import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AdminStaffLayout from "./components/layout/AdminStaffLayout";
import HomePage from "./components/homePage/HomePage";
import AuthPage from "./components/auth/AuthPage";
import Schedule from "./pages/schedule";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css'; // For Font Awesome

// Placeholder admin pages
const AdminDashboard = () => <h1>Admin Dashboard</h1>;
const AdminVaccines = () => <h1>Vaccines Management</h1>;
const AdminSchedules = () => <h1>Schedules Management</h1>;
const AdminUsers = () => <h1>Users Management</h1>;
const AdminSettings = () => <h1>Settings</h1>;

// PrivateRoute for admin/staff access only
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('authToken'); // Check for token
    const userRole = token ? 'Admin' : null; // Placeholder: replace with JWT role extraction
    return token && (userRole === 'Admin' || userRole === 'Staff') ? children : <Navigate to="/auth" />;
};

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    {/* Add other public routes here */}

                    {/* Admin/Staff Routes */}
                    <Route
                        path="/admin/*"
                        element={
                            <PrivateRoute>
                                <AdminStaffLayout />
                            </PrivateRoute>
                        }
                    >
                        <Route index element={<AdminDashboard />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="vaccines" element={<AdminVaccines />} />
                        <Route path="schedules" element={<AdminSchedules />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="settings" element={<AdminSettings />} />
                        <Route path="/schedule" element={<Schedule />} />
                        {/* Add new admin routes here */}
                    </Route>
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;

