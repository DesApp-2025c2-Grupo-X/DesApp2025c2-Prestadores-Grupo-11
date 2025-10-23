import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PrestadoresLayout from "../components/PrestadoresLayout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import SideBar from "../components/SideBar";
import { ArrowLeft, Pencil, Plus, Folder } from "lucide-react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from "react-tooltip";
import "../styles/SituacionesTerapeuticas.css";

export default function SituacionesTerapeuticas() {
  const { dni } = useParams();
  const navigate = useNavigate();
  const [situaciones, setSituaciones] = useState([]);
  const [paciente, setPaciente] = useState(null);

  // Cargar datos desde el JSON
  useEffect(() => {
    fetch("/situacionesterapeuticas.json")
      .then((res) => res.json())
      .then((data) => {
        const pacienteEncontrado = data.find((p) => p.dni === dni);

        if (pacienteEncontrado) {
          setPaciente({
            nombre: pacienteEncontrado.nombre,
            dni: pacienteEncontrado.dni,
            edad: pacienteEncontrado.edad,
          });

          const ordenadas = pacienteEncontrado.situaciones_terapeuticas
            .map((s, index) => ({ ...s, id: index }))
            .sort(
              (a, b) =>
                new Date(b.fecha_inicio.split("/").reverse().join("-")) -
                new Date(a.fecha_inicio.split("/").reverse().join("-"))
            );

          setSituaciones(ordenadas);
        } else {
          setPaciente(null);
          setSituaciones([]);
        }
      })
      .catch((err) => console.error("Error cargando datos:", err));
  }, [dni]);

  if (!paciente) {
    return (
      <PrestadoresLayout header={<HeaderPrestadores />}>
        <div className="d-flex">
          <SideBar />
          <div className="container mt-5 text-center">
            <h4>No se encontraron situaciones para este paciente.</h4>
            <motion.button
              className="btn-volver mt-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} className="me-2" /> Volver
            </motion.button>
          </div>
        </div>
      </PrestadoresLayout>
    );
  }

  // Editar estado inline con select
  const handleEditarEstado = (id, nuevoEstado) => {
    const actualizadas = situaciones.map((s) =>
      s.id === id ? { ...s, estado: nuevoEstado } : s
    );
    setSituaciones(actualizadas);
    toast.success(`Estado actualizado a "${nuevoEstado}" ✅`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  // Archivar situación
  const handleArchivar = (id) => {
    const actualizadas = situaciones.filter((s) => s.id !== id);
    setSituaciones(actualizadas);
    toast.success("Situación archivada con éxito 🗂️", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  return (
    <PrestadoresLayout header={<HeaderPrestadores />}>
      <div className="d-flex">
        <SideBar />
        <div className="flex-grow-1 p-4">
          <ToastContainer />

          <motion.button
            className="btn-volver mb-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} className="me-2" /> Volver
          </motion.button>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Situaciones Terapéuticas</h3>

            <motion.button
              className="btn-nueva-situacion"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/prestadores/situaciones/alta/${dni}`)}
            >
              <Plus size={18} className="me-2" />
              Nueva Situación
            </motion.button>
          </div>

          <div className="paciente-card p-3 rounded shadow-sm bg-light mb-4">
            <div className="d-flex align-items-center">
              <i className="bi bi-person-circle fs-1 me-3"></i>
              <div>
                <h5 className="fw-semibold mb-0">{paciente.nombre}</h5>
                <small className="text-muted">
                  DNI: {paciente.dni} — Edad: {paciente.edad}
                </small>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <motion.table
            className="table table-hover align-middle shadow-sm rounded text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <thead className="table-secondary">
              <tr>
                <th>Fecha inicio</th>
                <th>Especialidad</th>
                <th>Descripción</th>
                <th>Prestador</th>
                <th>Estado</th>
                <th>Fecha fin</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {situaciones.length > 0 ? (
                situaciones.map((s) => (
                  <tr key={s.id}>
                    <td>{s.fecha_inicio || "—"}</td>
                    <td>{s.especialidad || "—"}</td>
                    <td>
                      <button
                        className="btn-ver-mas"
                        data-tooltip-id={`desc-${s.id}`}
                        data-tooltip-content={
                          s.descripcion || "Sin descripción"
                        }
                      >
                        Ver más
                      </button>
                      <Tooltip
                        id={`desc-${s.id}`}
                        place="top"
                        style={{
                          backgroundColor: "var(--rosa)",
                          color: "var(--azul-petroleo)",
                          maxWidth: "300px",
                        }}
                      />
                    </td>
                    <td>{s.medico || "—"}</td>
                    <td>
                      <select
                        value={s.estado || "Pendiente"}
                        onChange={(e) =>
                          handleEditarEstado(s.id, e.target.value)
                        }
                        className={`form-select form-select-sm ${
                          s.estado === "Finalizado"
                            ? "estado-finalizado"
                            : "estado-proceso"
                        }`}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="EnProceso">En proceso</option>
                        <option value="Finalizado">Finalizado</option>
                      </select>
                    </td>
                    <td>{s.fecha_final || "—"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleArchivar(s.id)}
                      >
                        <Folder size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      color: "var(--azul-petroleo)",
                    }}
                  >
                    No hay situaciones registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </motion.table>
        </div>
      </div>
    </PrestadoresLayout>
  );
}
