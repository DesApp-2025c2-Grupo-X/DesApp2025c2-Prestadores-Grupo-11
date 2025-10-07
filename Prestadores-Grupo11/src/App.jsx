import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RequireAuth from "./components/RequireAuth";

import BusquedaSituacionesTerapeuticas from "./pages/BusquedaSituacionesTerapeuticas";
import DetalleSituacionesTerapeuticas from "./pages/DetalleSituacionesTerapeuticas";
import SituacionesTerapeuticas from "./pages/SituacionesTerapeuticas";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard protegido */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth roles={["medico", "centro_medico"]}>
              <Dashboard />
            </RequireAuth>
          }
        />

        {/* Situaciones Terapéuticas - protegidas */}
        <Route
          path="/prestadores/situaciones"
          element={
            <RequireAuth roles={["medico", "centro_medico"]}>
              <SituacionesTerapeuticas />
            </RequireAuth>
          }
        />

        <Route
          path="/prestadores/situaciones/busqueda"
          element={
            <RequireAuth roles={["medico", "centro_medico"]}>
              <BusquedaSituacionesTerapeuticas />
            </RequireAuth>
          }
        />

        <Route
          path="/prestadores/situaciones/detalle/:dni"
          element={
            <RequireAuth roles={["medico", "centro_medico"]}>
              <DetalleSituacionesTerapeuticas />
            </RequireAuth>
          }
        />


        {/* Not found -> redirect home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
