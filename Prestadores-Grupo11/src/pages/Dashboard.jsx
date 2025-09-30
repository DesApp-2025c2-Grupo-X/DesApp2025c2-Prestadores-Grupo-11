import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import { BsPeopleFill, BsCalendarCheck, BsBarChartFill } from "react-icons/bs";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <Layout header={HeaderPrestadores}>
      <div className="container dashboard-container">
        {/* Sección Información */}
        <h2 className="section-title">Información</h2>
        <div className="row g-4 mb-5">
          <div className="col-6 col-md-3">
            <div className="info-card">
              <h5>Pacientes</h5>
              <p>120</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="info-card">
              <h5>Turnos</h5>
              <p>35</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="info-card">
              <h5>Consultas</h5>
              <p>50</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="info-card">
              <h5>Estudios</h5>
              <p>18</p>
            </div>
          </div>
        </div>

        {/* Sección Accesos Directos */}
        <h2 className="section-title">Accesos Directos</h2>
        <div className="row g-4">
          <div className="col-6 col-md-3">
            <div className="access-card">Pacientes</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="access-card">Turnos</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="access-card">Consultas</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="access-card">Estadísticas</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
