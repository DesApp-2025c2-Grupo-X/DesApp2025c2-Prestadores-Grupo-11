import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Header.css";
import logo from "../assets/Medicina_integralLogo.jpg";

const HeaderBase = ({ links = [], button, extraContent, extraContentRight }) => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light custom-navbar">
        <div className="container-fluid d-flex align-items-center">
          
          {/* Extra content (ej: flecha atrás) */}
          {extraContent && <div className="me-3">{extraContent}</div>}

          {/* Logo */}
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img
              src={logo}
              alt="Medicina Integral"
              className="logo"
            />
          </a>

          {/* Botón hamburguesa */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarBase"
            aria-controls="navbarBase"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Links y contenido derecho */}
          <div className="collapse navbar-collapse justify-content-end" id="navbarBase">
            <ul className="navbar-nav me-3">
              {links.map((link, index) => (
                <li key={index} className="nav-item">
                  <a className="nav-link" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Botón dinámico */}
            {button && (
              <a href={button.href} className="btn btn-ingresar">
                {button.label} →
              </a>
            )}

            {/* Contenido especial (ej: nombre usuario + logout) */}
            {extraContentRight && <div className="d-flex align-items-center">{extraContentRight}</div>}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderBase;
