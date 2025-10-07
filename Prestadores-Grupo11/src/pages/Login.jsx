import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import HeaderLogin from "../components/HeaderLogin";
import "../styles/login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  //  Cargar usuarios desde /users.json (en public/)
  useEffect(() => {
    fetch("/users.json")
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar users.json");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setFetchError(null);
      })
      .catch((err) => {
        console.error("Error fetch users.json:", err);
        setFetchError("Error al cargar datos de usuarios.");
      })
      .finally(() => setLoadingUsers(false));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("Completá usuario y contraseña.");
      return;
    }

    if (loadingUsers) {
      toast.info("Esperá: aún se cargan los datos.");
      return;
    }

    if (fetchError) {
      toast.error("No se pueden validar credenciales ahora.");
      return;
    }

    setSubmitting(true);

    const userMatch = users.find(
      (u) => u.username.trim().toLowerCase() === username.trim().toLowerCase()
    );

    setTimeout(() => {
      if (userMatch && userMatch.password === password.trim()) {
        toast.success(`Bienvenido/a — ${userMatch.username}`);
        localStorage.setItem(
          "miapp_user",
          JSON.stringify({ username: userMatch.username, role: userMatch.role })
        );

        //  Redirigir según rol
        if (userMatch.role === "medico" || userMatch.role === "centro_medico") {
          navigate("/dashboard");
        } else {
          toast.error("Rol de usuario desconocido.");
        }
      } else {
        toast.error("Credenciales incorrectas.");
      }

      setSubmitting(false);
    }, 700);
  };

  return (
     <Layout header={<HeaderLogin />}>
      <div className="login-page">
        <div className="d-flex justify-content-center align-items-center w-100">
          <div className="login-card text-center">
            <h2 className="fw-bold mb-4">Bienvenidos a Medicina Integral</h2>

            {loadingUsers && (
              <p className="mb-3 text-muted">Cargando datos de acceso...</p>
            )}

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
                  disabled={submitting || loadingUsers}
                >
                  {submitting ? "Validando..." : "INGRESAR"}
                </button>
              </div>
            </form>

            <p id="login-help" className="mt-3 small text-muted">
              Usuarios de prueba:{" "}
              <strong>medico / 12345</strong> —{" "}
              <strong>centro medico / 9876</strong>
            </p>
          </div>
        </div>
      </div>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </Layout>
    
  );
}
