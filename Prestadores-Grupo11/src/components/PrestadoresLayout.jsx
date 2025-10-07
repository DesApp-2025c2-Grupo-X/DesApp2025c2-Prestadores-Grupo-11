import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Layout from "./Layout";
import SideBar from "./SideBar";
import HeaderPrestadores from "./HeaderPrestadores";
import "./PrestadoresLayout.css";

export default function PrestadoresLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <Layout header={<HeaderPrestadores />}>
      <div className="prestadores-layout d-flex">
        {/* Botón hamburguesa (solo móvil) */}
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
          role="button"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Sidebar animado */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Fondo semitransparente */}
              <motion.div
                className="sidebar-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                onClick={closeSidebar}
              />

              {/* Sidebar flotante */}
              <motion.div
                className="sidebar-container"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 70 }}
              >
                <SideBar onClose={closeSidebar} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Contenido principal */}
        <div className="prestadores-content flex-grow-1">
          {children}
        </div>
      </div>
    </Layout>
  );
}
