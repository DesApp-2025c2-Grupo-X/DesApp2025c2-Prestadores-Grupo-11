import React, {  useState, } from "react";
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

const turnosEjemplo = [
  {
    id: 1,
    hora: "09:00",
    paciente: "Juan Pérez",
    notas: "",
  },
  {
    id: 2,
    hora: "09:30",
    paciente: "María Díaz",
    notas: "",
  },
];

export default function CalendarioTurnos() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [turnos, setTurnos] = useState(turnosEjemplo);

  const handleNoteChange = (id, value) => {
    setTurnos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, notas: value } : t))
    );
  };

  const handleGuardarNota = (id) => {
    const turno = turnos.find((t) => t.id === id);
    toast.success(`Nota guardada para ${turno.paciente}`);
    setSelectedTurno(null);
  };


  return (
    <PrestadoresLayout header={<HeaderPrestadores />}>
       <div className="calendario-turnos-container">
      <ToastContainer />

      {/* ====== CABECERA ====== */}
      <h2 className="titulo">Calendario de turnos</h2>

      <div className="contenido-calendario">
        {/* ====== COLUMNA CALENDARIO ====== */}
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

        {/* ====== COLUMNA HORARIOS ====== */}
        <div className="agenda-box card shadow-sm">
          <div className="card-header">
            <h5 className="mb-0">
              {format(selectedDate, "EEEE dd 'de' MMMM yyyy")}
            </h5>
          </div>

          <div className="agenda-scroll">
            {turnos.map((turno) => (
              <div key={turno.id} className="turno-card">
                <div
                  className="turno-header"
                  onClick={() =>
                    setSelectedTurno(
                      selectedTurno === turno.id ? null : turno.id
                    )
                  }
                >
                  <span className="hora">{turno.hora}</span>
                  <span className="paciente">{turno.paciente}</span>
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
                      value={turno.notas}
                      onChange={(e) =>
                        handleNoteChange(turno.id, e.target.value)
                      }
                      placeholder="Agregar notas (máx. 500 caracteres)"
                    />
                    <button
                      className="btn-guardar"
                      onClick={() => handleGuardarNota(turno.id)}
                    >
                      Guardar nota
                    </button>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="footer-vista">
        <small>← Vista actual: Médico</small>
      </footer>
    </div>
    </PrestadoresLayout>
  );
}
