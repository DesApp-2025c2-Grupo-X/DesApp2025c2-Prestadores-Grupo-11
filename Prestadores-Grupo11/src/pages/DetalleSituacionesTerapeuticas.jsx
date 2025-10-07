import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PrestadoresLayout from "../components/PrestadoresLayout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import SideBar from "../components/SideBar";
import { ArrowLeft, ClipboardList, Users } from "lucide-react";
import { motion } from "framer-motion";
import "../styles/SituacionesTerapeuticas.css";

export default function DetalleSituacionesTerapeuticas() {
  const { dni } = useParams();
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos del paciente
  useEffect(() => {
    const cargarPaciente = async () => {
      try {
        const res = await fetch("/familias.json");
        if (!res.ok) throw new Error("Error al cargar familias.json");
        const familias = await res.json();

        const encontrado = familias
          .flatMap((f) => f.integrantes)
          .find((p) => String(p.dni) === String(dni));

        if (!encontrado) throw new Error(`No se encontró un paciente con DNI ${dni}`);

        setPaciente(encontrado);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarPaciente();
  }, [dni]);

  // Estado: cargando
  if (loading) {
    return (
      <PrestadoresLayout header={HeaderPrestadores}>
        <div className="d-flex">
          <SideBar />
          <div className="flex-grow-1 p-4 text-center">
            <p>Cargando información del paciente...</p>
          </div>
        </div>
      </PrestadoresLayout>
    );
  }

  // Estado: error
  if (error) {
    return (
      <PrestadoresLayout header={HeaderPrestadores}>
        <div className="d-flex">
          <SideBar />
          <div className="flex-grow-1 p-4 text-center">
            <p className="text-danger">{error}</p>
            <button className="btn-volver mt-3" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} className="me-2" /> Volver
            </button>
          </div>
        </div>
      </PrestadoresLayout>
    );
  }

  // Estado: sin paciente (por seguridad adicional)
  if (!paciente) {
    return (
      <PrestadoresLayout header={HeaderPrestadores}>
        <div className="d-flex">
          <SideBar />
          <div className="flex-grow-1 p-4 text-center">
            <p>No se encontraron datos del paciente con DNI {dni}</p>
            <button className="btn-volver mt-3" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} className="me-2" /> Volver
            </button>
          </div>
        </div>
      </PrestadoresLayout>
    );
  }

  // --- Vista principal ---
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

          {/* Card paciente */}
          <motion.div
            className="paciente-card p-3 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 10px rgba(251,195,194,0.6)",
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <Users size={40} color="var(--azul-petroleo)" />
              <div>
                <h4>{paciente.nombre}</h4>
                <p>
                  Edad: <strong>{paciente.edad}</strong> | DNI:{" "}
                  <strong>{paciente.dni}</strong>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tabla situaciones */}
          <h5>Situaciones Terapéuticas</h5>
          {paciente.situaciones.length === 0 ? (
            <p className="text-muted mt-3">No hay situaciones registradas.</p>
          ) : (
            <div className="table-responsive">
              <table className="table tabla-situaciones">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Situación</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {paciente.situaciones.map((s, i) => (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{
                        scale: 1.02,
                        backgroundColor:
                          s.estado === "Terminada"
                            ? "var(--verde-menta)"
                            : "var(--rosa)",
                      }}
                    >
                      <td>{s.id}</td>
                      <td>
                        <ClipboardList size={18} className="me-2" /> {s.titulo}
                      </td>
                      <td
                        className={
                          s.estado === "Terminada"
                            ? "estado-terminada"
                            : "estado-proceso"
                        }
                      >
                        {s.estado}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PrestadoresLayout>
  );
}
