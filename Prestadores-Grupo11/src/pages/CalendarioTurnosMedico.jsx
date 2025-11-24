import React, { useState, useEffect } from "react";
import PrestadoresLayout from "../components/PrestadoresLayout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "../styles/CalendarioTurnos.css";
import {
  getTurnosByPrestadorId,
  updateNotasTurno,
} from "../services/TurnosApi";
import { Tooltip as ReactTooltip } from "react-tooltip";
import TablaHistorial from "../components/TablaHistorial";
import "react-tooltip/dist/react-tooltip.css";
import { getHistoriaClinicaByAfiliado, addNotaAHistoriaClinica, getHistorialClinicoById } from "../services/HistorialClinicaApi";

export default function CalendarioTurnosMedico() {
  const user = JSON.parse(localStorage.getItem("miapp_user"));
  const prestadorId = user?.id;
  const role = user?.role;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [turnos, setTurnos] = useState([]);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historias, setHistorias] = useState({});
  const [nota, setNota] = useState("");

  //Estos dos estados son utilizados para abrir la ventana emergente para el historial.
  const [showHistoriaModal, setShowHistoriaModal] = useState(false);
  const [historiaSeleccionada, setHistoriaSeleccionada] = useState(null); //Borrar?

  //Informacion necesaria para poder cargar el historial de un paciente
  const [pacienteId, setPacienteId] = useState(0)
  const [tipoPaciente, setTipoPaciente] = useState("")

  //Para mostrar el historial clinico
  const [consultas, setConsultas] = useState([])


  // === Cargar turnos ===
  useEffect(() => {
    const controller = new AbortController();

    const fetchTurnos = async () => {
      if (!prestadorId) {
        toast.error(" No se encontró el ID del prestador en localStorage");
        setLoading(false);
        return;
      }

      if (role !== "medico") {
        toast.error(" Acceso no autorizado. Solo médicos pueden acceder a este calendario.");
        setLoading(false);
        return;
      }

      try {
        const response = await getTurnosByPrestadorId(prestadorId);
        const turnosValidos = Array.isArray(response) ? response : [];
        setTurnos(turnosValidos);
        localStorage.setItem("turnos_medico", JSON.stringify(turnosValidos));
        console.log("Turnos recibidos del backend:", turnosValidos);
      } catch (error) {
        console.error("Error al obtener turnos:", error);
        toast.warn(" No se pudo conectar con el servidor. Cargando datos locales...");
        const localTurnos = JSON.parse(localStorage.getItem("turnos_medico")) || [];
        setTurnos(localTurnos);
      } finally {
        setLoading(false);
      }
    };

    fetchTurnos();
    return () => controller.abort();
  }, [prestadorId, role]);

  // === Obtener historia clínica de un paciente ===
  const handleVerHistoriaClinica = async (turno) => {

    const tipoPaciente = (turno.afiliadoId === null) ? "Integrante" : "Afiliado"
    const pacienteId = (tipoPaciente === "Integrante") ? turno.integranteId : turno.afiliadoId

    if (!pacienteId) {
      toast.warn(" Este turno no tiene paciente asociado.");
      return;
    }

    setPacienteId(pacienteId)
    setTipoPaciente(tipoPaciente)

    setShowHistoriaModal(true); //  abrimos el modal
    
  };

  // === Actualizar texto de notas ===
  const handleNoteChange = (id, value) => {
    setTurnos((prev) => prev.map((t) => (t.id === id ? { ...t, notas: value } : t)));
  };

  // === Guardar nota y agregar al historial clínico ===
  const handleGuardarNota = async (id) => {
    const turno = turnos.find((t) => t.id === id);
    if (!turno) return;

    try {
      await updateNotasTurno(prestadorId, id, nota);
      const turnosActualizados = turnos.map((t) =>
        t.id === id ? { ...t, notas: turno.notas } : t
      );
      setTurnos(turnosActualizados);
      localStorage.setItem("turnos_medico", JSON.stringify(turnosActualizados));

      // Guardar nota en la historia clínica
      // if (turno.afiliado?.id) {
      //   await addNotaAHistoriaClinica(turno.afiliado.id, turno.notas);
      // }

      toast.success(
        `Nota guardada para ${turno.integrante
          ? turno.integrante.nombre
          : `${turno.afiliado.nombre} ${turno.afiliado.apellido}`
        }`
      );
      setSelectedTurno(null);
    } catch (error) {
      console.error("Error al guardar nota:", error);
      toast.error(" No se pudo guardar la nota en la base de datos");
    }
  };

  // === Filtrar los turnos del día seleccionado ===
  const turnosDelDia = turnos.filter((t) => {
    if (!selectedDate) return false; // Evita error cuando DayPicker borra la fecha
    const fechaTurno = new Date(t.date); // soporta ambas claves
    if (isNaN(fechaTurno)) return false; // fecha inválida
    return (
      fechaTurno.getDate() === selectedDate.getDate() &&
      fechaTurno.getMonth() === selectedDate.getMonth() &&
      fechaTurno.getFullYear() === selectedDate.getFullYear()
    );
  });

  // === Error de login ===
  if (!prestadorId) {
    return <p style={{ padding: "2rem" }}>No se encontró el médico logueado.</p>;
  }

  return (
    <PrestadoresLayout header={<HeaderPrestadores />}>
      <div className="calendario-turnos-container">
        <ToastContainer />
        <h2 className="titulo">Calendario de turnos</h2>

        <div className="contenido-calendario">
          {/* === Calendario === */}
          <div className="calendario-box">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              footer={
                selectedDate && (
                  <p className="seleccion-fecha">
                    Fecha seleccionada: {format(selectedDate, "dd/MM/yyyy")}
                  </p>
                )
              }
            />
          </div>

          {/* === Agenda === */}
          <div className="agenda-box card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">
                {format(selectedDate, "EEEE dd 'de' MMMM yyyy")}
              </h5>
            </div>

            <div className="agenda-scroll">
              {loading ? (
                <p>Cargando turnos...</p>
              ) : turnosDelDia.length > 0 ? (
                turnosDelDia.map((turno) => {

                  const fechaTurno = new Date(turno.date);
                  const hoy = new Date();

                  // Normalizamos el horario para solamente tildar como turno pasado las de ayer para atras
                  fechaTurno.setHours(0, 0, 0, 0);
                  hoy.setHours(0, 0, 0, 0);

                  const turnoPasado = fechaTurno < hoy;

                  return (
                    <div
                      key={turno.id}
                      className={`turno-card ${turnoPasado ? "turno-pasado" : ""}`} // opcional: clase para estilos
                    >
                      <div
                        className="turno-header"
                        onClick={() =>
                          setSelectedTurno(selectedTurno === turno.id ? null : turno.id)
                        }
                      >
                        <span className="hora">{format(new Date(turno.date), "HH:mm")}</span>
                        <span className="paciente">
                          {turno.afiliado
                            ? `${turno.afiliado.nombre} ${turno.afiliado.apellido}`
                            : turno.integrante
                              ? turno.integrante.nombre
                              : "Paciente no especificado"}
                        </span>
                        <button className="btn-ver">📝 Ver</button>
                      </div>

                      {selectedTurno === turno.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                          className="notas-box"
                        >
                          <textarea
                            rows={3}
                            maxLength={500}
                            value={nota}
                            onChange={(e) => setNota(e.target.value)}
                            placeholder={turnoPasado ? "No se puede agregar notas a un turno pasado." : "Agregar notas (máx. 500 caracteres)"}
                            disabled={turnoPasado}
                            style={
                              turnoPasado
                                ? { backgroundColor: "#f0f0f0", color: "#777" }
                                : {}
                            }
                          />

                          <div
                            className="botones-turno"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginTop: "10px",
                              alignItems: "center",
                            }}
                          >
                            <button
                              className="btn-historia"
                              data-tooltip-id={`historia-${turno.id}`}
                              data-tooltip-content={
                                historias[turno.afiliado?.id] ||
                                "Cargar historia clínica"
                              }
                              onClick={() => handleVerHistoriaClinica(turno)}
                            >
                              Historia clínica
                            </button>

                            <button
                              className="btn-guardar"
                              onClick={() => handleGuardarNota(turno.id)}
                              disabled={turnoPasado}
                              style={
                                turnoPasado
                                  ? { opacity: 0.6, cursor: "not-allowed" }
                                  : {}
                              }
                            >
                              Guardar nota
                            </button>

                            <ReactTooltip
                              id={`historia-${turno.id}`}
                              place="top"
                              style={{
                                backgroundColor: "var(--rosa)",
                                color: "var(--azul-petroleo)",
                                maxWidth: "300px",
                              }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="sin-turnos">No hay turnos para esta fecha.</p>
              )}
            </div>

          </div>

          {/* === Modal Historia Clínica === */}
          {showHistoriaModal && (
            <div
              className="modal fade show"
              style={{
                display: "block",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1055,
              }}
              tabIndex="-1"
              role="dialog"
            >
              <div className="modal-dialog modal-xl modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      Historia clínica
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowHistoriaModal(false)}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <TablaHistorial
                      pacienteId={pacienteId}
                      tipo={tipoPaciente}
                    />
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowHistoriaModal(false)}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        <footer className="footer-vista">
          <small>Vista actual: Médico</small>
        </footer>
      </div>
    </PrestadoresLayout>
  );
}

