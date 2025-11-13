import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {Home,Calendar,FileText,Activity,BookOpen,X,Menu,} from "lucide-react";
import { useSidebar } from "../context/SidebarContext"; //  importa el contexto
import "./SideBar.css";

export default function SideBar() {
  const { open, toggle, closeSidebar } = useSidebar();

  //  Calcular ruta del calendario dinámicamente
  const getCalendarRoute = () => {
    const userStr = localStorage.getItem("miapp_user");
    if (!userStr) return "/prestadores/calendario";

    try {
      const user = JSON.parse(userStr);
      if (user?.role === "medico") return "/prestadores/calendario/medico";
      if (user?.role === "centro") return "/prestadores/calendario/centro";
      return "/prestadores/calendario";
    } catch (e) {
      console.error("Error parsing user data:", e);
      return "/prestadores/calendario";
    }
  };

  //  Construir el menú (recalcula en render)
  const menuItems = useMemo(
    () => [
      { to: "/dashboard", label: "Dashboard", Icon: Home },
      { to: getCalendarRoute(), label: "Calendario de Turnos", Icon: Calendar },
      { to: "/prestadores/solicitudes", label: "Gestión de Solicitudes", Icon: FileText },
      { to: "/prestadores/situaciones/busqueda", label: "Situaciones Terapéuticas", Icon: Activity },
      { to: "/prestadores/historialClinico/busqueda", label: "Historia Clínica", Icon: BookOpen },
    ],
    [] // podrías agregar dependencias si usás contexto de usuario
  );

  // Debug para ver qué ruta está tomando
  const handleCalendarClick = () => {
    console.log("Ruta dinámica del calendario:", getCalendarRoute());
    console.log("User localStorage:", localStorage.getItem("miapp_user"));
  };

  return (
    <>
      {/* ===== Sidebar fijo (desktop) ===== */}
      <nav className="sidebar-fixed flex-column align-items-center p-2">
        {menuItems.map((m) => (
          <Link
            key={m.label}
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
                key={m.label}
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