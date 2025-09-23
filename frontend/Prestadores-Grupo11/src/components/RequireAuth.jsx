
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ role, children }) {
  const location = useLocation();

  // Intentar leer usuario de localStorage
  const storedUser = localStorage.getItem("miapp_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Si no hay usuario -> al login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si el rol no coincide -> lo mandamos al home
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // Si pasa las validaciones -> renderiza el componente hijo
  return children;
}
