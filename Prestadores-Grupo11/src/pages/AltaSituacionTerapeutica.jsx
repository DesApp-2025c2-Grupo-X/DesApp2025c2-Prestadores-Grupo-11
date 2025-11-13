import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrestadoresLayout from "../components/PrestadoresLayout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import SideBar from "../components/SideBar";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { crearSituacion } from "../services/SituacionesApi";

export default function AltaSituacionTerapeutica({ onNuevaSituacion, integranteInfo }) {
  
  const { dni, id, afiliadoId } = useParams();
  const navigate = useNavigate();

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

  // Validar sesión
  if (!prestadorId) {
    return (
      <div style={{ padding: "2rem" }}>
        <p>Error: No se encontró el prestador. Inicie sesión nuevamente.</p>
      </div>
    );
  }

  // Determinar tipo de paciente
  const esIntegrante = !!(id || dni || integranteInfo);
  const identificador = integranteInfo?.id || id || dni || afiliadoId;

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

  // Validaciones de campos del formulario
  if (!formData.especialidad.trim()) {
    toast.error("Debes ingresar la especialidad");
    return;
  }
  if (!formData.situacion.trim()) {
    toast.error("Debes describir la situación terapéutica");
    return;
  }
  if (!formData.fecha_inicio) {
    toast.error("Debes seleccionar la fecha de inicio");
    return;
  }

  setLoading(true);

  try {
    // Determinar si es integrante o afiliado
    const esIntegrante = !!dni || !!id;
    const identificador = afiliadoId || id || dni;

    // Construir payload asegurando IDs correctos
    const payload = {
      prestadorId,
      especialidad: formData.especialidad.trim(),
      situacion: formData.situacion.trim(),
      observaciones: formData.observaciones.trim(),
      fecha_inicio: formData.fecha_inicio,
      fecha_final: formData.fecha_inicio,
      estado: "alta",
      afiliadoId: esIntegrante ? null : identificador,
      integranteId: esIntegrante ? identificador : null,
    };

    console.log("Payload a enviar:", payload); // depuración

    // Crear situación en el backend
    const response = await crearSituacion(prestadorId, payload);

    toast.success("Situación terapéutica creada exitosamente", {
      autoClose: 2000,
    });

    // Resetear formulario
    setFormData({
      especialidad: "",
      situacion: "",
      observaciones: "",
      fecha_inicio: "",
    });

    // Notificar al componente padre si aplica
    if (onNuevaSituacion) {
      onNuevaSituacion(response.situacion || response);
    }

    // Volver atrás después de un momento
    setTimeout(() => navigate(-1), 1500);
  } catch (error) {
    console.error("Error al crear situación:", error);
    const mensaje =
      error.response?.data?.error || error.message || "Intenta nuevamente.";
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
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
                  required
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
                      <Loader2 size={18} className="me-2 spinner-border" />
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
