import React from "react";
import Layout from "../components/Layout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import {PieChart,Pie,Cell,ResponsiveContainer,Tooltip,} from "recharts";
import {FaCalendarAlt,FaClipboardList,FaNotesMedical,FaUserMd,} from "react-icons/fa";
import "./Dashboard.css"


export default function Dashboard() {
  return (
    <Layout header={HeaderPrestadores}>
      <div className="dashboard-container">
        {/* Hero con imagen de fondo */}
        <div className="dashboard-hero">
          <h2 className="hero-title">👋 Bienvenido, Dr. Pérez</h2>
          <p className="hero-subtitle">
            Aquí encontrarás la información de tus pacientes y turnos.
          </p>
        </div>
       
        {/* Cards de Información */}
        <div className="row g-4 mt-3">
          <div className="col-md-3">
            <div className="info-card">
              <h5>Solicitudes Pendientes</h5>
              <p>20</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="info-card">
              <h5>Autorizaciones Pendientes</h5>
              <p>35</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="info-card">
              <h5>Recetas Pendientes</h5>
              <p>12</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="info-card">
              <h5>Reintegros  Pendientes</h5>
              <p>35</p>
            </div>
          </div>
       </div>
        {/* Accesos Directos */}
        <h2 className="section-title mt-5">Accesos Directos</h2>
        <div className="access-container">
          <div className="access-grid">
            <div className="access-card">
              <span>Calendario de Turnos</span>
              <FaCalendarAlt className="text-primary" />
            </div>
            <div className="access-card">
              <span>Gestión de Solicitudes</span>
              <FaClipboardList className="text-success" />
            </div>
            <div className="access-card">
              <span>Consultar Historia Clínica</span>
              <FaNotesMedical className="text-danger" />
            </div>
            <div className="access-card">
              <span>Situaciones Terapéuticas</span>
              <FaUserMd className="text-warning" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
