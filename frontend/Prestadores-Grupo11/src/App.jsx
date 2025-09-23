
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./Home";
import LoginPage from "./Login";
import DashboardMedico from "./DashboardMedico";
import DashboardCentro from "./DashboardCentro";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboards */}
        <Route path="/dashboard/medico" element={<RequireAuth role="medico"><DashboardMedico /></RequireAuth>} />
        <Route path="/dashboard/centro" element={<RequireAuth role="centro_medico"><DashboardCentro /></RequireAuth>} />

        {/* Not found -> redirect home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

/* HOC simple de protección por rol */
function RequireAuth({ children, role }) {
  const stored = localStorage.getItem("miapp_user");
  if (!stored) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(stored);
  if (user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
