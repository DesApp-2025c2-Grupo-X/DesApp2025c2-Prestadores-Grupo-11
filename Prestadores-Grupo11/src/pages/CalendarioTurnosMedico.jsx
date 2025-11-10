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
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { getTurnosByPrestador, updateNotasTurno } from "../services/TurnosApi";

export default function CalendarioTurnosMedico() {
  const user = JSON.parse(localStorage.getItem("miapp_user"));
  const prestadorId = user?.id;
  const role = user?.role;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [turnos, setTurnos] = useState([]);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [loading, setLoading] = useState(true);

  // === Cargar turnos desde el backend o localStorage ===
  useEffect(() => {
    const controller = new AbortController();

    const fetchTurnos = async () => {
      if (!prestadorId) {
        toast.error(" No se encontró el ID del prestador en localStorage");
        setLoading(false);
        return;
      }

      // Seguridad: sólo los médicos deben usar este endpoint
      if (role !== "medico") {
        toast.error(" Acceso no autorizado. Solo médicos pueden acceder a este calendario.");
        setLoading(false);
        return;
      }

      try {

        const response = await getTurnosByPrestador(prestadorId);
        //const data = response?.data ?? [];
        const turnosValidos = response

        setTurnos(turnosValidos);

        console.log("Turnos recibidos del backend:", turnosValidos);
        localStorage.setItem("turnos_medico", JSON.stringify(turnosValidos));
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

  // === Actualizar texto de notas localmente ===
  const handleNoteChange = (id, value) => {
    setTurnos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, notas: value } : t))
    );
  };

  // === Guardar nota (en backend + localStorage) ===
  const handleGuardarNota = async (id) => {
    const turno = turnos.find((t) => t.id === id);
    if (!turno) return;

    try {
      await updateNotasTurno(prestadorId, id, turno.notas);

      const turnosActualizados = turnos.map((t) =>
        t.id === id ? { ...t, notas: turno.notas } : t
      );
      setTurnos(turnosActualizados);
      localStorage.setItem("turnos_medico", JSON.stringify(turnosActualizados));

      toast.success(`Nota guardada para ${turno.afiliado?.nombre ?? "Paciente"}`);
      setSelectedTurno(null);
    } catch (error) {
      console.error("Error al guardar nota:", error);
      toast.error(" No se pudo guardar la nota en la base de datos");
    }
  };

  // === Filtrar los turnos del día seleccionado ===
  const turnosDelDia = turnos.filter((t) => {
    if (!t.date) return false;
    const fechaTurno = new Date(t.date);
    return (
      fechaTurno.getDate() === selectedDate.getDate() &&
      fechaTurno.getMonth() === selectedDate.getMonth() &&
      fechaTurno.getFullYear() === selectedDate.getFullYear()
    );
  });


  // === Estado inicial o error de login ===
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

          {/* === Agenda del día === */}
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
                turnosDelDia.map((turno) => (
                  <div key={turno.id} className="turno-card">
                    <div
                      className="turno-header"
                      onClick={() =>
                        setSelectedTurno(selectedTurno === turno.id ? null : turno.id)
                      }
                    >
                      <span className="hora">{turno.date}</span>
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
                          value={turno.notas || ""} //turno.notes?????
                          onChange={(e) => handleNoteChange(turno.id, e.target.value)}
                          placeholder="Agregar notas (máx. 500 caracteres)"
                        />

                        {/* 🔹 Botones alineados en extremos */}
                        <div
                          className="botones-turno"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "10px",
                            alignItems: "center",
                          }}
                        >
                          {/* Izquierda */}
                          <button
                            className="btn-historia"
                            data-tooltip-id={`historia-${turno.id}`}
                            data-tooltip-content={
                              turno.afiliado?.historiaClinica ??
                              "Sin historia clínica registrada"
                            }
                          >
                            Historia clínica
                          </button>

                          {/* Derecha */}
                          <button
                            className="btn-guardar"
                            onClick={() => handleGuardarNota(turno.id)}
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
                ))
              ) : (
                <p className="sin-turnos">No hay turnos para esta fecha.</p>
              )}
            </div>
          </div>
        </div>

        <footer className="footer-vista">
          <small>Vista actual: Médico</small>
        </footer>
      </div>
    </PrestadoresLayout>
  );
}
