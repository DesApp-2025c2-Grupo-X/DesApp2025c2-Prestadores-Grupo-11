
import React from "react";
import { Link } from "react-router-dom";

export default function DashboardCentro() {
  return (
    <div className="container mt-5">
      <h2>Dashboard Centro Médico</h2>
      <p>Aquí verás la administración del centro.</p>
      <Link to="/login" className="btn btn-primary mt-3">Ir al Login</Link>
    </div>
  );
}
