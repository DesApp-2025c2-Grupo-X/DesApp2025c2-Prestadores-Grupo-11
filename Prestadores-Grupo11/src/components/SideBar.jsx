import React from "react";
import { Link } from "react-router-dom";
import {Home,Calendar,FileText,Activity,BookOpen,X,Menu,} from "lucide-react";
import { useSidebar } from "../context/SidebarContext"; //  importa el contexto
import "./SideBar.css";

const getCalendarRoute = () => {
  const userStr = localStorage.getItem("miapp_user");
  if (!userStr) return "/prestadores/calendario";

  try {
    const user = JSON.parse(userStr);
    return user.role === "medico"
      ? "/prestadores/calendario/medico"
      : "/prestadores/calendario/centro";
  } catch (e) {
    console.error("Error parsing user data:", e);
    return "/prestadores/calendario";
  }
};

const menuItems = [
  { 
    to: "/dashboard", 
    label: "Dashboard", 
    Icon: Home 
  },
  { to: getCalendarRoute(), 
    label: "Calendario de Turnos", 
    Icon: Calendar 
  },
  {
    to: "/prestadores/solicitudes",
    label: "Gestión de Solicitudes",
    Icon: FileText,
  },
  {
    to: "/prestadores/situaciones/busqueda",
    label: "Situaciones Terapéuticas",
    Icon: Activity,
  },
  {
    to: "/prestadores/historialClinico/busqueda",
    label: "Historia Clínica",
    Icon: BookOpen,
  },
];

export default function SideBar() {
  const { open, toggle, closeSidebar } = useSidebar();

  // Add debug log to check routing
  const handleCalendarClick = (e) => {
    console.log("Calendar route:", getCalendarRoute());
    console.log("User data:", localStorage.getItem("miapp_user"));
  };

  return (
    <>
      {/* ===== Sidebar fijo (desktop) ===== */}
      <nav className="sidebar-fixed flex-column align-items-center p-2">
        {menuItems.map((m) => (
          <Link
            key={m.to}
            to={m.to}
            className="sidebar-link"
            title={m.label}
            onClick={m.Icon === Calendar ? handleCalendarClick : undefined}
          >
            <m.Icon size={20} />
          </Link>
        ))}
      </nav>

      {/* ===== Botón toggle (mobile) ===== */}
      <button
        className="sidebar-toggle-btn"
        onClick={toggle}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* ===== Drawer móvil ===== */}
      <div className={`sidebar-drawer ${open ? "open" : ""}`}>
        <div className="sidebar-drawer-header">
          <button
            className="close-drawer-btn"
            onClick={closeSidebar}
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>
        <div className="sidebar-drawer-content">
          <div className="sidebar-drawer-menu">
            {menuItems.map((m) => (
              <Link
                key={m.to}
                to={m.to}
                className="sidebar-drawer-link"
                onClick={closeSidebar}
              >
                <m.Icon size={18} className="me-2" />
                <span>{m.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Backdrop ===== */}
      <div
        className={`sidebar-backdrop ${open ? "open" : ""}`}
        onClick={closeSidebar}
        aria-hidden={!open}
      />
    </>
  );
}
