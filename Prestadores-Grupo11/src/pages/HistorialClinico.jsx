import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PrestadoresLayout from "../components/PrestadoresLayout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import SideBar from "../components/SideBar";
import { ArrowLeft, ClipboardList, Users } from "lucide-react";
import { motion } from "framer-motion";
import { getAllIntegrantes } from "../services/IntegrantesApi";
import { getAllAfiliados } from "../services/AfiliadosApi";
import { getSituacionesByPacienteId } from "../services/SituacionesApi";
import { getNombrePrestadorById } from "../services/PrestadoresApi"; // Inutilizado
import { getTurnosByPacienteId } from "../services/TurnosApi";
import "../styles/SituacionesTerapeuticas.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import TablaHistorial from "../components/TablaHistorial";


export default function HistorialClinico() {
  const { dni } = useParams();
  const navigate = useNavigate();

  //Me traigo el tipo de paciente de los query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tipo = queryParams.get("tipo"); // "afiliados", "integrantes"

  const [paciente, setPaciente] = useState(null);
  //const [situaciones, setSituaciones] = useState([]);
  const [consultas, setConsultas] = useState([]);

  //Este estado es para manejar el problema en donde tengo el idPrestador, y necesito saber el nombre
  //Para poder mostrarlo en la tabla de historial clinico
  //const [nombresPrestadores, setNombresPrestadores] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroNotas, setFiltroNotas] = useState(false);

  //Obtiene el user guardado en el localStorage
  const storedUser = JSON.parse(localStorage.getItem("miapp_user") || "null");
  const user = storedUser;

  //Funcion para capitalizar la primera letra de cada palabra
  const mayusculas = (str) => str.toLowerCase().replace(/(^|\s)\p{L}/gu, (c) => c.toUpperCase());

  // Cargar datos del paciente
  useEffect(() => {
    const cargarPaciente = async () => {
      try {
        const integrantes = await getAllIntegrantes();
        const afiliados = await getAllAfiliados();
        const encontrado = integrantes.find((integrante) => integrante.dni === dni) || afiliados.find(afiliado => afiliado.dni === dni)

        if (!encontrado) {
          console.log(`No se encontro el integrante DNI ${dni}`)
        }

        console.log(encontrado)
        setPaciente(encontrado);
      } catch (error) {
        console.error('Error al cargar integrantes:', error);
        setError(error.message)
      } finally {
        setLoading(false);
      }
    };

    cargarPaciente();

  }, [dni]);

  useEffect(() => {

    const getConsultas = async () => {
      if (!paciente || !paciente.id) return; // Si no hay paciente, no hace nada

      try {
        const situacionesEncontradas = await getSituacionesByPacienteId(paciente.id, tipo);
        const situacionesDeBaja = situacionesEncontradas.filter((situacion) => situacion.estado === "baja")

        let turnosEncontrados = await getTurnosByPacienteId(paciente.id, tipo);

        if (filtroNotas) {
          turnosEncontrados = turnosEncontrados.filter(turno => turno.notes && turno.prestadorId == user?.id)

          const turnosFiltrados = turnosEncontrados.map((t) => ({
            tipo: "Turno",
            fecha: t.date,
            descripcion: t.descripción,
            especialidad: t.prestador?.especialidad || "",
            medico: t.prestador?.username || "",
            notas: t.notes || "",
          }));

          const ordenadosPorFecha = turnosFiltrados.sort(
            (a, b) => new Date(b.fecha) - new Date(a.fecha)
          );

          setConsultas(ordenadosPorFecha);
          return;

        }

        const ahora = new Date();
        const turnosResult = turnosEncontrados.filter(turno => {
          const fechaTurno = new Date(turno.date);
          const turnoFinalizado = fechaTurno.getTime() < ahora.getTime();
          const turnoNotas = turno.notes && turno.notes.trim() !== "";

          return turnoFinalizado || turnoNotas
        });

        //Transformo el nombre de los atributos de situaciones y turnos, para que
        //sea mas facil mostrarlos en la tabla.
        const unificados = [
          ...situacionesDeBaja.map(s => ({
            tipo: "Situacion terapeutica",
            fecha: s.fecha_final,
            descripcion: s.observaciones,
            especialidad: s.especialidad,
            medico: s.prestador.username,
            notas: ""
          })),
          ...turnosResult.map(t => ({
            tipo: "Turno",
            fecha: t.date,
            descripcion: t.descripción,
            especialidad: t.prestador?.especialidad || "",
            medico: t.prestador?.username || "",
            notas: t.notes || ""
          }))
        ];

        const ordenadosPorFecha = unificados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        setConsultas(ordenadosPorFecha);

      } catch (error) {
        console.error("Hubo un error al buscar las consultas", error)
      }
    };

    getConsultas()
  }, [paciente, filtroNotas, tipo])

  const truncarTexto = (texto, limite = 80) => {
    if (!texto) return "";
    return texto.length > limite ? texto.slice(0, limite) + "..." : texto;
  };

  // Estado: cargando
  if (loading) {
    return (
      <PrestadoresLayout header={HeaderPrestadores}>
        <div className="d-flex">
          <div className="flex-grow-1 p-4 text-center">
            <p>Cargando información del afiliado...</p>
          </div>
        </div>
      </PrestadoresLayout>
    );
  }

  // Estado: error
  if (error) {
    return (
      <PrestadoresLayout header={HeaderPrestadores}>
        <div className="d-flex">
          <SideBar />
          <div className="flex-grow-1 p-4 text-center">
            <p className="text-danger">{error}</p>
            <button className="btn-volver mt-3" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} className="me-2" /> Volver
            </button>
          </div>
        </div>
      </PrestadoresLayout>
    );
  }

  // Estado: sin paciente (por seguridad adicional)
  if (!paciente) {
    return (
      <PrestadoresLayout header={HeaderPrestadores}>
        <div className="d-flex">
          <SideBar />
          <div className="flex-grow-1 p-4 text-center">
            <p>No se encontraron datos del paciente con DNI {dni}</p>
            <button className="btn-volver mt-3" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} className="me-2" /> Volver
            </button>
          </div>
        </div>
      </PrestadoresLayout>
    );
  }

  //Vista principal
  return (
    <PrestadoresLayout header={HeaderPrestadores}>
      <div className="d-flex">
        <SideBar />
        <div className="flex-grow-1 p-4">
          {/* Botón volver */}
          <motion.button
            className="btn-volver mb-3"
            whileHover={{ scale: 1.05, backgroundColor: "var(--verde-agua)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} className="me-2" /> Volver
          </motion.button>
          <h3>Detalle Historial Clinico</h3>

          {/* Card paciente */}
          <motion.div
            className="paciente-card p-3 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 10px rgba(251,195,194,0.6)",
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <Users size={40} color="var(--azul-petroleo)" />
              <div>
                <h4>{paciente.nombre} {paciente.apellido ? paciente.apellido : ""}</h4>
                <p>
                  Edad: <strong>{paciente.edad}</strong> | DNI:{" "}
                  <strong>{paciente.dni}</strong>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tabla ultimas consultas */}
          <motion.div
            className="tabla-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/*Checkbox para filtrar entre notas propias*/}
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="checkDefault"
                checked={filtroNotas}
                onChange={(e) => setFiltroNotas(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="checkDefault">
                Filtrar por notas propias
              </label>
            </div>
            
            <TablaHistorial
              consultas={consultas}
              filtroNotas={filtroNotas}
              mayusculas={mayusculas}
              truncarTexto={truncarTexto}
            />

          </motion.div>
        </div>
      </div>
    </PrestadoresLayout>
  );
}
