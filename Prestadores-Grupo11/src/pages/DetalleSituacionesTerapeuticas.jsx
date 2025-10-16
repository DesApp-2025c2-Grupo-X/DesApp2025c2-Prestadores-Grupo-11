import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PrestadoresLayout from "../components/PrestadoresLayout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import SideBar from "../components/SideBar";
import { ArrowLeft, Folder, Pencil, Plus } from "lucide-react";
import { motion } from "framer-motion";
import "../styles/SituacionesTerapeuticas.css";

export default function DetalleSituacionesTerapeuticas() {
  const { dni } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);

  useEffect(() => {
    fetch("/familias.json")
      .then((res) => res.json())
      .then((data) => {
        const encontrado = data
          .flatMap((familias) => familias.integrantes)
          .find((i) => i.dni === dni);
        setPaciente(encontrado || null);
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, [dni]);

  if (!paciente) {
    return (
      <PrestadoresLayout header={<HeaderPrestadores />}>
        <div className="prestadores-layout d-flex">
          <SideBar />
          <div className="container mt-5 text-center">
            <h4>Cargando datos del paciente...</h4>
          </div>
        </div>
      </PrestadoresLayout>
    );
  }

  const totalSituaciones = paciente.situaciones.length;
  const terminadas = paciente.situaciones.filter(
    (s) => s.estado.toLowerCase() === "terminada"
  ).length;

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
          <h3> Detalle Situaciones Terapéuticas</h3>
          {/* Card familia */}
          <motion.div
            className="familia-card p-3 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 10px rgba(251, 195, 194, 0.6)",
            }}
          >
            <button
              className="btn-accion"
              onClick={() => navigate(`/prestadores/situaciones/alta/${dni}`)}

            >
              <Plus size={18} /> Nueva situación
            </button>
           </motion.div>

          {/* === ENCABEZADO DEL PACIENTE === */}
          <div className="paciente-card p-3 rounded shadow-sm bg-light mb-4">
            <div className="d-flex align-items-center">
              <div className="paciente-avatar me-3">
                <i className="bi bi-person-circle fs-1"></i>
              </div>
              <div>
                <h5 className="mb-1 fw-semibold">{paciente.nombre}</h5>
                <div className="text-muted small">
                  DNI: {paciente.dni} <br />
                  Edad: {paciente.edad}
                </div>
              </div>
              <div className="ms-auto resumen bg-success-subtle p-3 rounded">
                <div className="d-flex flex-column align-items-end">
                  <span>Situaciones terapéuticas: {totalSituaciones}</span>
                  <span>Situaciones terminadas: {terminadas}</span>
                </div>
              </div>
            </div>
          </div>

          {/* === TABLA === */}
          <motion.table
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="table table-hover align-middle shadow-sm rounded"
          >
            <thead className="table-secondary">
              <tr>
                <th>Especialidad</th>
                <th>Situación</th>
                <th>Fecha fin</th>
                <th>Prestador</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paciente.situaciones.map((s) => (
                <tr key={s.id}>
                  <td>{s.especialidad || "—"}</td>
                  <td>{s.titulo}</td>
                  <td>{s.fecha || "—"}</td>
                  <td>{s.prestador || "—"}</td>
                  <td>
                    <span
                      className={`badge ${
                        s.estado === "Terminada"
                          ? "estado-terminada"
                          : "estado-proceso"
                      }`}
                    >
                      {s.estado}
                    </span>
                  </td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-outline-primary me-2">
                      <Pencil size={16} />
                    </button>
                    <button className="btn btn-sm btn-outline-secondary">
                      <Folder size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      </div>
    </PrestadoresLayout>
  );
}
