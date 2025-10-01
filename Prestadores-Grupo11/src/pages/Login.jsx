
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import HeaderLogin from "../components/HeaderLogin"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../components/Header.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Cargar usuarios desde /users.json
    setLoadingUsers(true);
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

    if (!username.trim() || !password) {
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

    const userMatch = (users || []).find(
      (u) => u.username.trim().toLowerCase() === username.trim().toLowerCase()
    );

    // Simular latencia realista
    setTimeout(() => {
      if (userMatch) {
        if (userMatch.password === password.trim()) {
          // Login exitoso
          toast.success(`Bienvenido/a — ${userMatch.username}`);
          localStorage.setItem(
            "miapp_user",
            JSON.stringify({ username: userMatch.username, role: userMatch.role })
          );

          // Redirigir según rol
          if (userMatch.role === "medico") navigate("/dashboard");
          else if (userMatch.role === "centro_medico") navigate("/dashboard");
          else toast.error("Rol de usuario desconocido.");
        } else {
          toast.error("Contraseña incorrecta.");
        }
      } else {
        toast.error("Usuario no registrado.");
      }

      setSubmitting(false);
    }, 600);
  };

  return (
    <div className="login-page">
      <Layout header={HeaderLogin}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="login-card mt-5 p-4 text-center">
              <h2 className="fw-bold mb-4">BIENVENIDOS A MEDICINA INTEGRAL !</h2>

              {loadingUsers && (
                <div className="mb-3" role="status" aria-live="polite">
                  Cargando datos...
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate aria-describedby="login-help">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control custom-input"
                    placeholder="NÚMERO CUIT / MATRICULA"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    aria-label="usuario"
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
                    aria-label="contraseña"
                    autoComplete="current-password"
                  />
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-ingresar btn-login"
                    disabled={submitting || loadingUsers}
                    aria-disabled={submitting || loadingUsers}
                  >
                    {submitting ? "Validando..." : "INGRESAR"}
                  </button>
                </div>

                <div id="login-help" className="mt-3 small text-muted">
                  Usuarios de prueba: <strong>medico / 12345</strong> y <strong>centro medico / 9876</strong>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Layout>
    </div>
  );
}
