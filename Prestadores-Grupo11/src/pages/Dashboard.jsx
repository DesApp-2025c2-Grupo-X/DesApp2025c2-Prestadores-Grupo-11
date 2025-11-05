import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PrestadoresLayout from "../components/PrestadoresLayout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import { Calendar, FileText, Activity, BookOpen } from "lucide-react";
import { getAutorizacionesPropiasAnalisis, getReintegrosPropiasAnalisis, getRecetasPropiasAnalisis } from "../services/Solicitudes";
import "../styles/Dashboard.css";

export default function Dashboard() {

  const [cantAutorizacionesPendientes, setCantAutorizacionesPendientes] = useState(0);
  const [cantRecetasPendientes, setCantRecetasPendientes] = useState(0);
  const [cantReintegrosPendientes, setCantReintegrosPendientes] = useState(0);


  // determinar ruta de calendario según el role del usuario (case-insensitive)
  const userStr = localStorage.getItem("miapp_user");
  let calendarPath = "/prestadores/calendario";
  try {
    const role = JSON.parse(userStr)?.role?.toString().trim().toLowerCase();
    if (role === "medico") calendarPath = "/prestadores/calendario/medico";
    else if (role === "centro_medico") calendarPath = "/prestadores/calendario/centro";
  } catch (e) {
    console.warn("No se pudo parsear miapp_user:", e);
  }

  useEffect(() => {
    const fetchCantidadSolicitudes = async () => {
      const prestador = JSON.parse(localStorage.getItem("miapp_user"));

      if (!prestador || !prestador.id) {
        console.error("No se encontró el prestador en el localStorage");
        return;
      }

      const autorizaciones = await getAutorizacionesPropiasAnalisis(prestador.id);
      const recetas = await getRecetasPropiasAnalisis(prestador.id);
      const reintegros = await getReintegrosPropiasAnalisis(prestador.id);

      setCantAutorizacionesPendientes(autorizaciones.length)
      setCantRecetasPendientes(recetas.length)
      setCantReintegrosPendientes(reintegros.length)
    }

    fetchCantidadSolicitudes()
  }, [])

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
                  <h5>Solicitudes "En analisis" pendientes</h5>
                  <p>{cantAutorizacionesPendientes + cantRecetasPendientes + cantReintegrosPendientes}</p>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div className="info-card">
                  <h5>Autorizaciones "En analisis" Pendientes</h5>
                  <p>{cantAutorizacionesPendientes}</p>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div className="info-card">
                  <h5>Recetas "En analisis" Pendientes</h5>
                  <p>{cantRecetasPendientes}</p>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div className="info-card">
                  <h5>Reintegros "En analisis" Pendientes</h5>
                  <p>{cantReintegrosPendientes}</p>
                </div>
              </div>
            </div>
          </div>

          {/* accesos directos */}
          <h2 className="section-title">Accesos Directos</h2>
          <div className="access-container">
            <div className="access-grid">
              {/* Calendario: usa calendarPath */}
              <Link to={calendarPath} className="access-card">
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
