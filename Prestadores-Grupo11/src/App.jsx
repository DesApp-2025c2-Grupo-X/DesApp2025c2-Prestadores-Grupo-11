import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RequireAuth from "./components/RequireAuth";
import BusquedaSituacionesTerapeuticas from "./pages/BusquedaSituacionesTerapeuticas";
import SituacionesTerapeuticas from "./pages/SituacionesTerapeuticas";
import AltaSituacionTerapeutica from "./pages/AltaSituacionTerapeutica";
import CalendarioTurnosMedico from "./pages/CalendarioTurnosMedico";
import BusquedaHistorialClinico from "./pages/BusquedaHistorialClinico";
import HistorialClinico from "./pages/HistorialClinico";

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
          path="/prestadores/situaciones/busqueda"
          element={
            <RequireAuth roles={["medico", "centro_medico"]}>
              <BusquedaSituacionesTerapeuticas />
            </RequireAuth>
          }
        />

        <Route
          path="/prestadores/situaciones/:dni"
          element={
            <RequireAuth roles={["medico", "centro_medico"]}>
              <SituacionesTerapeuticas />
            </RequireAuth>
          }
        />

        {/* Historial clinico */}
        
        <Route
          path="/prestadores/historialClinico/busqueda"
          element={
            <RequireAuth roles={["medico", "centro_medico"]}>
              <BusquedaHistorialClinico />
            </RequireAuth>
          }
        />

        <Route
          path="/prestadores/historialClinico/:dni"
          element={
            <RequireAuth roles={["medico", "centro_medico"]}>
              <HistorialClinico />
            </RequireAuth>
          }
        />

        {/* Alta de Situación Terapéutica */}
        <Route
          path="/prestadores/situaciones/alta/:dni"
          element={
            <RequireAuth roles={["medico", "centro_medico"]}>
              <AltaSituacionTerapeutica />
            </RequireAuth>
          }
        />

        {/* Calendario Turnos Medico */}
        <Route
          path="/prestadores/calendarioturnosmedico"
          element={
            <RequireAuth roles={["medico", "centro_medico"]}>
              <CalendarioTurnosMedico />
            </RequireAuth>
          }
        />

        {/* Not found -> redirect home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
