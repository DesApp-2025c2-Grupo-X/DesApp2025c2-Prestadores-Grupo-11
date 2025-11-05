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
import { getNombrePrestadorById } from "../services/PrestadoresApi";
import { getTurnosByPacienteId } from "../services/TurnosApi";
import "../styles/SituacionesTerapeuticas.css";

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
    //Agregarle despues la busqueda de los afiliados
    const cargarPaciente = async () => {
      try {
        const integrantes = await getAllIntegrantes();
        const afiliados = await getAllAfiliados();
        const encontrado = integrantes.find((integrante) => integrante.dni === dni) || afiliados.find(afiliado => afiliado.dni === dni)

        if (!encontrado) {
          console.log(`No se encontro el integrante DNI ${dni}`)
        }

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
        }

        const ahora = new Date();
        const turnosFinalizados = turnosEncontrados.filter(turno => {
          const fechaTurno = new Date(turno.date);
          return fechaTurno.getTime() < ahora.getTime();
        });

        //Transformo el nombre de los atributos de situaciones y turnos, para que
        //sea mas facil mostrarlos en la tabla.
        const unificados = [
          ...situacionesDeBaja.map(s => ({
            fecha: s.fecha_final,
            descripcion: s.observaciones,
            especialidad: s.especialidad,
            medico: s.prestador.username,
            notas: ""
          })),
          ...turnosFinalizados.map(t => ({
            fecha: t.date,
            descripcion: t.descripción,
            especialidad: t.prestador?.especialidad || "",
            medico: t.prestador?.username || "",
            notas: t.notes || ""
          }))
        ];

        const ordenadosPorFecha = unificados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        setConsultas(ordenadosPorFecha);

        //Todo lo que esta aca para abajo, hasta el catch, se puede solucionar si en el backend
        //Al traerse la situacion, tambien muestra el username del medico.
        // const idsUnicos = [...new Set(situacionesEncontradas.map(s => s.prestadorId))];

        // const respuestas = await Promise.all(
        //   idsUnicos.map(async id => {
        //     try {
        //       const nombre = await getNombrePrestadorById(id);
        //       return { id, nombre };
        //     } catch (error) {
        //       console.error(`Error al traer el prestador ${id}`, error);
        //       return { id, nombre: "Desconocido" };
        //     }
        //   })
        // );

        // const diccionario = respuestas.reduce((acc, { id, nombre }) => {
        //   acc[id] = nombre;
        //   return acc;
        // }, {});

        // setNombresPrestadores(diccionario);

      } catch (error) {
        console.error("Hubo un error al buscar las consultas", error)
      }
    };

    getConsultas()
  }, [paciente, filtroNotas, tipo])

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
                <h4>{paciente.nombre}</h4>
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
            <h3>Ultimas consultas</h3>

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

            <table className="table table-striped" style={{ marginTop: "0px" }}>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Descripcion</th>
                  <th>Especialidad</th>
                  <th>Medico</th>
                  <th>Notas</th>
                </tr>
              </thead>
              <tbody>
                {consultas.length > 0 ? (
                  consultas.map((consulta, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <td>
                        {new Date(consulta.fecha).toLocaleString("es-AR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>{consulta.descripcion}</td>
                      <td>{mayusculas(consulta.especialidad)}</td>
                      {/* <td>{nombresPrestadores[consulta.prestadorId] || "Cargando..."}</td> */}
                      <td>{mayusculas(consulta.medico)}</td>
                      <td>{consulta.notas}</td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>Este paciente todavia no tuvo ninguna consulta.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>
    </PrestadoresLayout>
  );
}
