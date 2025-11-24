import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getHistorialClinicoById } from "../services/HistorialClinicaApi";
import DetalleHistorialModal from "./DetalleHistorialModal";


export default function TablaHistorial({
  pacienteId,
  tipo
}) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);

  const [consultas, setConsultas] = useState([])
  const [filtroNotas, setFiltroNotas] = useState(false)

  // Con la informacion del paciente, busca su historial clinico
    useEffect(() => {
      if (!pacienteId) return; // Si no hay paciente cargado no hace nada
  
      const getConsultas = async () => {
        const consultas = await getHistorialClinicoById(pacienteId, tipo, filtroNotas)
        setConsultas(consultas)
      };
  
      getConsultas()
    }, [pacienteId, filtroNotas, tipo])

  const abrirModal = (consulta) => {
    setDetalleSeleccionado(consulta);
    setMostrarModal(true);
  };

  //Funcion para capitalizar la primera letra de cada palabra
  const mayusculas = (str) => str.toLowerCase().replace(/(^|\s)\p{L}/gu, (c) => c.toUpperCase());

  const truncarTexto = (texto, limite = 80) => {
    if (!texto) return "";
    return texto.length > limite ? texto.slice(0, limite) + "..." : texto;
  };

  return (
    <>
      {/*Checkbox para filtrar entre notas propias*/}
      <div className="d-flex justify-content-center mb-3">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="checkDefault"
            checked={filtroNotas}
            onChange={(e) => setFiltroNotas(e.target.checked)}
          />
          <label className="form-check-label ms-2" htmlFor="checkDefault">
            Filtrar por notas propias
          </label>
        </div>
      </div>
      <motion.div
        className="tabla-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <table className="table table-striped" style={{ marginTop: "0px" }}>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Descripcion</th>
              <th>Especialidad</th>
              <th>Medico</th>
              <th>Notas</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {consultas.length > 0 ? (
              consultas.map((consulta, idx) => (
                <motion.tr
                  key={idx}
                  className="align-middle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <td>{consulta.tipo}</td>
                  <td>
                    {new Date(consulta.fecha).toLocaleString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>{truncarTexto(consulta.descripcion)}</td>
                  <td>{mayusculas(consulta.especialidad)}</td>
                  <td>{mayusculas(consulta.medico)}</td>
                  <td>{truncarTexto(consulta.notas)}</td>

                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => abrirModal(consulta)}
                    >
                      Ver detalle
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>
                  {filtroNotas
                    ? "No hay turnos con notas tuyas."
                    : "Este paciente todavía no tuvo ninguna consulta."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Modal de detalle */}
      <DetalleHistorialModal
        mostrar={mostrarModal}
        detalle={detalleSeleccionado}
        onClose={() => setMostrarModal(false)}
      />
    </>
  );
}
