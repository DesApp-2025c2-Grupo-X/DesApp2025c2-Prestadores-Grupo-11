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
      : user.role === "centro"
      ? user.username
      : "Usuario";

  // Función cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("miapp_user");
    navigate("/"); // Redirige al Home
  };

  // Contenido derecho: nombre + botón logout
  const extraContentRight = (
    <>
      <span className="nav-link me-3">{displayName}</span>
      <button onClick={handleLogout} className="btn btn-ingresar">
        CERRAR SESIÓN
      </button>
    </>
  );

  return <HeaderBase extraContentRight={extraContentRight} />;
};

export default HeaderPrestadores;
