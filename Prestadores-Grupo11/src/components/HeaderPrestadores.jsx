
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Person } from "react-bootstrap-icons";
import HeaderBase from "./HeaderBase";

const HeaderPrestadores = () => {
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("miapp_user"));
  } catch (error) {
    console.error("Error al leer usuario:", error);
  }

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) return null;

  const displayName = user.username || "Usuario";

  const handleLogout = () => {
    localStorage.removeItem("miapp_user");
    navigate("/");
  };

  const extraContentRight = (
    <ul className="navbar-nav align-items-center">
      <li className="nav-item me-3 d-flex align-items-center">
        <span className="nav-link">{displayName}</span>
        <Person size={20} className="ms-2" />
      </li>
      <li className="nav-item">
        <button onClick={handleLogout} className="btn btn-ingresar">
          CERRAR SESIÓN
        </button>
      </li>
    </ul>
  );

  return <HeaderBase extraContentRight={extraContentRight} />;
};

export default HeaderPrestadores;
