import React, { useState, useEffect } from "react";
import Buscador from "../components/Buscador";
import HeaderPrestadores from "../components/HeaderPrestadores";
import PrestadoresLayout from "../components/PrestadoresLayout";
import SideBar from "../components/SideBar";
import { SidebarProvider } from "../context/SidebarContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/SituacionesTerapeuticas.css";

export default function BusquedaSituacionesTerapeuticas() {
  const [pacientes, setPacientes] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  // --- Cargar datos desde situacionesterapeuticas.json ---
  useEffect(() => {
    const fetchPacientes = async () => {
      setCargando(true);
      try {
        const res = await fetch("/situacionesterapeuticas.json");
        if (!res.ok) throw new Error("Error al cargar situacionesterapeuticas.json");
        const data = await res.json();
        setPacientes(data);
        console.log("Situaciones terapéuticas cargadas:", data);
      } catch (err) {
        console.error("Error cargando situaciones terapéuticas:", err);
        toast.error("⚠️ Error al cargar los datos de situaciones terapéuticas.");
      } finally {
        setCargando(false);
      }
    };

    fetchPacientes();
  }, []);

  // --- Búsqueda ---
  const handleSearch = (valor) => {
    const lower = valor?.toLowerCase().trim() || "";

    if (!lower) {
      setResultados([]);
      return;
    }

    const filtrados = pacientes.filter((p) => {
      const nombreMatch = p.nombre?.toLowerCase().includes(lower);
      const dniMatch = p.dni?.toString().includes(lower);
      return nombreMatch || dniMatch;
    });

    // Solo mostrar un toast si no hay resultados
    if (filtrados.length === 0) {
      const tipoBusqueda = /^\d+$/.test(lower)
        ? "el DNI ingresado"
        : "el nombre ingresado";
      toast.info(`🔍 No existe paciente con ${tipoBusqueda}.`, {
        toastId: "sinResultados", 
      });
    }

    setResultados(filtrados);
  };

  // --- Ver detalle ---
  const handleVerPaciente = (dni) => {
  navigate(`/prestadores/situaciones/${encodeURIComponent(dni)}`);
};


  return (
    <SidebarProvider>
      <PrestadoresLayout header={<HeaderPrestadores />}>
        <SideBar />
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
            <p style={{ marginTop: "1.5rem", color: "#555" }}>
              ⏳ Cargando datos de pacientes...
            </p>
          )}

          {/* --- Tabla de resultados --- */}
          <motion.div
            className="tabla-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: resultados.length ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            {resultados.length > 0 ? (
              <table className="table table-striped">
                <thead>
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
              </table>
            ) : (
              !cargando && (
                <p style={{ marginTop: "1.5rem", color: "#555" }}>
                  🔎 Ingresa un nombre o DNI para buscar pacientes.
                </p>
              )
            )}
          </motion.div>

          {/* Contenedor de Toastify */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar
          />
        </div>
      </PrestadoresLayout>
    </SidebarProvider>
  );
}
