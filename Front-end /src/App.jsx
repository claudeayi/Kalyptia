import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/Loader";

// 🔑 Auth pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

// 📊 Dashboard & pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Home = lazy(() => import("./pages/Home"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Datasets = lazy(() => import("./pages/Datasets"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Payments = lazy(() => import("./pages/Payments"));
const Analytics = lazy(() => import("./pages/Analytics"));
const AI = lazy(() => import("./pages/AI"));
const Blockchain = lazy(() => import("./pages/Blockchain"));
const Activity = lazy(() => import("./pages/Activity"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Profile = lazy(() => import("./pages/Profile"));

// 🤖 IA Insights
const Suggestions = lazy(() => import("./pages/Suggestions"));
const Anomalies = lazy(() => import("./pages/Anomalies"));
const Predictions = lazy(() => import("./pages/Predictions"));

// ❌ 404
const NotFound = () => (
  <div className="h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
    <div className="text-center space-y-4">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-lg">Page non trouvée 🚫</p>
      <a
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Retour au Dashboard
      </a>
    </div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* 🌍 Routes publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 Routes protégées */}
        <Route
          path="/"
          element={
            <ProtectedRoute roles={["USER", "PREMIUM", "ADMIN"]}>
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
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />

          {/* 🤖 IA Insights */}
          <Route path="ai/suggestions" element={<Suggestions />} />
          <Route path="ai/anomalies" element={<Anomalies />} />
          <Route path="ai/predictions" element={<Predictions />} />
        </Route>

        {/* ❌ Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
