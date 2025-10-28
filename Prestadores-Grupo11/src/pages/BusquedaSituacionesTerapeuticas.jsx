import React, { useState, useEffect, useRef } from "react";
import Buscador from "../components/Buscador";
import HeaderPrestadores from "../components/HeaderPrestadores";
import PrestadoresLayout from "../components/PrestadoresLayout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/SituacionesTerapeuticas.css";
import { getIntegrantes } from "../services/IntegrantesApi";



export default function BusquedaSituacionesTerapeuticas() {
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const debounceRef = useRef(null);
  const controllerRef = useRef(null);
  const navigate = useNavigate();

  //  Función para ir al detalle
  const handleVerPaciente = (dni) => {
    navigate(`/prestadores/situaciones/${encodeURIComponent(dni)}`);
  };

  //  Búsqueda con debounce y cancelación
  const handleSearch = (valor) => {
    const dato = (valor || "").toString().trim();

    // Limpiar debounce y request anteriores
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (controllerRef.current) controllerRef.current.abort();

    if (!dato) {
      setResultados([]);
      setCargando(false);
      return;
    }

    //  debounce (500 ms)
    debounceRef.current = setTimeout(async () => {
      controllerRef.current = new AbortController();
      setCargando(true);

      try {
        const data = await getIntegrantes(dato, controllerRef.current.signal);

        if (!data || data.length === 0) {
          const tipo = /^\d+$/.test(dato)
            ? "el DNI ingresado"
            : "el nombre ingresado";
          toast.info(`No existe paciente con ${tipo}.`, {
            toastId: "sinResultados",
          });
        }

        setResultados(data);
      } catch (err) {
        if (err.name === "CanceledError") return; // Ignorar si fue cancelada
        console.error(err);
        toast.error("Error en la búsqueda. Intente nuevamente.", {
          toastId: "errorBusqueda",
        });
      } finally {
        // Solo desactivar cargando si la request sigue activa
        if (!controllerRef.current.signal.aborted) {
          setCargando(false);
        }
      }
    }, 500);
  };

  // Limpiar refs al desmontar
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, []);

  return (
    <PrestadoresLayout header={<HeaderPrestadores />}>
      <div className="contenido-principal main-with-sidebar">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3>Búsqueda de Situaciones Terapéuticas</h3>
          <Buscador onSearch={handleSearch} />
        </motion.div>

        {/* Indicador de carga */}
        {cargando && (
          <p style={{ marginTop: "1.5rem", color: "#555" }}>
             Cargando datos de pacientes...
          </p>
        )}

        {/* Tabla o mensaje */}
        <div className="table-responsive-xl">
          <motion.table
            className="table table-hover align-middle shadow-sm rounded text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: resultados.length ? 1 : 0.5 }}
            transition={{ duration: 0.4 }}
          >
            {resultados.length > 0 ? (
              <>
                <thead className="table-secondary">
                  <tr>
                    <th>Nombre</th>
                    <th>DNI</th>
                    <th>Edad</th>
                    <th>Situaciones</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.map((paciente) => (
                    <tr key={paciente.dni}>
                      <td>{paciente.nombre}</td>
                      <td>{paciente.dni}</td>
                      <td>{paciente.edad}</td>
                      <td>
                        {paciente.situaciones_terapeuticas?.length || 0}
                      </td>
                      <td>
                        <button
                          className="btn-accion"
                          onClick={() => handleVerPaciente(paciente.dni)}
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            ) : null}
          </motion.table>
        </div>

        {/* Contenedor de Toastify */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </PrestadoresLayout>
  );
}