import React, { useState, useEffect, useMemo } from "react";
import PrestadoresLayout from "../components/PrestadoresLayout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "../styles/CalendarioTurnos.css";
import DetalleHistorialModal from "../components/DetalleHistorialModal";
import TablaHistorial from "../components/TablaHistorial";
import {
  getTurnosByPrestadorId, getTurnosCentro,
} from "../services/TurnosApi";
import { getMedicosDeCentroApi } from "../services/PrestadoresApi"


export default function CalendarioTurnosCentro() {
  const user = JSON.parse(localStorage.getItem("miapp_user"));
  const centroId = user?.id; // AHORA ES CENTRO MÉDICO

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [turnos, setTurnos] = useState([]);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalDetalle, setModalDetalle] = useState(null);
  const [consultas, setConsultas] = useState([]);
  const [showHistoriaModal, setShowHistoriaModal] = useState(false);

  // Información necesaria para cargar historial
  const [pacienteId, setPacienteId] = useState(0);
  const [tipoPaciente, setTipoPaciente] = useState("");

  const [medicosCentro, setMedicosCentro] = useState([]);

  // Filtros nuevos
  const [especialidad, setEspecialidad] = useState("");
  const [medico, setMedico] = useState("");

  const especialidades = user?.especialidades || [];

  /**  Cargar turnos del centro */
  useEffect(() => {
    if (!centroId) return;

    const fetchTurnos = async () => {
      try {
        const res = await getTurnosCentro(centroId);
        const data = Array.isArray(res.data) ? res.data : [];
        setTurnos(data);
        console.log("Turnos recibidos del backend:", data);
      } catch (error) {
        console.error("Error al obtener turnos:", error);
        toast.error("No se pudieron cargar los turnos del centro.");
      } finally {
        setLoading(false);
      }
    };

    const fetchMedicos = async () => {
      try {
        const medicos = await getMedicosDeCentroApi(centroId);
        setMedicosCentro(medicos);
      } catch (error) {
        console.error("Error al obtener médicos del centro:", error);
      }
    };

    fetchTurnos();
    fetchMedicos();
  }, [centroId]);

  /** Muestra historia clínica */
  const handleVerHistoriaClinica = async (turno) => {
    const tipo = turno.afiliadoId ? "Afiliado" : "Integrante";
    const id = turno.afiliadoId || turno.integranteId;

    if (!id) {
      toast.warn("Este turno no tiene paciente asociado.");
      return;
    }

    setPacienteId(id);
    setTipoPaciente(tipo);
    setShowHistoriaModal(true);

    setShowHistoriaModal(true); //  abrimos el modal

  };

  /** Filtra los turnos por fecha */
  const turnosDelDia = useMemo(() => {
    return turnos.filter((t) => {
      if (!selectedDate) return false;
      const fecha = new Date(t.date);
      if (isNaN(fecha)) return false;

      return (
        fecha.getDate() === selectedDate.getDate() &&
        fecha.getMonth() === selectedDate.getMonth() &&
        fecha.getFullYear() === selectedDate.getFullYear()
      );
    });
  }, [turnos, selectedDate]);

  /** Filtros: especialidad + médico */
  const turnosFiltrados = useMemo(() => {
    return turnosDelDia.filter((t) => {
      const especialidadPrestador = t.prestador?.especialidades?.[0];

      const coincideEspecialidad =
        !especialidad || especialidadPrestador === especialidad;

      const coincideMedico =
        !medico || t.prestadorId === parseInt(medico);

      return coincideEspecialidad && coincideMedico;
    });
  }, [turnosDelDia, especialidad, medico]);

  const handleLimpiarFiltros = () => {
    setEspecialidad("");
    setMedico("");
  };

  if (!centroId)
    return <p style={{ padding: "2rem" }}>No se encontró el centro médico logueado.</p>;

  useEffect(() => {
    console.log("Especialidad escogida: ", especialidad)
    console.log("Medico escogido: ", medico)
  }, [especialidad, medico])

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
                {especialidades.map((esp) => (
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
                {medicosCentro
                  // .filter((m) => !especialidad || m.especialidad === especialidad)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.username}
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
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);  // solo actualiza si date es válido
                }
              }}
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
                {selectedDate && !isNaN(new Date(selectedDate))
                  ? format(new Date(selectedDate), "EEEE dd 'de' MMMM yyyy")
                  : "Fecha inválida"}
              </h5>
            </div>

            <div className="agenda-scroll">
              {loading ? (
                <p>Cargando turnos...</p>
              ) : turnosFiltrados.length > 0 ? (
                turnosFiltrados.map((turno) => {
                  const nombrePaciente =
                    turno.afiliado?.nombre
                      ? `${turno.afiliado.nombre} ${turno.afiliado.apellido}`
                      : turno.integrante?.nombre || "Paciente no especificado";

                  return (
                    <div key={turno.id} className="turno-card">
                      <div className="turno-header">
                        <span className="hora">
                          {format(new Date(turno.date), "HH:mm")}
                        </span>
                        <span className="paciente">
                          <span style={{ fontWeight: "bolder" }}>{nombrePaciente}</span> - {turno.prestador.especialidades[0]} - {turno.prestador.username}
                        </span>
                        <button
                          className="btn-historia"
                          onClick={() => handleVerHistoriaClinica(turno)}
                        >
                          Historia clínica
                        </button>
                      </div>
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
              style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1055 }}
            >
              <div className="modal-dialog modal-xl modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Historia clínica</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowHistoriaModal(false)}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <TablaHistorial pacienteId={pacienteId} tipo={tipoPaciente} />
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
