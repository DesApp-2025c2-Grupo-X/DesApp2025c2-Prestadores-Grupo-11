import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PrestadoresLayout from "../components/PrestadoresLayout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import SideBar from "../components/SideBar";
import { motion } from "framer-motion";
import { Save, ArrowLeft } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/SituacionesTerapeuticas.css";

export default function AltaSituacionTerapeutica() {
  const { dni } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    especialidad: "",
    situacion: "",
    observaciones: "",
    fecha: "",
    prestador: "",
    estado: "Activo",
  });

  // Refs para manejo de Enter → siguiente campo
  const refs = {
    especialidad: useRef(null),
    situacion: useRef(null),
    observaciones: useRef(null),
    fecha: useRef(null),
    prestador: useRef(null),
    estado: useRef(null),
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Limitar longitud del campo observaciones
    if (name === "observaciones" && value.length > 500) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejo del Enter → siguiente campo
  const handleKeyDown = (e, nextField) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (refs[nextField]?.current) {
        refs[nextField].current.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos requeridos
    for (const key in formData) {
      if (!formData[key]) {
        toast.error(`El campo "${key}" es obligatorio.`, {
          toastId: `campo-${key}`,
          autoClose: 2000,
        });
        return;
      }
    }

    try {
      // --- Simulación de guardado en JSON local ---
      // En un backend real, harías algo como:
      // await fetch(`/api/pacientes/${dni}/situaciones`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });

      // Mostrar toast de éxito
      toast.success("Situación terapéutica guardada con éxito", {
        toastId: "guardar-situacion",
        autoClose: 1500,
      });

      // Redirigir tras un pequeño delay
      setTimeout(() => {
        navigate(`/prestadores/situaciones/${dni}`);
      }, 1600);
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar la situación. Intenta nuevamente.", {
        toastId: "error-guardar-situacion",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <PrestadoresLayout header={HeaderPrestadores}>
        <div className="d-flex">
          <SideBar />
          <div className="flex-grow-1 p-4">
            {/* Botón volver */}
            <motion.button
              className="btn-volver mb-3"
              whileHover={{ scale: 1.05, backgroundColor: "var(--verde-agua)" }}
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
                <input
                  ref={refs.situacion}
                  type="text"
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
                  onKeyDown={(e) => handleKeyDown(e, "fecha")}
                  rows={3}
                  maxLength={500}
                  required
                />
                <div className="text-end text-muted small">
                  {formData.observaciones.length}/500 caracteres
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">Fecha Inicio</label>
                  <input
                    ref={refs.fecha}
                    type="date"
                    className="form-control"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, "prestador")}
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">Prestador</label>
                  <input
                    ref={refs.prestador}
                    type="text"
                    className="form-control"
                    name="prestador"
                    value={formData.prestador}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, "estado")}
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">Estado</label>
                  <select
                    ref={refs.estado}
                    className="form-select"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    required
                  >
                    <option>Activo</option>
                    <option>Terminado</option>
                  </select>
                </div>
              </div>

              <div className="text-end mt-4">
                <button type="submit" className="btn-accion">
                  <Save size={18} /> Guardar situación
                </button>
              </div>
            </form>
          </div>
        </div>
      </PrestadoresLayout>

      <ToastContainer position="top-right" theme="colored" />
    </>
  );
}
