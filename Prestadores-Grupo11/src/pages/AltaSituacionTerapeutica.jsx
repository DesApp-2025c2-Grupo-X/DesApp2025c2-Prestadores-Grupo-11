import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PrestadoresLayout from "../components/PrestadoresLayout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import SideBar from "../components/SideBar";
import { motion } from "framer-motion";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/SituacionesTerapeuticas.css";
import { crearSituacion } from "../services/SituacionesApi";

export default function AltaSituacionTerapeutica({ onNuevaSituacion }) {
  const { dni } = useParams(); // ID del afiliado o integrante
  const navigate = useNavigate();

  // Obtener prestadorId del usuario logueado
  const storedUser = JSON.parse(localStorage.getItem("miapp_user"));
  const prestadorId = storedUser?.id;

  const [formData, setFormData] = useState({
    especialidad: "",
    situacion: "",
    observaciones: "",
    fecha_inicio: "",
  });

  const [loading, setLoading] = useState(false);

  const refs = {
    especialidad: useRef(null),
    situacion: useRef(null),
    observaciones: useRef(null),
    fecha_inicio: useRef(null),
  };

  // Validar sesión al cargar
  if (!prestadorId || !dni) {
    return (
      <div style={{ padding: "2rem" }}>
        <p>
          Error: No se encontró prestador o afiliado. Por favor, inicie sesión
          nuevamente.
        </p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "observaciones" && value.length > 1000) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e, nextField) => {
    if (e.key === "Enter" && nextField) {
      e.preventDefault();
      refs[nextField]?.current?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.especialidad.trim()) {
      toast.error("Debes ingresar la especialidad", { autoClose: 2000 });
      return;
    }
    if (!formData.situacion.trim()) {
      toast.error("Debes describir la situación terapéutica", {
        autoClose: 2000,
      });
      return;
    }
    if (!formData.fecha_inicio) {
      toast.error("Debes seleccionar la fecha de inicio", { autoClose: 2000 });
      return;
    }

    setLoading(true);

    try {
      const integranteId = dni; // asumimos que dni = id del integrante
      const payload = {
        afiliadoId: storedUser?.afiliadoId, // si lo tenés, o ajusta según tu lógica
        integranteId, // OBLIGATORIO
        prestadorId, // del usuario logueado
        especialidad: formData.especialidad.trim(),
        situacion: formData.situacion.trim(),
        observaciones: formData.observaciones.trim(),
        fecha_inicio: formData.fecha_inicio,
        fecha_final: formData.fecha_inicio,
        estado: "alta",
      };

      const response = await crearSituacion(prestadorId, payload);

      toast.success("Situación terapéutica creada exitosamente", {
        autoClose: 1500,
      });

      setFormData({
        especialidad: "",
        situacion: "",
        observaciones: "",
        fecha_inicio: "",
      });

      if (onNuevaSituacion) {
        onNuevaSituacion(response.situacion || response);
      }
    } catch (error) {
      console.error("Error al crear situación:", error);
      const mensaje =
        error.data?.error || error.message || "Intenta nuevamente.";
      toast.error(`Error al guardar la situación: ${mensaje}`, {
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PrestadoresLayout header={<HeaderPrestadores />}>
        <div className="d-flex">
          <SideBar />
          <div className="flex-grow-1 p-4">
            <motion.button
              className="btn-volver mb-3"
              whileHover={{ scale: 1.05, backgroundColor: "var(--verde-agua)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
            >
              <ArrowLeft size={18} className="me-2" /> Volver
            </motion.button>

            <h3>Alta Situación Terapéutica</h3>

            <form
              className="card p-4 shadow-sm rounded formulario-alta"
              onSubmit={handleSubmit}
            >
              <div className="mb-3">
                <label className="form-label fw-semibold">Especialidad</label>
                <input
                  ref={refs.especialidad}
                  type="text"
                  className="form-control"
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, "situacion")}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Situación</label>
                <textarea
                  ref={refs.situacion}
                  className="form-control"
                  name="situacion"
                  value={formData.situacion}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, "observaciones")}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Observaciones</label>
                <textarea
                  ref={refs.observaciones}
                  className="form-control"
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  rows={3}
                  maxLength={1000}
                />
                <div className="text-end text-muted small">
                  {formData.observaciones.length}/1000 caracteres
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Fecha Inicio</label>
                <input
                  ref={refs.fecha_inicio}
                  type="date"
                  className="form-control"
                  name="fecha_inicio"
                  value={formData.fecha_inicio}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="d-flex justify-content-end pt-3">
                <motion.button
                  type="submit"
                  className="btn btn-success d-flex align-items-center gap-2 px-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={18}
                        className="me-2 spinner-border spinner-border-sm"
                      />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={18} /> Guardar
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </PrestadoresLayout>
      <ToastContainer />
    </>
  );
}
