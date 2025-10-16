
import React from "react";
import { Link } from "react-router-dom";
import { Home, Calendar, FileText, Activity, BookOpen } from "lucide-react";
import "./SideBar.css";

const menuItems = [
  { to: "/dashboard", label: "Dashboard", Icon: Home },
  { to: "/prestadores/turnos", label: "Calendario de Turnos", Icon: Calendar },
  { to: "/prestadores/solicitudes", label: "Gestión de Solicitudes", Icon: FileText },
  { to: "/prestadores/situaciones", label: "Situaciones Terapéuticas", Icon: Activity },
  { to: "/prestadores/historialClinico/busqueda", label: "Historia Clínica", Icon: BookOpen },
];

export default function SideBar({ onLinkClick }) {
  return (
    <>
      {/* ===== Fixed sidebar (pantallas grandes) ===== */}
      <nav className="sidebar-fixed d-none d-lg-flex flex-column align-items-center p-2">
        {menuItems.map((m) => (
          <Link key={m.to} to={m.to} className="sidebar-link" title={m.label}>
            <m.Icon size={20} />
          </Link>
        ))}
      </nav>

      {/* ===== Contenido del drawer (sólo se muestra en móvil por CSS d-lg-none) ===== */}
      <div className="sidebar-drawer-content d-lg-none">
        <div className="sidebar-drawer-header"> </div>
        <div className="sidebar-drawer-menu">
          {menuItems.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="sidebar-drawer-link"
              onClick={() => {
                if (onLinkClick) onLinkClick(); // cierra el drawer cuando navegás
              }}
            >
              <m.Icon size={18} className="me-2" />
              <span>{m.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
