import React from "react";
import { ArrowLeft } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import HeaderBase from "./HeaderBase";

const HeaderLogin = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/"); // Redirige al Home
  };

  const links = [
    { label: "AFILIADOS", href: "/" },
    { label: "PRESTADORES", href: "/" },
    { label: "ADMINISTRACIÓN", href: "/" },
  ];

  // Flecha atrás como extraContent
  const extraContent = (
    <button className="btn p-0" onClick={handleBackClick}>
      <ArrowLeft size={28} color="black" />
    </button>
  );

  return <HeaderBase links={links} extraContent={extraContent} />;
};

export default HeaderLogin;
