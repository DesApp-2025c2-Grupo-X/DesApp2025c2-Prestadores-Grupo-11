
import React from "react";
import { Link } from "react-router-dom";

export default function DashboardMedico() {
  return (
    <div className="container mt-5">
      <h2>Dashboard Médico</h2>
      <p>Aquí verás tus pacientes y turnos.</p>
       <Link to="/login" className="btn btn-primary mt-3">Ir al Login</Link>
    </div>
  );
}
