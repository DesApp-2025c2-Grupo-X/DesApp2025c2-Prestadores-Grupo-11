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
import {
  getTurnosByPrestadorId,
  updateNotasTurno,
} from "../services/TurnosApi";
import { Tooltip as ReactTooltip } from "react-tooltip";
import TablaHistorial from "../components/TablaHistorial";
import "react-tooltip/dist/react-tooltip.css";

export default function CalendarioTurnosMedico() {
  const user = JSON.parse(localStorage.getItem("miapp_user"));
  const prestadorId = user?.id;
  const role = user?.role;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [turnos, setTurnos] = useState([]);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHistoriaModal, setShowHistoriaModal] = useState(false);
  const [pacienteId, setPacienteId] = useState(0);
  const [tipoPaciente, setTipoPaciente] = useState("");
  const [nota, setNota] = useState("");

  useEffect(() => {
    console.log("El tipo de paciente: ", tipoPaciente)
    console.log("El id del paciente: ", pacienteId)
  }, [pacienteId, tipoPaciente])

  // CONTROL SEGURO DEL CLICK EN EL CALENDARIO
  const handleSelectDate = (date) => {
    if (!date || isNaN(date)) return; // Evita crash al hacer doble click.
    setSelectedDate(date);
  };

  // CARGAR TURNOS
  useEffect(() => {
    const abortController = new AbortController();

    const fetchTurnos = async () => {
      if (!prestadorId) {
        toast.error("No se encontró el ID del prestador.");
        setLoading(false);
        return;
      }

      if (role !== "medico") {
        toast.error("Acceso no autorizado.");
        setLoading(false);
        return;
      }

      try {
        const { ok, data } = await getTurnosByPrestadorId(prestadorId, {
          signal: abortController.signal,
        });

        if (ok) {
          setTurnos(data);
          localStorage.setItem("turnos_medico", JSON.stringify(data));
        } else {
          toast.warn("No se pudo conectar. Cargando datos locales...");
          const localTurnos =
            JSON.parse(localStorage.getItem("turnos_medico")) || [];
          setTurnos(localTurnos);
        }
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Error inesperado:", error);
        toast.error("Error al obtener los turnos");
      } finally {
        setLoading(false);
      }
    };

    fetchTurnos();

    return () => {
      abortController.abort(); // Evita crashes por re-renders rápidos
    };
  }, [prestadorId, role]);


  // VER HISTORIA CLÍNICA
  const handleVerHistoriaClinica = async (turno) => {
    const tipoPaciente = turno.afiliadoId ? "Afiliado" : "Integrante";
    const pacienteId = turno.afiliadoId || turno.integranteId;

    if (!pacienteId) {
      toast.warn("Este turno no tiene paciente asociado.");
      return;
    }

    setPacienteId(pacienteId);
    setTipoPaciente(tipoPaciente);
    setShowHistoriaModal(true);
  };

  
  // GUARDAR NOTA
  const handleGuardarNota = async (id) => {
    const turno = turnos.find((t) => t.id === id);
    if (!turno) return;

    try {
      await updateNotasTurno(prestadorId, id, nota);

      const turnosActualizados = turnos.map((t) =>
        t.id === id ? { ...t, notas: nota } : t
      );

      setTurnos(turnosActualizados);
      localStorage.setItem("turnos_medico", JSON.stringify(turnosActualizados));

      toast.success("Nota guardada correctamente.");
      setSelectedTurno(null);
      setNota("");
    } catch (error) {
      console.error("Error al guardar nota:", error);
      toast.error("No se pudo guardar la nota.");
    }
  };

  // FILTRAR TURNOS DEL DÍA
  const turnosDelDia = useMemo(() => {
    if (!selectedDate) return [];

    return turnos.filter((t) => {
      const fechaTurno = new Date(t.date);
      if (isNaN(fechaTurno)) return false;

      return (
        fechaTurno.getFullYear() === selectedDate.getFullYear() &&
        fechaTurno.getMonth() === selectedDate.getMonth() &&
        fechaTurno.getDate() === selectedDate.getDate()
      );
    });
  }, [turnos, selectedDate]);

  if (!prestadorId) {
    return (
      <p style={{ padding: "2rem" }}>No se encontró el médico logueado.</p>
    );
  }

  return (
    <PrestadoresLayout header={<HeaderPrestadores />}>
      <div className="calendario-turnos-container">
        <ToastContainer />

        <h2 className="titulo">Calendario de turnos</h2>

        <div className="contenido-calendario">
          {/* CALENDARIO */}
          <div className="calendario-box">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleSelectDate}
              footer={
                selectedDate && (
                  <p className="seleccion-fecha">
                    Fecha seleccionada: {format(selectedDate, "dd/MM/yyyy")}
                  </p>
                )
              }
            />
          </div>

          {/* AGENDA */}
          <div className="agenda-box card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">
                {selectedDate
                  ? format(selectedDate, "EEEE dd 'de' MMMM yyyy")
                  : "Seleccioná una fecha"}
              </h5>
            </div>

            <div className="agenda-scroll">
              {loading ? (
                <p>Cargando turnos...</p>
              ) : turnosDelDia.length > 0 ? (
                turnosDelDia.map((turno) => {
                  const fechaTurno = new Date(turno.date);
                  const hoy = new Date();
                  fechaTurno.setHours(0, 0, 0, 0);
                  hoy.setHours(0, 0, 0, 0);
                  const turnoPasado = fechaTurno < hoy;

                  return (
                    <div
                      key={turno.id}
                      className={`turno-card ${
                        turnoPasado ? "turno-pasado" : ""
                      }`}
                    >
                      <div
                        className="turno-header"
                        onClick={() =>
                          setSelectedTurno(
                            selectedTurno === turno.id ? null : turno.id
                          )
                        }
                      >
                        <span className="hora">
                          {format(new Date(turno.date), "HH:mm")}
                        </span>
                        <span className="paciente">
                          {turno.afiliado
                            ? `${turno.afiliado.nombre} ${turno.afiliado.apellido}`
                            : turno.integrante?.nombre ||
                              "Paciente no especificado"}
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
                            placeholder={
                              turnoPasado
                                ? "No se puede agregar notas a un turno pasado."
                                : "Agregar notas (máx. 500 caracteres)"
                            }
                            disabled={turnoPasado}
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
                              disabled={turnoPasado}
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

          {/* MODAL HISTORIA CLÍNICA */}
          {showHistoriaModal && (
            <div
              className="modal fade show"
              style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-xl modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5>Historia clínica</h5>
                    <button
                      className="btn-close"
                      onClick={() => setShowHistoriaModal(false)}
                    />
                  </div>

                  <div className="modal-body">
                    <TablaHistorial
                      pacienteId={pacienteId}
                      tipo={tipoPaciente}
                    />
                  </div>

                  <div className="modal-footer">
                    <button
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
