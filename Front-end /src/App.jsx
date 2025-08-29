import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Datasets from "./pages/Datasets";
import Transactions from "./pages/Transactions";
import Payments from "./pages/Payments";
import Analytics from "./pages/Analytics";
import AI from "./pages/AI";             
import Blockchain from "./pages/Blockchain"; 
import Profile from "./pages/Profile";       
import Activity from "./pages/Activity";     
import Home from "./pages/Home";             
import Marketplace from "./pages/Marketplace"; 
import Notifications from "./pages/Notifications"; 

// ✅ IA Insights
import Suggestions from "./pages/Suggestions";
import Anomalies from "./pages/Anomalies";
import Predictions from "./pages/Predictions";

function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard + sous-pages */}
      <Route path="/" element={<Dashboard />}>
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

        {/* ✅ IA Insights */}
        <Route path="ai/suggestions" element={<Suggestions />} />
        <Route path="ai/anomalies" element={<Anomalies />} />
        <Route path="ai/predictions" element={<Predictions />} />
      </Route>
    </Routes>
  );
}

export default App;
