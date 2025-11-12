import React, { useState, useEffect, useMemo } from "react";
import PrestadoresLayout from "../components/PrestadoresLayout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "../styles/CalendarioTurnos.css";
import DetalleHistorialModal from "../components/DetalleHistorialModal";
import {
  getTurnosByPrestadorId,
  updateNotasTurno,
} from "../services/TurnosApi";
import {
  addNotaAHistoriaClinica,
  getHistoriaClinicaByAfiliado,
} from "../services/HistorialClinicaApi";

export default function CalendarioTurnosCentro() {
  const user = JSON.parse(localStorage.getItem("miapp_user"));
  const prestadorId = user?.id;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [turnos, setTurnos] = useState([]);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalDetalle, setModalDetalle] = useState(null);

  // === NUEVOS ESTADOS PARA FILTROS ===
  const [especialidad, setEspecialidad] = useState("");
  const [medico, setMedico] = useState("");

  // Ejemplo estático (luego reemplazar por datos reales del backend)
  const especialidadesEjemplo = ["Cardiología", "Pediatría", "Dermatología"];
  const medicosEjemplo = {
    Cardiología: ["Dr. Gómez", "Dra. Ramírez"],
    Pediatría: ["Dra. Torres", "Dr. Fernández"],
    Dermatología: ["Dr. López"],
  };

  /**  Cargar turnos */
  useEffect(() => {
    if (!prestadorId) return;

    const fetchTurnos = async () => {
      try {
        const data = await getTurnosByPrestadorId(prestadorId);
        setTurnos(data);
        console.log("Turnos recibidos del backend:", data);
      } catch (error) {
        console.error("Error al obtener turnos:", error);
        toast.error("No se pudieron cargar los turnos.");
      } finally {
        setLoading(false);
      }
    };

    fetchTurnos();
  }, [prestadorId]);

  /**  Actualiza la nota escrita en el textarea */
  const handleNoteChange = (id, value) => {
    setTurnos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, notes: value } : t))
    );
  };

  /**  Guarda la nota del turno y la agrega al historial */
  const handleGuardarNota = async (id) => {
    const turno = turnos.find((t) => t.id === id);
    if (!turno) return;

    try {
      await updateNotasTurno(prestadorId, id, turno.notes);

      setTurnos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, notes: turno.notes } : t))
      );

      if (turno.afiliadoId || turno.integranteId) {
        const pacienteId = turno.afiliadoId || turno.integranteId;
        const prestadorNombre = user.username || "Prestador";
        const notaHistorial = {
          texto: turno.notes || "",
          prestador: prestadorNombre,
          fecha: turno.start,
        };

        await addNotaAHistoriaClinica(pacienteId, notaHistorial);
      }

      toast.success(
        `Nota guardada para ${
          turno.afiliado?.nombre
            ? `${turno.afiliado.nombre} ${turno.afiliado.apellido}`
            : turno.integrante?.nombre || "Paciente"
        }`
      );
    } catch (error) {
      console.error(" Error al guardar nota:", error);
      toast.error("No se pudo guardar la nota.");
    }
  };

  /** Muestra historia clínica del paciente */
  const handleVerHistoriaClinica = async (turno) => {
    if (!turno.afiliadoId && !turno.integranteId) {
      toast.warn("Este paciente no tiene afiliado o integrante asociado.");
      return;
    }

    try {
      let detalle = null;
      if (turno.afiliadoId) {
        detalle = await getHistoriaClinicaByAfiliado(turno.afiliadoId);
      } else {
        toast.warn("Integrante aún no tiene historia clínica.");
        return;
      }

      setModalDetalle(detalle || { notas: "Sin historial clínico." });
    } catch (error) {
      console.error(" Error al obtener historia clínica:", error);
      toast.error("No se pudo cargar la historia clínica del paciente.");
    }
  };

  /** Filtra los turnos por fecha */
const turnosDelDia = useMemo(() => {
  return turnos.filter((t) => {
    if (!selectedDate) return false; // Evita error cuando DayPicker borra la fecha
    const fechaTurno = new Date(t.start || t.date); // soporta ambas claves
    if (isNaN(fechaTurno)) return false; // fecha inválida
    return (
      fechaTurno.getDate() === selectedDate.getDate() &&
      fechaTurno.getMonth() === selectedDate.getMonth() &&
      fechaTurno.getFullYear() === selectedDate.getFullYear()
    );
  });
}, [turnos, selectedDate]);

  /** === NUEVO: FILTROS CENTRO === */
  const medicosDisponibles = useMemo(
    () => (especialidad ? medicosEjemplo[especialidad] || [] : []),
    [especialidad]
  );

  const turnosFiltrados = useMemo(() => {
    return turnosDelDia.filter(
      (t) =>
        (!especialidad || t.especialidad === especialidad) &&
        (!medico || t.medico === medico)
    );
  }, [turnosDelDia, especialidad, medico]);

  const handleLimpiarFiltros = () => {
    setEspecialidad("");
    setMedico("");
  };

  if (!prestadorId)
    return (
      <p style={{ padding: "2rem" }}>No se encontró el médico logueado.</p>
    );

  return (
    <PrestadoresLayout header={<HeaderPrestadores />}>
      <div className="calendario-turnos-container">
        <ToastContainer />
        <h2 className="titulo">Gestión de Turnos - Centro Médico</h2>

        {/* === FILTROS === */}
        <div className="filtros-box card shadow-sm p-3 mb-3">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <label className="form-label fw-bold text-muted">
                Especialidad
              </label>
              <select
                className="form-select"
                value={especialidad}
                onChange={(e) => {
                  setEspecialidad(e.target.value);
                  setMedico("");
                }}
              >
                <option value="">Todas</option>
                {especialidadesEjemplo.map((esp) => (
                  <option key={esp} value={esp}>
                    {esp}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold text-muted">Médico</label>
              <select
                className="form-select"
                value={medico}
                onChange={(e) => setMedico(e.target.value)}
                disabled={!especialidad}
              >
                <option value="">Todos</option>
                {medicosDisponibles.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={handleLimpiarFiltros}
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* === CALENDARIO === */}
        <div className="contenido-calendario">
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

          {/* === LISTA DE TURNOS === */}
          <div className="agenda-box card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">
                {format(selectedDate, "EEEE dd 'de' MMMM yyyy")}
              </h5>
            </div>

            <div className="agenda-scroll">
              {loading ? (
                <p>Cargando turnos...</p>
              ) : turnosFiltrados.length > 0 ? (
                turnosFiltrados.map((turno) => {
                  const nombrePaciente =
                    turno.afiliado?.nombre && turno.afiliado?.apellido
                      ? `${turno.afiliado.nombre} ${turno.afiliado.apellido}`
                      : turno.integrante?.nombre || "Paciente no especificado";

                  return (
                    <div key={turno.id} className="turno-card">
                      <div
                        className="turno-header"
                        onClick={() =>
                          setSelectedTurno(
                            selectedTurno === turno.id ? null : turno.id
                          )
                        }
                      >
                        <span className="hora">
                          {format(new Date(turno.start), "HH:mm")}
                        </span>
                        <span className="paciente">{nombrePaciente}</span>
                        <button className="btn-ver">Ver</button>
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
                            maxLength={1000}
                            value={turno.notes || ""}
                            onChange={(e) =>
                              handleNoteChange(turno.id, e.target.value)
                            }
                            placeholder="Agregar notas (máx. 1000 caracteres)"
                          />

                          <div className="botones-turno">
                            <button
                              className="btn-historia"
                              onClick={() => handleVerHistoriaClinica(turno)}
                            >
                              Historia clínica
                            </button>

                            <button
                              className="btn-guardar"
                              onClick={() => handleGuardarNota(turno.id)}
                            >
                              Guardar nota
                            </button>
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
        </div>

        <footer className="footer-vista">
          <small>Vista actual: Centro Médico</small>
        </footer>

        <DetalleHistorialModal
          mostrar={!!modalDetalle}
          detalle={modalDetalle}
          onClose={() => setModalDetalle(null)}
        />
      </div>
    </PrestadoresLayout>
  );
}
