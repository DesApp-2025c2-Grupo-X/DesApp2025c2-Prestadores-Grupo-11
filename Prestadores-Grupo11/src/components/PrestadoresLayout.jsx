import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Layout from "./Layout";
import SideBar from "./SideBar";
import HeaderPrestadores from "./HeaderPrestadores";
import { SidebarProvider, useSidebar } from "../context/SidebarContext"; //usamos el contexto
import "./PrestadoresLayout.css";

//  Este componente usa directamente el contexto del sidebar
function PrestadoresContent({ children }) {
  const { open, toggle, closeSidebar } = useSidebar(); // estado global del sidebar

  return (
    <Layout header={<HeaderPrestadores />}>
      <div className="prestadores-layout d-flex">
        {/* ===== Botón hamburguesa (solo móvil) ===== */}
        <button
          className="sidebar-toggle"
          onClick={toggle}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          role="button"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* ===== Sidebar animado ===== */}
        <AnimatePresence>
          {open && (
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
                <SideBar /> {/* ya no necesita props */}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ===== Contenido principal ===== */}
        <div className="prestadores-content flex-grow-1">
          {children}
        </div>
      </div>
    </Layout>
  );
}

// El provider envuelve todo el layout
export default function PrestadoresLayout({ children }) {
  return (
    <SidebarProvider>
      <PrestadoresContent>{children}</PrestadoresContent>
    </SidebarProvider>
  );
}

