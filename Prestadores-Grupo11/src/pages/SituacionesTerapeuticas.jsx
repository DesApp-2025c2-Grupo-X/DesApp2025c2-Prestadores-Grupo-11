import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import PrestadoresLayout from "../components/PrestadoresLayout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import SideBar from "../components/SideBar";
import { ArrowLeft, Folder } from "lucide-react";
import { FiPlus } from "react-icons/fi"; // ✅ Agregado
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";
import Swal from "sweetalert2"; // ✅ Faltaba importar
import "react-toastify/dist/ReactToastify.css";
import "../styles/SituacionesTerapeuticas.css";
import {
  getSituacionesByAfiliado,
  getSituacionesByIntegranteId,
  actualizarSituacion,
} from "../services/SituacionesApi";

export default function SituacionesTerapeuticas() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState(null);
  const [situaciones, setSituaciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(null); // ✅ Para el handleVerMas

  // Detectar si la URL es de afiliado o integrante
  const esIntegrante = location.pathname.toLowerCase().includes("/integrante/");
  const tipo = esIntegrante ? "integrante" : "afiliado";

  useEffect(() => {
    if (!id) {
      console.warn("No se recibió ID en useParams");
      return;
    }

    const controller = new AbortController();

    const fetchSituaciones = async () => {
      try {
        setCargando(true);
        setError(false);

        const user = JSON.parse(localStorage.getItem("miapp_user"));
        if (!user?.id) {
          toast.error("Usuario no logueado. Por favor, inicie sesión.", {
            toastId: "noAuth",
          });
          setError(true);
          return;
        }

        const prestadorId = user.id;
        let responseData;

        // === Petición al backend según tipo ===
        if (esIntegrante) {
          responseData = await getSituacionesByIntegranteId(id);
        } else {
          responseData = await getSituacionesByAfiliado(
            prestadorId,
            id,
            controller.signal
          );
        }

        const data = responseData?.data || responseData;
        if (!data) throw new Error("Respuesta vacía del backend");

        let listaSituaciones = [];
        let pacienteInfo = {};

        // === Caso integrante ===
        if (esIntegrante && Array.isArray(data)) {
          listaSituaciones = data.map((s) => ({
            id: s.id,
            fecha_inicio: s.fecha_inicio || "—",
            especialidad: s.especialidad || "—",
            descripcion: s.descripcion || "—",
            estado: s.estado || "Pendiente",
            prestador_nombre: s.prestador?.username || "—",
            pacienteNombre: s.pacienteNombre || "—",
            pacienteDNI: s.pacienteDNI || "—",
          }));
          pacienteInfo = { nombre: "—", afiliadoId: id };
        } else if (esIntegrante && typeof data === "object") {
          listaSituaciones =
            (data.situaciones || []).map((s) => ({
              id: s.id,
              fecha_inicio: s.fecha_inicio || "—",
              especialidad: s.especialidad || "—",
              descripcion: s.descripcion || "—",
              estado: s.estado || "Pendiente",
              prestador_nombre: s.prestador?.username || "—",
              pacienteNombre:
                `${data.nombre || ""} ${data.apellido || ""}`.trim() || "—",
              pacienteDNI: data.dni || "—",
            })) || [];

          pacienteInfo = {
            nombre: `${data.nombre || ""} ${data.apellido || ""}`.trim() || "—",
            afiliadoId: data.id || id,
          };
        } else if (!esIntegrante) {
          const integrantes = Array.isArray(data)
            ? data
            : Array.isArray(data.integrantes)
            ? data.integrantes
            : [];

          listaSituaciones = integrantes.flatMap((i) =>
            (i.situaciones || []).map((s) => ({
              id: s.id,
              fecha_inicio: s.fecha_inicio || "—",
              especialidad: s.especialidad || "—",
              descripcion: s.descripcion || "—",
              estado: s.estado || "Pendiente",
              prestador_nombre: s.prestador?.username || "—",
              pacienteNombre:
                `${i.nombre || ""} ${i.apellido || ""}`.trim() || "—",
              pacienteDNI: i.dni || "—",
            }))
          );

          pacienteInfo = {
            nombre:
              `${data.nombre || ""} ${data.apellido || ""}`.trim() ||
              "Afiliado",
            afiliadoId: data.id || id,
          };
        }

        setPaciente(pacienteInfo);
        setSituaciones(listaSituaciones);
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") return;
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
  }, [id, esIntegrante]);

  // === Acciones ===
  const handleVerMas = (index) => {
    setTooltipVisible(tooltipVisible === index ? null : index);
  };

  const handleNuevaSituacion = () => {
    navigate("prestadores/situaciones/alta/:dni");
  };

  const handleEditarEstado = (situacion) => {
    Swal.fire({
      title: "Editar estado",
      text: `Seleccione el nuevo estado para ${situacion.pacienteNombre}`,
      input: "select",
      inputOptions: {
        "En proceso": "En proceso",
        Finalizado: "Finalizado",
      },
      inputPlaceholder: "Seleccione un estado",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#6fb6b6",
      cancelButtonColor: "#fbc3c2",
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const nuevas = situaciones.map((s) =>
          s.id === situacion.id ? { ...s, estado: result.value } : s
        );
        setSituaciones(nuevas);

        Swal.fire({
          icon: "success",
          title: "Estado actualizado",
          text: `Nuevo estado: ${result.value}`,
          confirmButtonColor: "#6fb6b6",
        });
      }
    });
  };

  const handleArchivar = async (id) => {
    try {
      const confirm = await Swal.fire({
        title: "¿Archivar situación?",
        text: "Esto moverá la situación al historial clínico del paciente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, archivar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#6fb6b6",
        cancelButtonColor: "#fbc3c2",
      });

      if (!confirm.isConfirmed) return;

      await actualizarSituacion(id, { estado: "Archivado" });

      setSituaciones((prev) =>
        prev.map((s) => (s.id === id ? { ...s, estado: "Archivado" } : s))
      );

      toast.success("Situación archivada correctamente.", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error al archivar la situación:", error);
      toast.error("No se pudo archivar la situación.", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
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

  if (error && !paciente) {
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

          <h3>
            {esIntegrante
              ? "Situaciones Terapéuticas del Integrante"
              : "Situaciones Terapéuticas del Afiliado"}
          </h3>

          {/* Botón Nueva Situación */}
          <div style={{ textAlign: "right", width: "80%", margin: "0 auto" }}>
            <button className="btn-nueva-situacion" onClick={handleNuevaSituacion}>
              <FiPlus style={{ marginRight: "6px" }} /> Nueva Situación
            </button>
          </div>

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
                  situaciones.map((s, index) => (
                    <tr key={s.id}>
                      <td>{s.pacienteNombre}</td>
                      <td>{s.pacienteDNI}</td>
                      <td>{s.fecha_inicio}</td>
                      <td>{s.especialidad}</td>
                      <td>
                        <button
                          className="btn-ver-mas"
                          onClick={() => handleVerMas(index)}
                        >
                          Ver más
                        </button>
                        {tooltipVisible === index && (
                          <div className="tooltip-descripcion">
                            {s.descripcion || "Sin descripción"}
                          </div>
                        )}
                      </td>
                      <td>{s.prestador_nombre}</td>
                      <td>
                        <select
                          value={s.estado}
                          onChange={(e) =>
                            handleEditarEstado(s, e.target.value)
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
