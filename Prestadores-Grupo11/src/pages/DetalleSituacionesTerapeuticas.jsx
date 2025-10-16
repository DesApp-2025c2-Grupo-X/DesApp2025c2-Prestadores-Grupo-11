import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import SideBar from "../components/SideBar";
import { ArrowLeft, Folder, Pencil, Plus } from "lucide-react";
import { motion } from "framer-motion";
import "../styles/DetalleSituacionesTerapeuticas.css";

export default function DetalleSituacionesTerapeuticas() {
  const { dni } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);

  useEffect(() => {
    fetch("/familia.json")
      .then((res) => res.json())
      .then((data) => {
        const encontrado = data
          .flatMap((familia) => familia.integrantes)
          .find((i) => i.dni === dni);
        setPaciente(encontrado || null);
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, [dni]);

  if (!paciente) {
    return (
      <Layout header={<HeaderPrestadores />}>
        <div className="prestadores-layout d-flex">
          <SideBar />
          <div className="container mt-5 text-center">
            <h4>Cargando datos del paciente...</h4>
          </div>
        </div>
      </Layout>
    );
  }

  const totalSituaciones = paciente.situaciones.length;
  const terminadas = paciente.situaciones.filter(
    (s) => s.estado.toLowerCase() === "terminada"
  ).length;

  return (
    <Layout header={<HeaderPrestadores />}>
      <div className="prestadores-layout d-flex">
        <SideBar />
        <div className="container-fluid p-4">
          <button
            className="btn btn-link text-decoration-none mb-3"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} /> Volver
          </button>

          <div className="d-flex align-items-center justify-content-between mb-4">
            <h3 className="fw-bold">Gestión de Situaciones Terapéuticas</h3>
            <button
              className="btn btn-success d-flex align-items-center gap-2 rounded-pill shadow-sm"
              onClick={() => navigate(`/alta-situacion/${dni}`)}
            >
              <Plus size={18} /> Nueva situación
            </button>
          </div>

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
                          ? "bg-success"
                          : "bg-warning text-dark"
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
    </Layout>
  );
}
