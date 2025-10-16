import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PrestadoresLayout from "../components/PrestadoresLayout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import SideBar from "../components/SideBar";
import { ArrowLeft, ClipboardList, Users } from "lucide-react";
import { motion } from "framer-motion";
import "../styles/SituacionesTerapeuticas.css";

export default function HistorialClinico() {
  const { dni } = useParams();
  const navigate = useNavigate();

  const [afiliado, setAfiliado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroNotas, setFiltroNotas] = useState(false);

  // Cargar datos del afiliado
  useEffect(() => {
    const cargarAfiliado = async () => {
      try {
        const res = await fetch("/afiliados.json");
        if (!res.ok) throw new Error("Error al cargar afiliados.json");
        const afiliados = await res.json();

        const encontrado = afiliados.find((af) => af.dni === dni);

        if (!encontrado) throw new Error(`No se encontró un afiliado con DNI ${dni}`);

        setAfiliado(encontrado);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarAfiliado();
  }, [dni]);

  // Estado: cargando
  if (loading) {
    return (
      <PrestadoresLayout header={HeaderPrestadores}>
        <div className="d-flex">
          <SideBar />
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

  // Estado: sin afiliado (por seguridad adicional)
  if (!afiliado) {
    return (
      <PrestadoresLayout header={HeaderPrestadores}>
        <div className="d-flex">
          <SideBar />
          <div className="flex-grow-1 p-4 text-center">
            <p>No se encontraron datos del afiliado con DNI {dni}</p>
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
              <div style={{ borderBottom: "black 1px solid" }}>
                <h4>{afiliado.nombre}</h4>
                <p>
                  Edad: <strong>{afiliado.edad}</strong> | DNI:{" "}
                  <strong>{afiliado.dni}</strong>
                </p>
              </div>
            </div>
            <div>
              <h2 style={{ marginTop: "10px" }}>Antecedentes medicos</h2>
              {afiliado.antecedentes.map((ant, idx) => (
                <p key={idx}>{ant}</p>
              ))}
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
            <label style={{marginLeft: "20%"}}>
              <input
                type="checkbox"
                checked={filtroNotas}
                onChange={(e) => setFiltroNotas(e.target.checked)}
              />
              Filtrar por notas propias
            </label>

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
                {afiliado.consultas.map((consulta, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{
                      scale: 1.02,
                    }}
                  >
                    <td>{consulta.fecha}</td>
                    <td>{consulta.descripcion}</td>
                    <td>{consulta.especialidad}</td>
                    <td>{consulta.medico}</td>
                    <td>{consulta.notas}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>
    </PrestadoresLayout>
  )
}