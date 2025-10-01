import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderBase from "./HeaderBase";

const HeaderPrestadores = () => {
  const navigate = useNavigate();

  // Obtener usuario desde localStorage
  const user = JSON.parse(localStorage.getItem("miapp_user"));

  // Si no hay usuario logueado, redirigir al home
  if (!user) {
    navigate("/");
    return null;
  }

  // Determinar nombre a mostrar
  const displayName =
    user.role === "medico"
      ? user.username
      : user.role === "centro_medico"
      ? user.username
      : "Usuario";

  // Función cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("miapp_user");
    navigate("/"); // Redirige al Home
  };

  // Contenido derecho: nombre + ícono usuario + botón logout
  const extraContentRight = (
    <div className="collapse navbar-collapse justify-content-end" id="navbarPrestadores">
      <ul className="navbar-nav align-items-center">
        {/* Nombre del usuario */}
        <li className="nav-item me-3 d-flex align-items-center">
          <span className="nav-link">{displayName}</span>
          <i className="bi bi-person ms-2"></i>
        </li>

        {/* Botón logout */}
        <li className="nav-item">
          <button onClick={handleLogout} className="btn btn-ingresar">
            CERRAR SESIÓN
          </button>
        </li>
      </ul>
    </div>
  );

  return <HeaderBase extraContentRight={extraContentRight} />;
};

export default HeaderPrestadores;

