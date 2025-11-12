import React from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Header.css";
import logo from "../assets/Medicina_integralLogo.jpg";
import logoSinFondo from "../assets/medicinaLogoSinFondo.png"

const HeaderBase = ({
  links = [],
  button,
  extraContent,
  extraContentRight,
  className = "",
}) => {
  const location = useLocation();

  return (
    <header className={`header-base ${className}`}>
      <nav className="navbar navbar-expand-lg navbar-light custom-navbar shadow-sm">
        <div className="container-fluid align-items-center px-3 px-md-4">
          {/*  Contenido adicional a la izquierda  */}
          {extraContent && (
            <div className="d-flex align-items-center me-2 me-md-3">
              {extraContent}
            </div>
          )}

          {/*  Logo principal */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img
              src={logoSinFondo}
              alt="Medicina Integral - Logo"
              className="logo"
              draggable="false"
            />
          </Link>

          {/*  Botón hamburguesa */}
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarBase"
            aria-controls="navbarBase"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/*  Contenido colapsable */}
          <div
            className="collapse navbar-collapse justify-content-end mt-2 mt-lg-0"
            id="navbarBase"
          >
            {/*  Enlaces principales */}
            {links.length > 0 && (
              <ul className="navbar-nav me-lg-3">
                {links.map((link, index) => (
                  <li key={index} className="nav-item">
                    <Link
                      to={link.to}
                      className={`nav-link ${
                        location.pathname === link.to ? "active" : ""
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {/*  Botón derecho (opcional) */}
            {button && (
              <Link to={button.to} className="btn btn-ingresar ms-lg-2">
                {button.label} →
              </Link>
            )}

            {/*  Contenido adicional derecho (ej. avatar, logout) */}
            {extraContentRight && (
              <div className="d-flex align-items-center ms-2">
                {extraContentRight}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderBase;
