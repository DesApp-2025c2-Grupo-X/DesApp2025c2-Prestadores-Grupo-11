
import React, { useEffect, useState } from "react";
import HeaderLogin from "./HeaderLogin"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Header.css"; // estilos compartidos + extensiones abajo

export default function LoginPage() {
  const [users, setUsers] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState({ text: "", variant: "" }); // variant: success | danger | info

  useEffect(() => {
    // Cargar usuarios desde /users.json (public folder)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", variant: "" });

    if (!username.trim() || !password) {
      setMessage({ text: "Completá usuario y contraseña.", variant: "danger" });
      return;
    }

    if (loadingUsers) {
      setMessage({ text: "Esperá: aún se cargan los datos.", variant: "info" });
      return;
    }

    if (fetchError) {
      setMessage({ text: "No se pueden validar credenciales ahora.", variant: "danger" });
      return;
    }

    setSubmitting(true);

    // Normalizamos username: comparación case-insensitive y trimmed
    const userMatch = (users || []).find(
      (u) => u.username.trim().toLowerCase() === username.trim().toLowerCase()
    );

    // Simulamos una pequeña latencia realista
    setTimeout(() => {
      if (userMatch && userMatch.password === password.trim()) {
        // Login exitoso
        setMessage({ text: `Bienvenido/a — ${userMatch.username}`, variant: "success" });
        // Ejemplo: guardamos un token simulado
        localStorage.setItem("miapp_user", JSON.stringify({ username: userMatch.username, role: userMatch.role }));
        // Aquí despues se redirige con react-router: navigate("/dashboard")
      } else {
        setMessage({ text: "Usuario o contraseña incorrectos.", variant: "danger" });
      }
      setSubmitting(false);
    }, 600);
  };

  return (
    <div className="login-page">
      <HeaderLogin />

      <main className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="login-card mt-5 p-4 text-center">

              <h2 className="fw-bold mb-4">BIENVENIDOS A MEDICINA INTEGRAL !</h2>

              {loadingUsers && (
                <div className="mb-3" role="status" aria-live="polite">Cargando datos...</div>
              )}

              {fetchError && (
                <div className="alert alert-danger" role="alert">
                  {fetchError}
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

                <div id="login-help" className="mt-3" aria-live="polite">
                  {message.text && (
                    <div
                      className={`alert ${message.variant === "success" ? "alert-success" : message.variant === "danger" ? "alert-danger" : "alert-info"} mt-2`}
                      role="alert"
                    >
                      {message.text}
                    </div>
                  )}
                </div>
              </form>

              <div className="mt-3 small text-muted">
                Usuarios de prueba: <strong>medico / 12345</strong> y <strong>centro medico / 9876</strong>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
