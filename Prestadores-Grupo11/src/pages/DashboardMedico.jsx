
import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import HeaderPrestadores from "../components/HeaderPrestadores"; 

export default function DashboarMedico() {
  return (
    <Layout header={HeaderPrestadores}>
      <div className="mt-5">
        <h2>Dashboard Médico</h2>
        <p>Aquí verás tus pacientes y turnos.</p>
        <Link to="/login" className="btn btn-primary mt-3">
          Ir al Login
        </Link>
      </div>
    </Layout>
  );
}
