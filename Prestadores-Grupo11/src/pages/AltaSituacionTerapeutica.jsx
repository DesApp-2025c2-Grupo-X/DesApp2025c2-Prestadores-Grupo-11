import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import SideBar from "../components/SideBar";
import { Save, ArrowLeft } from "lucide-react";
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

    // Aquí luego podés hacer un POST real o actualizar localStorage
    alert("Situación terapéutica guardada con éxito");
    navigate(`/detalle-situaciones/${dni}`);
  };

  return (
    <Layout header={<HeaderPrestadores />}>
      <div className="prestadores-layout d-flex">
        <SideBar />
        <div className="container p-4">
          <button
            className="btn btn-link text-decoration-none mb-3"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} /> Volver
          </button>

          <h3 className="fw-bold mb-4">Alta de Situación Terapéutica</h3>

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
                className="btn btn-success d-flex align-items-center gap-2 rounded-pill px-4 py-2"
              >
                <Save size={18} /> Guardar situación
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
