import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; 
import "./Header.css";
import { ArrowLeft } from "react-bootstrap-icons";

const HeaderLogin = () => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light custom-navbar">
        <div className="container-fluid d-flex align-items-center">
          
          {/* Flecha hacia atrás */}
          <button className="btn p-0 me-3">
            <ArrowLeft size={28} color="black" />
          </button>

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
                <a className="nav-link" href="#afiliados">AFILIADOS</a>
              </li>
              <li className="nav-item">
                <a className="nav-link " href="#prestadores">
                  PRESTADORES
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#administracion">ADMINISTRACIÓN</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderLogin;
