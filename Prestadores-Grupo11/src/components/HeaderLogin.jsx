import React from "react";
import { ArrowLeft } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import HeaderBase from "./HeaderBase";
import "./Header.css";

const HeaderLogin = () => {
  const navigate = useNavigate();

  // Acción del botón "Volver"
  const handleBackClick = () => navigate(-1);

  //Enlaces de navegación (visuales, no funcionales)
  const links = [
    { label: "AFILIADOS", to: "/" },
    { label: "PRESTADORES", to: "/" },
    { label: "ADMINISTRACIÓN", to: "/" },
  ];

  // Botón retroceso (extraContent)
  const extraContent = (
    <button
      className="btn btn-back"
      onClick={handleBackClick}
      aria-label="Volver atrás"
    >
      <ArrowLeft size={26} color="#000" />
    </button>
  );

  return (
    <HeaderBase
      links={links}
      extraContent={extraContent}
      className="header-login"
    />
  );
};

export default HeaderLogin;
