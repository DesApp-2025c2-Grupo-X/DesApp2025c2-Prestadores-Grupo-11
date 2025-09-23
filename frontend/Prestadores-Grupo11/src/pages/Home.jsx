
import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="container text-center mt-5">
      <h1>Bienvenido a Medicina Integral</h1>
      <p className="lead">Accedé al sistema según tu perfil.</p>
      <Link to="/login" className="btn btn-primary mt-3">Ir al Login</Link>
    </div>
  );
}
