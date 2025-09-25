import React from "react";
import HeaderBase from "./HeaderBase";

const HeaderHome = () => {
  const links = [
    { label: "QUIENES SOMOS", href: "#quienes-somos" },
    { label: "NUESTROS SANATORIOS", href: "#sanatorios" },
    { label: "NUESTROS PLANES", href: "#planes" },
    { label: "SERVICIOS", href: "#servicios" },
  ];

  const button = { label: "INGRESAR", href: "./Login" };

  return <HeaderBase links={links} button={button} />;
};

export default HeaderHome;

