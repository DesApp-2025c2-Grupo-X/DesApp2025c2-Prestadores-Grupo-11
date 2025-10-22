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
  const [afiliados, setAfiliados] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  // --- Cargar datos desde JSON ---
  useEffect(() => {
    const fetchAfiliados = async () => {
      setCargando(true);
      try {
        const res = await fetch("/afiliados.json");
        if (!res.ok) throw new Error("Error al cargar afiliados.json");
        const data = await res.json();
        setAfiliados(data);
        console.log("Afiliados cargados:", data);
      } catch (err) {
        console.error("Error cargando afiliados:", err);
        toast.error("⚠️ Error al cargar los datos de afiliados.");
      } finally {
        setCargando(false);
      }
    };

    fetchAfiliados();
  }, []);

  // --- Búsqueda ---
  const handleSearch = (valor) => {
    const lower = valor?.toLowerCase().trim() || "";

    if (!lower) {
      setResultados([]);
      return;
    }

    const filtrados = afiliados.filter((a) => {
      const nombreMatch = a.nombre?.toLowerCase().includes(lower);
      const dniMatch = a.dni?.toString().includes(lower);
      return nombreMatch || dniMatch;
    });

    if (filtrados.length === 0) {
      let tipoBusqueda = "el valor ingresado";
      if (/^\d+$/.test(lower)) tipoBusqueda = "el DNI ingresado";
      else if (lower.length > 0) tipoBusqueda = "el nombre ingresado";
      toast.info(`🔍 No existe afiliado con ${tipoBusqueda}.`);
    }

    setResultados(filtrados);
  };

  // --- Ver detalle ---
  const handleVerAfiliado = (dni) => {
    navigate(`/prestadores/situaciones?query=${encodeURIComponent(dni)}`);
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
              ⏳ Cargando datos de afiliados...
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
                    <th>Consultas</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.map((afiliado) => (
                    <tr key={afiliado.dni}>
                      <td>{afiliado.nombre}</td>
                      <td>{afiliado.dni}</td>
                      <td>{afiliado.edad}</td>
                      <td>{afiliado.consultas?.length || 0}</td>
                      <td>
                        <button
                          className="btn-accion"
                          onClick={() => handleVerAfiliado(afiliado.dni)}
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
                  🔎 Ingresa un nombre o DNI para buscar afiliados.
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
