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

  // Obtener prestador desde localStorage
  const storedUser = JSON.parse(localStorage.getItem("miapp_user"));
  const prestadorId = storedUser?.id;

  // --- Procesar resultados del backend ---
  const procesarResultados = (data) => {
    console.log("procesarResultados input:", data);
    let rows = [];

    // Afiliado principal
    rows.push({
      id: data.id,
      nombre: `${data.nombre} ${data.apellido || ""}`.trim(),
      dni: data.dni || "-",
      edad: data.edad || "-",
      situaciones: Array.isArray(data.situaciones) ? data.situaciones : [],
      tipo: "afiliado",
    });

    // Integrantes
    if (Array.isArray(data.integrantes) && data.integrantes.length > 0) {
      data.integrantes.forEach((inte) => {
        rows.push({
          id: inte.id,
          nombre: inte.nombre || "Sin nombre",
          dni: inte.dni || "-",
          edad: inte.edad || "-",
          situaciones: Array.isArray(inte.situaciones) ? inte.situaciones : [],
          tipo: "integrante",
        });
      });
    }

    console.log("procesarResultados output:", rows);
    return rows;
  };

  // --- Función principal de búsqueda ---
  const handleSearch = useCallback(
    async (valor) => {
      const dato = (valor || "").trim();
      console.log("Iniciando búsqueda con:", { valor: dato, prestadorId, storedUser });
      setBuscado(true);

      if (!dato) {
        setResultados([]);
        toast.info("Ingrese un nombre, apellido o número de afiliado.");
        return;
      }

      if (!storedUser || !prestadorId) {
        toast.error("Sesión no válida. Por favor inicie sesión nuevamente.");
        console.warn("storedUser o prestadorId no encontrados. Evitando redirección automática.");
        return;
      }

      setCargando(true);

      try {
        const data = await getIntegrantes(prestadorId, dato);
        console.log("Respuesta del backend:", data);

        if (!data || Object.keys(data).length === 0) {
          toast.info("No se encontró ningún afiliado con los datos ingresados.");
          setResultados([]);
          return;
        }

        const rows = procesarResultados(data);
        setResultados(rows);

      } catch (err) {
        console.error("Error completo:", err);
        toast.error(err.message || "Error al buscar afiliado. Intente nuevamente.");
        setResultados([]);
      } finally {
        setCargando(false);
      }
    },
    [prestadorId, storedUser]
  );

  // --- Redirección para ver paciente ---
  const handleVerPaciente = (id, tipo) => {
    if (!id) {
      toast.warning("No se pudo obtener el ID.", { position: "top-right", autoClose: 2000 });
      return;
    }

    if (!prestadorId) {
      toast.warning("No se encontró el ID del prestador en sesión.", { position: "top-right", autoClose: 2000 });
      return;
    }

    const ruta =
      tipo === "afiliado"
        ? `/prestadores/${prestadorId}/afiliado/${id}/situaciones`
        : `/prestadores/${prestadorId}/integrante/${id}/situaciones`;

    console.log("Redirigiendo a", ruta);
    navigate(ruta);
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

        {buscado && (
          <div className="table-responsive-xl mt-4">
            {console.log("Render resultados:", resultados)}
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
                {resultados.length > 0 ? (
                  resultados.map((paciente) => {
                    const sinSituaciones = !paciente.situaciones || paciente.situaciones.length === 0;
                    return (
                      <tr key={`${paciente.tipo}-${paciente.id}`}>
                        <td>{paciente.nombre}</td>
                        <td>{paciente.dni}</td>
                        <td>{paciente.edad}</td>
                        <td>
                          {sinSituaciones ? (
                            <span className="text-muted fst-italic">
                              Sin situaciones asociadas a este prestador
                            </span>
                          ) : (
                            <span>{paciente.situaciones.length}</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleVerPaciente(paciente.id, paciente.tipo)}
                            disabled={sinSituaciones}
                          >
                            Ver detalle
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-muted fst-italic">
                      No se encontraron resultados para la búsqueda realizada.
                    </td>
                  </tr>
                )}
              </tbody>
            </motion.table>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </PrestadoresLayout>
  );
}
