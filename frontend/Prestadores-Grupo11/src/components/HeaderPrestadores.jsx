import React from "react";
import "./Header.css";

const HeaderPrestadores = () => {
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
            data-bs-target="#navbarPrestadores"
            aria-controls="navbarPrestadores"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Contenido del navbar */}
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarPrestadores"
          >
            <ul className="navbar-nav align-items-center">
              {/* Nombre del prestador */}
              <li className="nav-item me-3 d-flex align-items-center">
                <span className="nav-link">NOMBRE DEL PRESTADOR</span>
                <i className="bi bi-person ms-2"></i> {/* Icono Bootstrap */}
              </li>

              {/* Botón Cerrar sesión */}
              <li className="nav-item">
                <a href="#cerrar" className="btn btn-ingresar">
                  CERRAR SESIÓN
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderPrestadores;
