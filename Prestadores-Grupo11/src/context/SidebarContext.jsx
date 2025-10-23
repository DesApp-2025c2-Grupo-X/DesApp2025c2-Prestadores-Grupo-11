import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((prev) => !prev), []);
  const openSidebar = useCallback(() => setOpen(true), []);
  const closeSidebar = useCallback(() => setOpen(false), []);

  // 🔹 Cierra el sidebar si el usuario cambia a escritorio (>=1000px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1000 && open) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  // 🔹 Memoriza el contexto para evitar re-render en los consumidores
  const value = useMemo(
    () => ({ open, toggle, openSidebar, closeSidebar }),
    [open, toggle, openSidebar, closeSidebar]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar debe usarse dentro de un <SidebarProvider>");
  }
  return context;
}
