import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ role, roles, children }) {
  const location = useLocation();

  // Intentar leer usuario de localStorage
  const storedUser = localStorage.getItem("miapp_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Si no hay usuario -> al login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Validación de rol
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
    console.log("RequireAuth checking roles:", {
      allowedRoles: roles,
      userRole: JSON.parse(localStorage.getItem("miapp_user"))?.role,
    });
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  console.log("RequireAuth checking roles:", {
    allowedRoles: roles,
    userRole: JSON.parse(localStorage.getItem("miapp_user"))?.role,
  });
  // Si pasa las validaciones -> renderiza el componente hijo
  return children;
}
