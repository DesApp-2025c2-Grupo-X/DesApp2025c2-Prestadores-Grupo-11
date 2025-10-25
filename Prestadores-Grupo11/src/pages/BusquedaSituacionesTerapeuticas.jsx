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

  const handleSearch = (valor) => {
    const dato = (valor || "").toString().trim();

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (controllerRef.current) controllerRef.current.abort();

    if (!dato) {
      setResultados([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setCargando(true);
        controllerRef.current = new AbortController();
        const data = await getIntegrantes(dato, controllerRef.current.signal);

        if (!data || data.length === 0) {
          const tipo = /^\d+$/.test(dato) ? "el DNI ingresado" : "el nombre ingresado";
          toast.info(`No existe paciente con ${tipo}.`);
        }

        setResultados(data);
      } catch (err) {
        if (err.name !== "CanceledError") {
          toast.error("Error en la búsqueda. Intente nuevamente.");
        }
      } finally {
        setCargando(false);
      }
    }, 400);
  };

  const handleVerPaciente = (dni) => {
    navigate(`/prestadores/situaciones/${dni}`);
  };

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

          {/* --- Indicador de carga --- */}
          {cargando && (
            <p style={{ marginTop: "1.5rem" }}>
               Cargando datos ...
            </p>
          )}

          {/* --- Tabla de resultados --- */}
          <div className="table-responsive-xl">
             <motion.table
              className="table table-hover align-middle shadow-sm rounded text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: resultados.length ? 1 : 0 }}
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
                        <td>{paciente.situaciones_terapeuticas?.length || 0}</td>
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
              ) : (
                !cargando && (
                  <p style={{ marginTop: "1.5rem", color: "#555" }}>
                     Ingresa un nombre o DNI para buscar pacientes.
                  </p>
                )
              )}
            </motion.table>
          </div>
          {/* Contenedor de Toastify */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar
          />
        </div>
      </PrestadoresLayout>
   
  );
}
