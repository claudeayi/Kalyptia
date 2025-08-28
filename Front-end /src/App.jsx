import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Datasets from "./pages/Datasets";
import Transactions from "./pages/Transactions";
import Payments from "./pages/Payments";
import Analytics from "./pages/Analytics";
import AI from "./pages/AI";             // ✅ ajout
import Blockchain from "./pages/Blockchain"; // ✅ ajout
import Profile from "./pages/Profile";       // ✅ ajout

function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard + sous-pages */}
      <Route path="/" element={<Dashboard />}>
        <Route path="datasets" element={<Datasets />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="payments" element={<Payments />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="ai" element={<AI />} />               {/* ✅ IA */}
        <Route path="blockchain" element={<Blockchain />} /> {/* ✅ Ledger */}
        <Route path="profile" element={<Profile />} />       {/* ✅ Profil */}
      </Route>
    </Routes>
  );
}

export default App;
