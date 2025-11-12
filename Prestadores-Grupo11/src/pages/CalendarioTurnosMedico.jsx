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
import DetalleHistorialModal from "../components/DetalleHistorialModal";
import { getTurnosByPrestador, updateNotasTurno } from "../services/TurnosApi";
import {
  addNotaAHistoriaClinica,
  getHistoriaClinicaByAfiliado,
} from "../services/HistorialClinicaApi";

export default function CalendarioTurnosMedico() {
  const user = JSON.parse(localStorage.getItem("miapp_user"));
  const prestadorId = user?.id;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [turnos, setTurnos] = useState([]);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estado separado para historia clínica
  const [modalDetalle, setModalDetalle] = useState(null);

  useEffect(() => {
    if (!prestadorId) return;

    const fetchTurnos = async () => {
      try {
        const data = await getTurnosByPrestador(prestadorId);
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

  const handleNoteChange = (id, value) => {
    setTurnos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, notes: value } : t))
    );
  };

  const handleGuardarNota = async (id) => {
    const turno = turnos.find((t) => t.id === id);
    if (!turno) return;

    try {
      //  Actualizar nota en el turno
      await updateNotasTurno(prestadorId, id, turno.notes);

      //  Actualizar estado local
      setTurnos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, notes: turno.notes } : t))
      );

      //  Agregar nota a la historia clínica si hay afiliado
      if (turno.afiliadoId || turno.integranteId) {
        const prestadorNombre = user.username; // desde localStorage
        const fechaConsulta = turno.start;

        const notaHistorial = {
          texto: turno.notes || "",
          prestador: prestadorNombre,
          fecha: fechaConsulta,
        };

        // elegir si es afiliado o integrante
        const pacienteId = turno.afiliadoId || turno.integranteId;
        await addNotaAHistoriaClinica(pacienteId, notaHistorial);
      }

      // Mensaje de éxito
      toast.success(
        `Nota guardada para ${
          turno.afiliado?.nombre
            ? `${turno.afiliado.nombre} ${turno.afiliado.apellido}`
            : turno.integrante?.nombre || "Paciente"
        }`
      );
    } catch (error) {
      console.error("Error al guardar nota:", error);
      toast.error("No se pudo guardar la nota");
    }
  };

  const handleVerHistoriaClinica = async (turno) => {
    try {
      if (!turno.afiliadoId && !turno.integranteId) {
        toast.warn("Este paciente no tiene afiliado o integrante asociado");
        return;
      }

      let detalle = null;
      if (turno.afiliadoId) {
        detalle = await getHistoriaClinicaByAfiliado(turno.afiliadoId);
      } else {
        toast.warn("Integrante aún no tiene historia clínica");
        return;
      }

      setModalDetalle(detalle || { notas: "Sin historial clínico" });
    } catch (error) {
      console.error("Error al obtener historia clínica:", error);
      toast.error("No se pudo cargar la historia clínica del paciente");
    }
  };

  const turnosDelDia = turnos.filter((t) => {
    if (!t.date) return false;
    const fechaTurno = new Date(t.date);
    return (
      fechaTurno.getDate() === selectedDate.getDate() &&
      fechaTurno.getMonth() === selectedDate.getMonth() &&
      fechaTurno.getFullYear() === selectedDate.getFullYear()
    );
  });

  if (!prestadorId)
    return (
      <p style={{ padding: "2rem" }}>No se encontró el médico logueado.</p>
    );

  return (
    <PrestadoresLayout header={<HeaderPrestadores />}>
      <div className="calendario-turnos-container">
        <ToastContainer />
        <h2 className="titulo">Calendario de turnos</h2>

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
                        setSelectedTurno(
                          selectedTurno === turno.id ? null : turno.id
                        )
                      }
                    >
                      <span className="hora">
                        {format(new Date(turno.start), "HH:mm")}
                      </span>
                      <span className="paciente">
                        {turno.afiliado?.nombre
                          ? `${turno.afiliado.nombre} ${turno.afiliado.apellido}`
                          : turno.integrante?.nombre ||
                            "Paciente no especificado"}
                      </span>
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
                          style={{ overflowY: "auto" }}
                          value={turno.notes || ""}
                          onChange={(e) =>
                            handleNoteChange(turno.id, e.target.value)
                          }
                          placeholder="Agregar notas (máx. 1000 caracteres)"
                        />
                        <div
                          className="botones-turno"
                          style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "10px",
                          }}
                        >
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

        <DetalleHistorialModal
          mostrar={!!modalDetalle}
          detalle={modalDetalle}
          onClose={() => setModalDetalle(null)}
        />
      </div>
    </PrestadoresLayout>
  );
}
