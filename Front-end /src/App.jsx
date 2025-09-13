// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Datasets from "./pages/Datasets";
import Transactions from "./pages/Transactions";
import Payments from "./pages/Payments";
import Analytics from "./pages/Analytics";
import AI from "./pages/AI";
import Blockchain from "./pages/Blockchain";
import Activity from "./pages/Activity";
import Profile from "./pages/Profile";
import DataOps from "./pages/DataOps"; // ✅ NEW
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Private */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="datasets" element={<Datasets />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="payments" element={<Payments />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="ai" element={<AI />} />
        <Route path="blockchain" element={<Blockchain />} />
        <Route path="activity" element={<Activity />} />
        <Route path="profile" element={<Profile />} />
        <Route path="dataops" element={<DataOps />} /> {/* ✅ NEW */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
