

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import DashboardMedico from "./pages/DashboardMedico";
import DashboardCentro from "./pages/DashboardCentro";
import RequireAuth from "./components/RequireAuth";  

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboards */}
        <Route
          path="/dashboard/medico"
          element={
            <RequireAuth role="medico">
              <DashboardMedico />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard/centro"
          element={
            <RequireAuth role="centro_medico">
              <DashboardCentro />
            </RequireAuth>
          }
        />

        {/* Not found -> redirect home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
