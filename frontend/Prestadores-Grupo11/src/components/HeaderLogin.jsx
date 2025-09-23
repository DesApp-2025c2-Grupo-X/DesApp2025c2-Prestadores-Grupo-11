import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; 
import "./Header.css";
import { ArrowLeft } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";

const HeaderLogin = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/"); // Redirige al Home
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light custom-navbar">
        <div className="container-fluid d-flex align-items-center">
          
          {/* Flecha hacia atrás */}
          <button className="btn p-0 me-3" onClick={handleBackClick}>
            <ArrowLeft size={28} color="black" />
          </button>

          {/* Logo */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img
              src="/Medicina_integralLogo.jpg"
              alt="Medicina Integral"
              className="logo"
            />
          </Link>

          {/* Botón hamburguesa */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarLogin"
            aria-controls="navbarLogin"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Links */}
          <div className="collapse navbar-collapse justify-content-end" id="navbarLogin">
            <ul className="navbar-nav me-3">
              <li className="nav-item">
                <Link className="nav-link" to="/">AFILIADOS</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/">PRESTADORES</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/">ADMINISTRACIÓN</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderLogin;
