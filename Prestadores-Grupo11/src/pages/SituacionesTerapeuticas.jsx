import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import PrestadoresLayout from "../components/PrestadoresLayout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import SideBar from "../components/SideBar";
import { ArrowLeft, Folder } from "lucide-react";
import { FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import "../styles/SituacionesTerapeuticas.css";
import {
  getSituacionesByAfiliadoId,
  getSituacionesByIntegranteId,
  getSituacionesDePrestadorByIntegranteId,
  archivarSituacion,
  actualizarSituacion,
} from "../services/SituacionesApi";

export default function SituacionesTerapeuticas() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState(null);
  const [situaciones, setSituaciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tipoPaciente = queryParams.get("tipoPaciente");
  const esIntegrante = tipoPaciente === "integrante";

  useEffect(() => {
    if (!id) return;
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

        if (esIntegrante) {
          responseData = await getSituacionesDePrestadorByIntegranteId(
            prestadorId,
            id
          );
        } else {
          responseData = await getSituacionesByAfiliadoId(
            prestadorId,
            id,
            controller.signal
          );
        }

        const data = responseData?.data || responseData;
        console.log("Datos recibidos del backend:", data);

        let listaSituaciones = [];
        let pacienteInfo = {};

        if (Array.isArray(data)) {
          listaSituaciones = data.map((s) => ({
            id: s.id,
            fecha_inicio: s.fecha_inicio
              ? new Date(s.fecha_inicio).toLocaleDateString()
              : "—",
            especialidad: s.especialidad || "—",
            descripcion: s.observaciones || "—",
            estado: s.estado || "activa",
            prestador_nombre: s.prestador?.username || "—",
            pacienteNombre: `${
              s.afiliado?.nombre || s.integrante?.nombre || ""
            } ${s.afiliado?.apellido || s.integrante?.apellido || ""}`.trim(),
            pacienteDNI: s.afiliado?.dni || s.integrante?.dni || "—",
          }));

          const ref = data[0];
          pacienteInfo = {
            nombre: `${
              ref?.afiliado?.nombre || ref?.integrante?.nombre || ""
            } ${
              ref?.afiliado?.apellido || ref?.integrante?.apellido || ""
            }`.trim(),
            id: ref?.afiliadoId || ref?.integranteId || id,
            dni: ref?.afiliado?.dni || ref?.integrante?.dni || "—",
          };
        } else if (data?.situaciones && Array.isArray(data.situaciones)) {
          listaSituaciones = data.situaciones.map((s) => ({
            id: s.id,
            fecha_inicio: s.fecha_inicio
              ? new Date(s.fecha_inicio).toLocaleDateString()
              : "—",
            especialidad: s.especialidad || "—",
            descripcion: s.observaciones || "—",
            estado: s.estado || "activa",
            prestador_nombre: s.prestador?.username || "—",
            pacienteNombre: `${data.nombre || ""} ${data.apellido || ""}`.trim(),
            pacienteDNI: data.dni || "—",
          }));

          pacienteInfo = {
            nombre: `${data.nombre || ""} ${data.apellido || ""}`.trim(),
            id: data.id || id,
            dni: data.dni || "—",
          };
        } else {
          throw new Error("Respuesta inválida del backend");
        }

        setPaciente(pacienteInfo);
        setSituaciones(listaSituaciones);
      } catch (err) {
        if (err.name === "AbortError") return;
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

  // === Alta de nueva situación ===
  const handleNuevaSituacion = () => {
    if (!paciente?.id) {
      toast.error("No se pudo obtener el identificador del paciente.");
      return;
    }

    navigate(
      `/prestadores/situaciones/alta/${paciente.id}?tipoPaciente=${tipoPaciente}`
    );
  };

  // === Archivar ===
  const handleArchivar = async (idSituacion) => {
    try {
      const situacion = situaciones.find((s) => s.id === idSituacion);

      if (!situacion) return;

      if (situacion.estado !== "cerrada") {
        toast.warn("Solo se pueden archivar situaciones cerradas.", {
          position: "bottom-right",
        });
        return;
      }

      const confirm = await Swal.fire({
        title: "¿Archivar situación?",
        text: "Esto moverá la situación al historial.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, archivar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#6fb6b6",
        cancelButtonColor: "#fbc3c2",
      });

      if (!confirm.isConfirmed) return;

      await archivarSituacion(idSituacion);

      setSituaciones((prev) =>
        prev.map((s) =>
          s.id === idSituacion ? { ...s, estado: "archivada" } : s
        )
      );

      toast.success("Situación archivada correctamente.", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error al archivar:", error);
      toast.error("No se pudo archivar la situación.", {
        position: "bottom-right",
      });
    }
  };

  // === Cambiar estado (activa / cerrada) ===
  const handleEditarEstado = async (idSituacion, nuevoEstado) => {
    try {
      await actualizarSituacion(idSituacion, { estado: nuevoEstado });

      setSituaciones((prev) =>
        prev.map((s) =>
          s.id === idSituacion ? { ...s, estado: nuevoEstado } : s
        )
      );

      toast.success(`Estado actualizado a "${nuevoEstado}"`, {
        position: "bottom-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error actualizando estado:", error);
      toast.error("No se pudo actualizar el estado.", {
        position: "bottom-right",
      });
    }
  };

  // === Pantallas de carga / error ===
  if (cargando) {
    return (
      <PrestadoresLayout header={<HeaderPrestadores />}>
        <div className="d-flex">
          <SideBar />
          <div className="container mt-5 text-center">
            <div className="spinner-border text-primary" role="status" />
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

  // === Render principal ===
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
                  situaciones.map((s) => (
                    <tr key={s.id}>
                      <td>{s.pacienteNombre}</td>
                      <td>{s.pacienteDNI}</td>
                      <td>{s.fecha_inicio}</td>
                      <td>{s.especialidad}</td>
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
                      <td>{s.prestador_nombre}</td>

                      <td>
                        <select
                          value={s.estado}
                          onChange={(e) =>
                            handleEditarEstado(s.id, e.target.value)
                          }
                          className="form-select form-select-sm"
                        >
                          <option value="activa">Activa</option>
                          <option value="cerrada">Cerrada</option>
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
