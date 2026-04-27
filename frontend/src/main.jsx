import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import './index.css';
import "./styles/theme.css";
import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>       {/* ← THIS WAS MISSING — causes all useRoutes errors */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);