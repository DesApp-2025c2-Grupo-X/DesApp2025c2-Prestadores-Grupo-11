import React from "react";
import { Link } from "react-router-dom";
import { Home, Calendar, FileText, Activity, BookOpen, X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "../context/SidebarContext";
import "./Sidebar.css";


const menuItems = [
  { to: "/prestadores/home", label: "Home", Icon: Home },
  { to: "/prestadores/turnos", label: "Calendario de Turnos", Icon: Calendar },
  { to: "/prestadores/solicitudes", label: "Gestión de Solicitudes", Icon: FileText },
  { to: "/prestadores/situaciones", label: "Situaciones Terapéuticas", Icon: Activity },
  { to: "/prestadores/historia-clinica", label: "Historia Clínica", Icon: BookOpen },
];

export default function SideBar() {
  const { open, toggle, closeSidebar } = useSidebar();

  return (
    <>
      {/* ===== Fixed sidebar for large screens ===== */}
      <nav className="sidebar-fixed d-none d-lg-flex flex-column align-items-center p-2">
        {menuItems.map((m) => (
          <Link key={m.to} to={m.to} className="sidebar-link" title={m.label}>
            <m.Icon size={20} />
          </Link>
        ))}
      </nav>

      {/* ===== Mobile toggle button (if your header already has hamburger you can omit this) ===== */}
      <button
        className="sidebar-toggle-btn d-lg-none"
        aria-label="Abrir menú lateral"
        onClick={toggle}
      >
        <Menu size={20} />
      </button>

      {/* ===== Drawer + backdrop for small screens ===== */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
            />

            {/* Drawer */}
            <motion.aside
              className="sidebar-drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="sidebar-drawer-header">
                <button className="close-drawer-btn" onClick={closeSidebar} aria-label="Cerrar menú">
                  <X size={18} />
                </button>
              </div>

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
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

