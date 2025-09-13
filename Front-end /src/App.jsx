import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./routes/ProtectedRoute";
import Loader from "./components/Loader";

// ✅ Layout principal
import Dashboard from "./pages/Dashboard";

// ✅ Pages publiques
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

// ✅ Pages privées
const Home = lazy(() => import("./pages/Home"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Datasets = lazy(() => import("./pages/Datasets"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Payments = lazy(() => import("./pages/Payments"));
const Analytics = lazy(() => import("./pages/Analytics"));
const AI = lazy(() => import("./pages/AI"));
const Blockchain = lazy(() => import("./pages/Blockchain"));
const Activity = lazy(() => import("./pages/Activity"));
const Profile = lazy(() => import("./pages/Profile"));
const Suggestions = lazy(() => import("./pages/Suggestions"));
const Predictions = lazy(() => import("./pages/Predictions"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Anomalies = lazy(() => import("./pages/Anomalies"));
const DataOps = lazy(() => import("./pages/DataOps")); // ✅ NEW

// ✅ Error Boundary global
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div
          className="flex flex-col items-center justify-center h-screen space-y-4"
          role="status"
          aria-busy="true"
        >
          <Loader text="Chargement de l’application..." />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

// ✅ 404 page
const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-screen text-center space-y-4">
    <h1 className="text-5xl font-extrabold text-red-600">404</h1>
    <p className="text-gray-600 dark:text-gray-300">
      Oups, cette page n’existe pas 🚧
    </p>
    <a
      href="/"
      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
    >
      Retour au tableau de bord
    </a>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes privées */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="datasets" element={<Datasets />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="payments" element={<Payments />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="ai" element={<AI />} />
            <Route path="blockchain" element={<Blockchain />} />
            <Route path="activity" element={<Activity />} />
            <Route path="profile" element={<Profile />} />
            <Route path="suggestions" element={<Suggestions />} />
            <Route path="predictions" element={<Predictions />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="anomalies" element={<Anomalies />} />
            <Route path="dataops" element={<DataOps />} /> {/* ✅ NEW */}
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
