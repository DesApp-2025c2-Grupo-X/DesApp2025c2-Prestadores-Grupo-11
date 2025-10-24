import React from "react";
import { Link } from "react-router-dom";
import PrestadoresLayout from "../components/PrestadoresLayout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import { Calendar, FileText, Activity, BookOpen } from "lucide-react";
import "../styles/Dashboard.css";

export default function Dashboard() {
  return (
    <PrestadoresLayout header={HeaderPrestadores}>
      <div className="dashboard-container">
          {/* HERO */}
          <div className="dashboard-hero">
            <h2 className="hero-title">👋 Bienvenido</h2>
            <p className="hero-subtitle">
              Aquí encontrarás la información de tus pacientes y turnos.
            </p>
          </div>

          {/* --- GRID PRINCIPAL: LEFT = CARDS (50%) | RIGHT = ACCESOS (50%) --- */}
          <div className="row g-4 mt-3">
            {/* Columna izquierda: cards */}
            <div className="col-12 col-lg-8">
              <div className="row g-4">
                <div className="col-12 col-sm-6 col-lg-3">
                  <div className="info-card">
                    <h5>Solicitudes Pendientes</h5>
                    <p>20</p>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3">
                  <div className="info-card">
                    <h5>Autorizaciones Pendientes</h5>
                    <p>35</p>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3">
                  <div className="info-card">
                    <h5>Recetas Pendientes</h5>
                    <p>12</p>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3">
                  <div className="info-card">
                    <h5>Reintegros Pendientes</h5>
                    <p>35</p>
                  </div>
                </div>
              </div>
            </div>

            {/* accesos directos */}
            <h2 className="section-title">Accesos Directos</h2>
            <div className="access-container">
              <div className="access-grid">
                {/* Calendario */}
                <Link to="/prestadores/calendarioturnosmedico" className="access-card">
                  <span>Calendario de Turnos</span>
                  <Calendar className="text-primary" />
                </Link>

                {/* Solicitudes */}
                <Link to="/prestadores/solicitudes" className="access-card">
                  <span>Gestión de Solicitudes</span>
                  <FileText className="text-primary" />
                </Link>

                {/* Historia Clínica */}
                <Link
                  to="/prestadores/historialClinico/busqueda"
                  className="access-card"
                >
                  <span>Consultar Historia Clínica</span>
                  <BookOpen className="text-danger" />
                </Link>

                {/* Situaciones Terapéuticas */}
                <Link
                  to="/prestadores/situaciones/busqueda"
                  className="access-card"
                >
                  <span>Situaciones Terapéuticas</span>
                  <Activity className="text-danger" />
                </Link>
              </div>
            </div>
          </div>
        </div>
    
    </PrestadoresLayout>
  );
}
