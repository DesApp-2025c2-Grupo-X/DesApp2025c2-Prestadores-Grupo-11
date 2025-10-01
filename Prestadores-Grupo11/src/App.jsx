

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
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
          path="/dashboard"
          element={
            <RequireAuth role="medico">
              <Dashboard />
            </RequireAuth>
          }
        />
         <Route
          path="/dashboard"
          element={
            <RequireAuth role="centro_medico">
              <Dashboard />
            </RequireAuth>
          }
        />
    

        {/* Not found -> redirect home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
