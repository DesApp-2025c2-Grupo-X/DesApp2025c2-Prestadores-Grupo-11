import React, { useEffect, useState, useMemo } from "react";
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
;
import "react-day-picker/dist/style.css";

const HOURS = Array.from({ length: 12 }, (_, i) => 8 + i); // 8:00 - 19:00 (12 slots)
const SLOT_MINUTES = 30; // cada fila representa 30 minutos

// Mock data para demostración; en producción pasar como prop o cargar desde API
const mockAppointments = [
  {
    id: 1,
    date: new Date(), // hoy
    start: setHours(new Date(), 9),
    duration: 30, // minutos
    patientName: "Juan Pérez",
    notes: "",
  },
  {
    id: 2,
    date: new Date(),
    start: addMinutes(setHours(new Date(), 9), 30),
    duration: 60,
    patientName: "María Díaz",
    notes: "Traer estudios previos",
  },
  {
    id: 3,
    date: addMinutes(new Date(), 24 * 60), // mañana
    start: setHours(new Date(), 11),
    duration: 30,
    patientName: "Carlos Gómez",
    notes: "",
  },
];

export default function CalendarioTurnosMedico({
  appointments = mockAppointments,
  onSaveNote = (id, note) => {
    console.log("Guardar nota: ", id, note);
    // Aquí reemplazar por llamado a API
  },
}) {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [localAppointments, setLocalAppointments] = useState(appointments);

  // Filtrar turnos del día seleccionado
  const dayAppointments = useMemo(
    () =>
      localAppointments.filter((a) => isSameDay(new Date(a.date), selectedDay)),
    [localAppointments, selectedDay]
  );

  const handleNoteChange = (id, value) => {
    setLocalAppointments((prev) =>
      prev.map((t) => (t.id === id ? { ...t, notes: value } : t))
    );
  };

  const handleSave = (id) => {
    const turno = localAppointments.find((t) => t.id === id);
    if (turno) onSaveNote(id, turno.notes);
  };

  // Helper para comprobar si un turno empieza en la hora/minuto de una fila
  function appointmentAtSlot(appointmentsList, hour, minute) {
    return appointmentsList.find((a) => {
      const start = new Date(a.start);
      return start.getHours() === hour && start.getMinutes() === minute;
    });
  }

  return (
    <PrestadoresLayout header={<HeaderPrestadores />}>
      <div
        className="container-fluid p-3"
        style={{ minHeight: "calc(100vh - 80px)" }}
      >
        <div className="row">
          <div className="col-12">
            <h2 className="text-center mb-3">Calendario de turnos</h2>
          </div>
        </div>

        <div className="row g-3">
          {/* Area principal: horarios */}
          <div className="col-lg-8 order-2 order-lg-1">
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <strong>{format(selectedDay, "EEEE d 'de' MMMM yyyy")}</strong>
              </div>
              <div
                className="card-body p-0"
                style={{ maxHeight: "60vh", overflowY: "auto" }}
              >
                <div
                  className="row g-0 align-items-start"
                  style={{ minHeight: "60vh" }}
                >
                  <div className="col-3 border-end p-0">
                    {/* Column of hours */}
                    <div className="d-none d-md-block">
                      {HOURS.map((h) => (
                        <div
                          key={h}
                          className="p-3 border-bottom"
                          style={{
                            height: `${(60 / SLOT_MINUTES) * 24}px`,
                            background: "var(--gris-claro)",
                          }}
                        >
                          <small className="text-muted">{`${String(h).padStart(
                            2,
                            "0"
                          )}:00`}</small>
                        </div>
                      ))}
                    </div>

                    {/* Mobile condensed hours */}
                    <div className="d-md-none p-2">
                      {HOURS.map((h) => (
                        <div key={h} className="py-2">
                          <small className="text-muted">{`${String(h).padStart(
                            2,
                            "0"
                          )}:00`}</small>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-9 p-3">
                    {/* Slots area */}
                    <div>
                      {HOURS.map((hour) => {
                        // cada hora tiene 60/SLOT_MINUTES filas
                        const rows = 60 / SLOT_MINUTES;
                        return (
                          <div key={hour} className="mb-2">
                            {Array.from({ length: rows }).map((_, idx) => {
                              const minute = idx * SLOT_MINUTES;
                              const appt = appointmentAtSlot(
                                dayAppointments,
                                hour,
                                minute
                              );

                              return (
                                <div
                                  key={`${hour}-${minute}`}
                                  className="d-flex align-items-start mb-1"
                                  style={{ minHeight: "48px" }}
                                >
                                  <div className="w-100">
                                    {appt ? (
                                      <div className="card p-2 shadow-sm">
                                        <div className="d-flex justify-content-between align-items-start">
                                          <div>
                                            <strong>{`Paciente: ${appt.patientName}`}</strong>
                                            <div
                                              style={{ fontSize: "0.9rem" }}
                                            >{`${String(hour).padStart(
                                              2,
                                              "0"
                                            )}:${String(minute).padStart(
                                              2,
                                              "0"
                                            )}`}</div>
                                          </div>
                                          <div>
                                            <button
                                              className="btn btn-sm btn-outline-primary"
                                              onClick={() =>
                                                handleSave(appt.id)
                                              }
                                            >
                                              Guardar
                                            </button>
                                          </div>
                                        </div>

                                        <div className="mt-2">
                                          <label className="form-label small mb-1">
                                            Notas
                                          </label>
                                          <textarea
                                            className="form-control form-control-sm"
                                            rows={2}
                                            value={appt.notes}
                                            onChange={(e) =>
                                              handleNoteChange(
                                                appt.id,
                                                e.target.value
                                              )
                                            }
                                            maxLength={500}
                                            placeholder="Escriba notas relevantes (máx. 500 caracteres)"
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      <div
                                        className="border rounded p-2 h-100"
                                        style={{ background: "#fff" }}
                                      />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer text-muted small">Vista: Médico</div>
            </div>
          </div>

          {/* Sidebar calendario */}
          <div className="col-lg-4 order-1 order-lg-2">
            <div className="card shadow-sm sticky-top" style={{ top: "80px" }}>
              <div className="card-body">
                <h6 className="card-title">Seleccionar día</h6>
                <DayPicker
                  selectedDays={selectedDay}
                  onDayClick={(day) => day && setSelectedDay(day)}
                  navbarElement={({
                    className,
                    children,
                    onClickPrev,
                    onClickNext,
                  }) => (
                    <div
                      className={className}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={onClickPrev}
                      >
                        ‹
                      </button>
                      <div>{children}</div>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={onClickNext}
                      >
                        ›
                      </button>
                    </div>
                  )}
                />

                <hr />

                <div>
                  <h6 className="mb-1">Turnos del día</h6>
                  {dayAppointments.length === 0 ? (
                    <div className="text-muted">
                      No hay turnos para este día
                    </div>
                  ) : (
                    dayAppointments.map((t) => (
                      <div key={t.id} className="mb-2 p-2 border rounded">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{t.patientName}</strong>
                            <div className="small text-muted">
                              {format(new Date(t.start), "HH:mm")}
                            </div>
                          </div>
                          <div>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => setSelectedDay(new Date(t.start))}
                            >
                              Ver
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PrestadoresLayout>
  );
}
