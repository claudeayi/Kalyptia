import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext"; // ✅ ajout

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <NotificationProvider> {/* ✅ Fournit les notifs globales */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  </React.StrictMode>
);
