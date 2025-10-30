import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import HeaderLogin from "../components/HeaderLogin";
import "../styles/Login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // === Validaciones iniciales ===
    if (!username.trim() || !password.trim()) {
      toast.error("Completá usuario y contraseña.");
      return;
    }

    setSubmitting(true);

    try {
      // Normalizar username y password
      const usernameNorm = String(username).trim().toLowerCase();
      const passwordNorm = String(password).trim(); // Convertir a string y remover espacios

      const payload = {
        username: usernameNorm,
        password: passwordNorm, // Usar password normalizado
      };

      console.log("Enviando payload de login (normalizado):", {
        username: usernameNorm,
        password: "[PROTECTED]", // No logear passwords en producción
      });

      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Respuesta HTTP login:", {
        status: res.status,
        statusText: res.statusText,
      });

      const rawBody = await res.text();
      const data = rawBody ? JSON.parse(rawBody) : {};

      console.log("Body de la respuesta:", data);

      if (!res.ok) {
        toast.error(data.message || "Credenciales incorrectas.");
        setSubmitting(false);
        return;
      }

      // === Manejo de respuesta exitosa ===
      if (data.message === "Acceso exitoso" && data.prestador) {
        const { id, username, role } = data.prestador;
        const normalizedRole = role.trim().toLowerCase(); // <-- ¡Asegura que es 'medico'!

        localStorage.setItem(
          "miapp_user",
          JSON.stringify({
            id: id,
            username: username,
            role: normalizedRole,
          })
        );

        toast.success(`Bienvenido/a — ${username}`);

        console.log("Redirigiendo a /dashboard para role:", normalizedRole);

        // Redirección después de un breve delay para que se vea el toast
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        toast.error(data.message || "Error en el inicio de sesión.");
      }
    } catch (err) {
      console.error("Error en login:", err);
      toast.error("No se pudo conectar con el servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout header={<HeaderLogin />}>
      <div className="login-page">
        <div className="d-flex justify-content-center align-items-center w-100">
          <div className="login-card text-center shadow-lg p-4 rounded">
            <h2 className="fw-bold mb-4">Bienvenidos a Medicina Integral</h2>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control custom-input"
                  placeholder="NÚMERO CUIT / MATRÍCULA"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>

              <div className="mb-4">
                <input
                  type="password"
                  className="form-control custom-input"
                  placeholder="CONTRASEÑA"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-login"
                  disabled={submitting}
                >
                  {submitting ? "Validando..." : "INGRESAR"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* === Toasts globales === */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </Layout>
  );
}
