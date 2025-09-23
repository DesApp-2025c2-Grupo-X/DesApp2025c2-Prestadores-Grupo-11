import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Header.css";

const HeaderPrestadores = () => {
  const navigate = useNavigate();

  // Obtener información del usuario desde localStorage
  const user = JSON.parse(localStorage.getItem("miapp_user"));

  // Si no hay usuario logueado, redirigir al home
  if (!user) {
    navigate("/");
    return null;
  }

  // Determinar nombre a mostrar según rol
  const displayName =
    user.role === "medico"
      ? user.username
      : user.role === "centro"
      ? user.username
      : "Usuario";

  // Función cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("miapp_user");
    navigate("/"); // Redirige al Home
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light custom-navbar">
        <div className="container-fluid">
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
              {/* Nombre del usuario */}
              <li className="nav-item me-3 d-flex align-items-center">
                <span className="nav-link">{displayName}</span>
                <i className="bi bi-person ms-2"></i>
              </li>

              {/* Botón Cerrar sesión */}
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="btn btn-ingresar"
                >
                  CERRAR SESIÓN
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderPrestadores;
