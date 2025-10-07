import React from "react";
import HeaderBase from "./HeaderBase";

const HeaderHome = () => {
  const links = [
    { label: "QUIENES SOMOS", to: "/#quienes-somos" },
    { label: "NUESTROS SANATORIOS", to: "/#sanatorios" },
    { label: "NUESTROS PLANES", to: "/#planes" },
    { label: "SERVICIOS", to: "/#servicios" },
  ];

  const button = { label: "INGRESAR", to: "/login" };

  return <HeaderBase links={links} button={button} />;
};

export default HeaderHome;

