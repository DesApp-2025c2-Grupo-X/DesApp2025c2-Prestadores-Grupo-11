import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PrestadoresLayout from "../components/PrestadoresLayout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import SideBar from "../components/SideBar";
import { motion } from "framer-motion";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import "../styles/SituacionesTerapeuticas.css";

export default function AltaSituacionTerapeutica() {
  const { dni } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    especialidad: "",
    situacion: "",
    fecha: "",
    prestador: "",
    estado: "Activo",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  console.log("Nueva situación:", formData);
  // fetch() o localStorage.setItem()

  toast.success("Situación terapéutica guardada con éxito");

  // Redirigir después de mostrar el toast
  navigate(`/prestadores/situaciones/detalle/${dni}`);
};


  return (
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
          <h3> Alta Situacion Terapéutica</h3>
          <form
            className="card p-4 shadow-sm rounded formulario-alta"
            onSubmit={handleSubmit}
          >
            <div className="mb-3">
              <label className="form-label fw-semibold">Especialidad</label>
              <input
                type="text"
                className="form-control"
                name="especialidad"
                value={formData.especialidad}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Situación</label>
              <input
                type="text"
                className="form-control"
                name="situacion"
                value={formData.situacion}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Fecha fin</label>
                <input
                  type="date"
                  className="form-control"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Prestador</label>
                <input
                  type="text"
                  className="form-control"
                  name="prestador"
                  value={formData.prestador}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Estado</label>
                <select
                  className="form-select"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                >
                  <option>Activo</option>
                  <option>Terminado</option>
                </select>
              </div>
            </div>

            <div className="text-end mt-4">
              <button
                type="submit"
                className="btn-accion"
              >
                <Save size={18} /> Guardar situación
              </button>
            </div>
          </form>
        </div>
      </div>
    </PrestadoresLayout>
  );
}
