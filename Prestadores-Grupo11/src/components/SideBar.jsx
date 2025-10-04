import React from "react";
import { Link, useLocation } from "react-router-dom";
import { House, Calendar, FileText, Activity, BookOpen } from "lucide-react"; 
import "./SideBar.css";

const SideBar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/prestadores/home", label: "Home", icon: <House size={20} /> },
    { path: "/prestadores/turnos", label: "Calendario de Turnos", icon: <Calendar size={20} /> },
    { path: "/prestadores/solicitudes", label: "Gestión de Solicitudes", icon: <FileText size={20} /> },
    { path: "/prestadores/situaciones", label: "Situaciones Terapéuticas", icon: <Activity size={20} /> },
    { path: "/prestadores/historia-clinica", label: "Historia Clínica", icon: <BookOpen size={20} /> },
  ];

  return (
    <div className="sidebar d-flex flex-column align-items-center p-2">
      {menuItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
          title={item.label}
        >
          {item.icon}
        </Link>
      ))}
    </div>
  );
};

export default SideBar;
