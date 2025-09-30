
import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import HeaderPrestadores from "../components/HeaderPrestadores"; 

export default function DashboardCentro() {
  return (
    <Layout header={HeaderPrestadores}>
      <div className="mt-5">
        <h2>Dashboard Centro Médico</h2>
        <p>Aquí verás la administración del centro.</p>
        <Link to="/login" className="btn btn-primary mt-3">
          Ir al Login
        </Link>
      </div>
    </Layout>
  );
}
