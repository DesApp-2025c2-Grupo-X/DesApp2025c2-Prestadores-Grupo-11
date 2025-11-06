import React, { useState, useCallback } from "react";
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
  const [buscado, setBuscado] = useState(false);
  const navigate = useNavigate();

  // Obtener prestador del localStorage
  const storedUser = JSON.parse(localStorage.getItem("miapp_user"));
  const prestadorId = storedUser?.id;

  // --- FUNCIÓN PRINCIPAL DE BÚSQUEDA ---
  const handleSearch = useCallback(
    async (valor) => {
      const dato = (valor || "").trim();

      if (!dato) {
        setResultados([]);
        setCargando(false);
        return;
      }

      if (!prestadorId) {
        toast.error("No se encontró el ID del prestador en sesión.", {
          toastId: "sinPrestador",
        });
        return;
      }

      setCargando(true);

      try {
        const data = await getIntegrantes(prestadorId, dato);
        console.log("Resultado bruto del backend:", data);

        if (!data || (Array.isArray(data) && data.length === 0)) {
          const tipo = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(dato)
            ? "el nombre ingresado"
            : "el número de afiliado ingresado";
          toast.info(`No se encontraron resultados para ${tipo}.`, {
            toastId: "sinResultados",
          });
          setResultados([]);
          return;
        }

        // Normalizar estructura de pacientes
        let pacientes = [];

        if (Array.isArray(data)) {
          // Si ya es un array, usarlo directamente
          pacientes = data;
        } else if (data.integrantes && Array.isArray(data.integrantes)) {
          // Si hay afiliado con integrantes, incluir ambos
          pacientes = [data, ...data.integrantes];
        } else {
          // Caso genérico
          pacientes = [data];
        }

        console.log(" Datos normalizados para la tabla:", pacientes);
        setResultados(pacientes);
      } catch (err) {
        console.error(" Error en la búsqueda:", err);
        toast.error("Error al buscar afiliado. Intente nuevamente.", {
          toastId: "errorBusqueda",
        });
        setResultados([]);
      } finally {
        setCargando(false);
      }
    },
    [prestadorId]
  );

  // --- REDIRECCIÓN SEGURA ---
  const handleVerPaciente = (afiliadoId) => {
    if (!afiliadoId) {
      toast.warning("No se pudo obtener el ID del afiliado.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    console.log(afiliadoId)
    console.log("Redirigiendo a /prestadores/situaciones/" + afiliadoId);
    navigate(`/prestadores/situaciones/${afiliadoId}`);
  };

  // --- Renderizado ---
  return (
    <PrestadoresLayout header={<HeaderPrestadores />}>
      <div className="contenido-principal main-with-sidebar">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h3>Búsqueda de Situaciones Terapéuticas</h3>
          <Buscador onSearch={handleSearch} />
        </motion.div>

        {cargando && <p style={{ marginTop: "1.5rem", color: "#555" }}>Cargando datos de pacientes...</p>}

        {resultados.length > 0 && (
          <div className="table-responsive-xl mt-4">
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
                {resultados.map((paciente) => {
                  const id = paciente.id || paciente.afiliadoId;
                  return (
                    <tr key={paciente.dni}>
                      <td>
                        {paciente.nombre || paciente.apellido
                          ? `${paciente.nombre || ""} ${paciente.apellido || ""}`.trim()
                          : "Sin nombre"}
                      </td>
                      <td>{paciente.dni || "-"}</td>
                      <td>{paciente.edad || "-"}</td>
                      <td>{paciente.situaciones?.length || 0}</td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleVerPaciente(id)}
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </motion.table>
          </div>
        )}

        {!cargando && resultados.length === 0 && (
          <p className="text-muted mt-4">No hay resultados para mostrar.</p>
        )}

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </PrestadoresLayout>
  );
}
