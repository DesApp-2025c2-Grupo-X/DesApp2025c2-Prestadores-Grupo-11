import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PrestadoresLayout from "../components/PrestadoresLayout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import SideBar from "../components/SideBar";
import { ArrowLeft, Folder } from "lucide-react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";
import "react-toastify/dist/ReactToastify.css";
import "../styles/SituacionesTerapeuticas.css";
import { getSituacionesByAfiliado } from "../services/SituacionesApi";

export default function SituacionesTerapeuticas() {
  const { id: afiliadoId } = useParams();
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState(null);
  const [situaciones, setSituaciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!afiliadoId) {
      console.warn("No se recibió afiliadoId en useParams");
      return;
    }

    const controller = new AbortController();

    const fetchSituaciones = async () => {
      try {
        setCargando(true);
        setError(false);

        // Usuario logueado
        const user = JSON.parse(localStorage.getItem("miapp_user"));
        if (!user?.id) {
          toast.error("Usuario no logueado. Por favor, inicie sesión.", {
            toastId: "noAuth",
          });
          setError(true);
          return;
        }

        const prestadorId = user.id;
        console.log("Solicitando situaciones:", { prestadorId, afiliadoId });

        // Llamada al backend (usa tu Axios central)
        const data = await getSituacionesByAfiliado(
          prestadorId,
          afiliadoId,
          controller.signal
        );

        console.log("📦 Respuesta del backend:", data);
        if (!data) throw new Error("Respuesta vacía del backend");

        let afiliado = null;
        let listaSituaciones = [];

        // ─── Caso 1: array plano ────────────────────────────────
        if (Array.isArray(data)) {
          if (data.length === 0) throw new Error("Sin resultados");
          afiliado = data[0]?.afiliado ?? {};
          listaSituaciones = data.map((s) => ({
            id: s.id,
            fecha_inicio: s.fecha_inicio,
            especialidad: s.especialidad,
            descripcion: s.descripcion,
            estado: s.estado,
            prestador_nombre: s.prestador_nombre,
            pacienteNombre: s.afiliado?.integrantes?.[0]?.nombre || "—",
            pacienteDNI: s.afiliado?.integrantes?.[0]?.dni || "—",
          }));
        }

        // ─── Caso 2: objeto afiliado con situaciones anidadas ───
        else if (typeof data === "object") {
          afiliado = data;
          listaSituaciones =
            data.integrantes?.flatMap((i) =>
              i.situaciones?.map((s) => ({
                id: s.id,
                fecha_inicio: s.fecha_inicio,
                especialidad: s.especialidad,
                descripcion: s.descripcion,
                estado: s.estado,
                prestador_nombre: s.prestador?.nombre || "—",
                pacienteNombre: i.nombre,
                pacienteDNI: i.dni,
              })) || []
            ) || [];
        }

        if (!afiliado) throw new Error("Afiliado no encontrado");

        setPaciente({
          nombre: afiliado.apellido || "—",
          afiliadoId: afiliado.id || afiliadoId,
        });
        setSituaciones(listaSituaciones);
      } catch (err) {
        if (err.name === "CanceledError") return;
        console.error("Error cargando situaciones:", err);
        toast.error("No se pudieron cargar los datos del paciente.", {
          position: "bottom-right",
          autoClose: 2500,
        });
        setError(true);
      } finally {
        if (!controller.signal.aborted) setCargando(false);
      }
    };

    fetchSituaciones();
    return () => controller.abort();
  }, [afiliadoId]);

  // === Acciones ===
  const handleEditarEstado = (id, nuevoEstado) => {
    setSituaciones((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, estado: nuevoEstado } : s
      )
    );
    toast.success(`Estado actualizado a "${nuevoEstado}"`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const handleArchivar = (id) => {
    setSituaciones((prev) => prev.filter((s) => s.id !== id));
    toast.success("Situación archivada con éxito", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  // === Render ===
  if (cargando) {
    return (
      <PrestadoresLayout header={<HeaderPrestadores />}>
        <div className="d-flex">
          <SideBar />
          <div className="container mt-5 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3">Cargando datos del paciente...</p>
          </div>
        </div>
      </PrestadoresLayout>
    );
  }

  if (error || !paciente) {
    return (
      <PrestadoresLayout header={<HeaderPrestadores />}>
        <div className="d-flex">
          <SideBar />
          <div className="container mt-5 text-center">
            <h4>No se pudieron cargar los datos del paciente.</h4>
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

  // === Vista principal ===
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

          <h3>Situaciones Terapéuticas del Afiliado</h3>

          <div className="table-responsive-xl mt-4">
            <motion.table
              className="table table-hover align-middle shadow-sm rounded text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <thead className="table-secondary">
                <tr>
                  <th>Paciente</th>
                  <th>DNI</th>
                  <th>Fecha inicio</th>
                  <th>Especialidad</th>
                  <th>Descripción</th>
                  <th>Prestador</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {situaciones.length > 0 ? (
                  situaciones.map((s) => (
                    <tr key={s.id}>
                      <td>{s.pacienteNombre}</td>
                      <td>{s.pacienteDNI}</td>
                      <td>{s.fecha_inicio || "—"}</td>
                      <td>{s.especialidad || "—"}</td>
                      <td>
                        <button
                          className="btn-ver-mas"
                          data-tooltip-id={`desc-${s.id}`}
                          data-tooltip-content={s.descripcion || "Sin descripción"}
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
                      <td>{s.prestador_nombre || "—"}</td>
                      <td>
                        <select
                          value={s.estado || "Pendiente"}
                          onChange={(e) => handleEditarEstado(s.id, e.target.value)}
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
                    <td colSpan="8" style={{ color: "var(--azul-petroleo)" }}>
                      No hay situaciones registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </motion.table>
          </div>
        </div>
      </div>
    </PrestadoresLayout>
  );
}
