import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PrestadoresLayout from "../components/PrestadoresLayout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import SideBar from "../components/SideBar";
import { ArrowLeft, Pencil, Plus, Folder } from "lucide-react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format, addMinutes, startOfDay, setHours, isSameDay } from "date-fns";
import "react-day-picker/dist/style.css";
import "../styles/CalendarioTurnos.css";
import { DayPicker } from "react-day-picker";

// === Datos de ejemplo ===
const especialidadesEjemplo = ["Clínica Médica", "Cardiología", "Dermatología"];
const medicosEjemplo = {
  "Clínica Médica": ["Dra. Laura Gómez", "Dr. Carlos Díaz"],
  Cardiología: ["Dr. Martín Acosta"],
  Dermatología: ["Dra. María Rossi", "Dr. Luis Fernández"],
};

const turnosEjemplo = [
  {
    id: 1,
    especialidad: "Clínica Médica",
    medico: "Dra. Laura Gómez",
    hora: "09:00",
    paciente: "Juan Pérez",
  },
  {
    id: 2,
    especialidad: "Clínica Médica",
    medico: "Dr. Carlos Díaz",
    hora: "10:00",
    paciente: "María Díaz",
  },
  {
    id: 3,
    especialidad: "Cardiología",
    medico: "Dr. Martín Acosta",
    hora: "11:00",
    paciente: "Luis Romero",
  },
];

export default function CalendarioTurnosCentro() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [especialidad, setEspecialidad] = useState("");
  const [medico, setMedico] = useState("");
  const [turnos, setTurnos] = useState(turnosEjemplo);

  // === Filtrado dinámico ===
  const medicosDisponibles = useMemo(
    () => (especialidad ? medicosEjemplo[especialidad] || [] : []),
    [especialidad]
  );

  const turnosFiltrados = useMemo(() => {
    return turnos.filter(
      (t) =>
        (!especialidad || t.especialidad === especialidad) &&
        (!medico || t.medico === medico)
    );
  }, [turnos, especialidad, medico]);

  const handleLimpiarFiltros = () => {
    setEspecialidad("");
    setMedico("");
  };

  return (
    <PrestadoresLayout header={<HeaderPrestadores />}>
      <div className="calendario-turnos-container">
        <h2 className="titulo">Gestión de Turnos - Centro Médico</h2>

        {/* === FILTROS === */}
        <div className="filtros-box card shadow-sm p-3 mb-3">
          {/* Sección de filtros */}
          <div className="row mb-3">
            <div className="col-md-6">
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

            <div className="col-md-6">
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
          </div>

          {/* Sección de botón */}
          <div className="row justify-content-end">
            <div className="col-auto">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleLimpiarFiltros}
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* === CONTENIDO PRINCIPAL === */}
        <div className="contenido-calendario">
          {/* COLUMNA CALENDARIO */}
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

          {/* COLUMNA TURNOS */}
          <div className="agenda-box card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">
                {format(selectedDate, "EEEE dd 'de' MMMM yyyy")}
              </h5>
            </div>

            <div className="agenda-scroll">
              {turnosFiltrados.length === 0 ? (
                <div className="text-muted text-center py-4">
                  No hay turnos para mostrar
                </div>
              ) : (
                turnosFiltrados.map((turno) => (
                  <motion.div
                    key={turno.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="turno-card"
                  >
                    <div className="turno-header">
                      <span className="hora">{turno.hora}</span>
                      <span className="paciente">
                        {turno.paciente} ({turno.medico})
                      </span>
                    </div>
                    <div className="small text-muted">
                      Especialidad: {turno.especialidad}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        <footer className="footer-vista">
          <small> Vista actual: Centro Médico</small>
        </footer>
      </div>
    </PrestadoresLayout>
  );
}
