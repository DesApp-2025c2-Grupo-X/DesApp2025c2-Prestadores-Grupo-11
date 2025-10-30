import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ role, roles, children }) {
  const location = useLocation();

  const storedUser = localStorage.getItem("miapp_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    console.log("RequireAuth: No hay usuario logueado");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    console.log("RequireAuth: Rol no permitido (role prop)", {
      requiredRole: role,
      userRole: user.role,
    });
    return <Navigate to="/" replace />;
  }

  if (roles && (!Array.isArray(roles) || !roles.includes(user.role))) {
    console.log("RequireAuth: Rol no permitido (roles prop)", {
      allowedRoles: roles,
      userRole: user.role,
    });
    return <Navigate to="/" replace />;
  }

  console.log("RequireAuth: Acceso permitido", { userRole: user.role });
  return children;
}
