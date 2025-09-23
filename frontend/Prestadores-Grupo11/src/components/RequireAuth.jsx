
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children, role }) {
  const location = useLocation();
  const stored = localStorage.getItem("miapp_user");

  if (!stored) {
    // guarda la ruta origen en state para poder volver después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  let user = null;
  try {
    user = JSON.parse(stored);
  } catch (err) {
    console.error("Error parseando usuario:", err);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // chequeo simple de rol
  if (!user?.role || user.role !== role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // si todo OK, renderiza el contenido protegido
  return children;
}

