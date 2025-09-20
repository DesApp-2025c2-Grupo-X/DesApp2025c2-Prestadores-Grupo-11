import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; 
import "./Header.css";

const HeaderHome = () => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light custom-navbar">
        <div className="container-fluid">
          {/* Logo */}
          <a className="navbar-brand d-flex align-items-center" href="#">
            <img
              src="/Medicina_integralLogo.jpg"
              alt="Medicina Integral"
              className="logo"
            />
          </a>

          {/* Botón hamburguesa */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarHome"
            aria-controls="navbarHome"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Links */}
          <div className="collapse navbar-collapse justify-content-end" id="navbarHome">
            <ul className="navbar-nav me-3">
              <li className="nav-item">
                <a className="nav-link" href="#quienes-somos">QUIENES SOMOS</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#sanatorios">NUESTROS SANATORIOS</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#planes">NUESTROS PLANES</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#servicios">SERVICIOS</a>
              </li>
            </ul>

            {/* Botón Ingresar */}
            <a href="#ingresar" className="btn btn-ingresar">
              INGRESAR →
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderHome;
