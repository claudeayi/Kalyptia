import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./routes/ProtectedRoute";
import Loader from "./components/Loader";

// ✅ Layout principal
import Dashboard from "./pages/Dashboard";

/* ============================================================================
 *  Pages Publiques
 * ========================================================================== */
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

/* ============================================================================
 *  Pages Privées – Cockpit principal
 * ========================================================================== */
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

/* ============================================================================
 *  Pages Avancées – IA & Insights
 * ========================================================================== */
const Suggestions = lazy(() => import("./pages/Suggestions"));
const Predictions = lazy(() => import("./pages/Predictions"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Anomalies = lazy(() => import("./pages/Anomalies"));

/* ============================================================================
 *  Module DataOps – Cycle complet de la donnée
 * ========================================================================== */
const DataOps = lazy(() => import("./pages/DataOps"));
const Sources = lazy(() => import("./pages/Sources"));
const Pipeline = lazy(() => import("./pages/Pipeline"));
const Storage = lazy(() => import("./pages/Storage"));
const Governance = lazy(() => import("./pages/Governance"));
const Monetization = lazy(() => import("./pages/Monetization"));

/* ============================================================================
 *  Error Boundary global
 * ========================================================================== */
function ErrorBoundary({ children }) {
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

/* ============================================================================
 *  Page 404
 * ========================================================================== */
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

/* ============================================================================
 *  App principale
 * ========================================================================== */
export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          {/* =======================
              Routes Publiques
          ======================= */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* =======================
              Routes Privées
          ======================= */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            {/* Redirection / -> /home */}
            <Route index element={<Navigate to="/home" replace />} />

            {/* Cockpit principal */}
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

            {/* Extensions IA */}
            <Route path="suggestions" element={<Suggestions />} />
            <Route path="predictions" element={<Predictions />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="anomalies" element={<Anomalies />} />

            {/* ⚡ Nouveau module – Cycle de la donnée */}
            <Route path="dataops" element={<DataOps />}>
              <Route index element={<Navigate to="/dataops/sources" replace />} />
              <Route path="sources" element={<Sources />} />
              <Route path="pipeline" element={<Pipeline />} />
              <Route path="storage" element={<Storage />} />
              <Route path="governance" element={<Governance />} />
              <Route path="monetization" element={<Monetization />} />
            </Route>
          </Route>

          {/* =======================
              404
          ======================= */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
