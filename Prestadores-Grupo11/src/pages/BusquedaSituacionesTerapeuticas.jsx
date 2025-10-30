import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Buscador from "../components/Buscador";
import HeaderPrestadores from "../components/HeaderPrestadores";
import PrestadoresLayout from "../components/PrestadoresLayout";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/SituacionesTerapeuticas.css";
import { getIntegrantes } from "../services/IntegrantesApi";

export default function BusquedaSituacionesTerapeuticas() {
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const controllerRef = useRef(null);
  const navigate = useNavigate();

  // Leer prestador del localStorage
  const storedUser = JSON.parse(localStorage.getItem("miapp_user"));
  const prestadorId = storedUser?.id;

  const handleSearch = useCallback(
    async (valor) => {
      const dato = (valor || "").trim();

      if (controllerRef.current) controllerRef.current.abort();

      if (!dato) {
        setResultados([]);
        setCargando(false);
        return;
      }

      controllerRef.current = new AbortController();
      setCargando(true);

      try {
        const data = await getIntegrantes(dato, controllerRef.current.signal);

        if (!data || data.length === 0) {
          const tipo = /^\d+$/.test(dato)
            ? "el DNI ingresado"
            : "el apellido o nombre ingresado";
          toast.info(`No se encontraron resultados para ${tipo}.`, {
            toastId: "sinResultados",
          });
          setResultados([]);
        } else {
          setResultados(data);
        }
      } catch (err) {
        if (err.name === "CanceledError") return;
        console.error("Error en la búsqueda:", err);
        toast.error("Error en la búsqueda. Intente nuevamente.", {
          toastId: "errorBusqueda",
        });
      } finally {
        if (!controllerRef.current.signal.aborted) {
          setCargando(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, []);

  // Redirige a Situaciones usando afiliadoId
  const handleVerPaciente = (afiliadoId) => {
    if (!afiliadoId) {
      toast.warning("No se pudo obtener el ID del afiliado.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    navigate(`/prestadores/situaciones/${afiliadoId}`);
  };

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

        {cargando && (
          <p style={{ marginTop: "1.5rem", color: "#555" }}>
            Cargando datos de pacientes...
          </p>
        )}

        {resultados.length > 0 && (
          <div className="table-responsive-xl">
            <motion.table
              className="table table-hover align-middle shadow-sm rounded text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
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
                    <td>{paciente.situaciones?.length || 0}</td>
                    <td>
                      <button
                        className="btn-accion"
                        onClick={() =>
                          handleVerPaciente(paciente.afiliadoId)
                        }
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </PrestadoresLayout>
  );
}

