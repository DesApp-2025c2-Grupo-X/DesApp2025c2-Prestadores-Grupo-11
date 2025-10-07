import React, { useState, useEffect } from "react";
import Buscador from "../components/Buscador";
import HeaderPrestadores from "../components/HeaderPrestadores";
import PrestadoresLayout from "../components/PrestadoresLayout";
import SideBar from "../components/SideBar";
import { SidebarProvider } from "../context/SidebarContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/SituacionesTerapeuticas.css";

export default function BusquedaSituacionesTerapeuticas() {
  const [familias, setFamilias] = useState([]);
  const [resultados, setResultados] = useState([]);
  const navigate = useNavigate();

  // --- Cargar datos desde JSON ---
  useEffect(() => {
    const fetchFamilias = async () => {
      try {
        const res = await fetch("/familias.json");
        if (!res.ok) throw new Error("Error al cargar familias.json");
        const data = await res.json();
        setFamilias(data);
        console.log("Familias cargadas:", data);
      } catch (err) {
        console.error("Error cargando familias:", err);
      }
    };

    fetchFamilias();
  }, []);

  // --- Búsqueda en vivo ---
  const handleSearch = (valor) => {
    const lower = valor?.toLowerCase() || "";

    if (!lower) {
      setResultados([]);
      return;
    }

    const filtrados = familias.filter((f) => {
      const apellidoMatch = f.apellido?.toLowerCase().includes(lower);
      const integranteMatch = f.integrantes?.some(
        (i) =>
          i.nombre?.toLowerCase().includes(lower) ||
          i.dni?.toString().includes(lower)
      );
      return apellidoMatch || integranteMatch;
    });

    setResultados(filtrados);
  };

  // --- Ir al detalle de familia ---
  const handleVerFamilia = (apellido) => {
    // Redirige al componente SituacionesTerapeuticas con el query correspondiente
    navigate(`/prestadores/situaciones?query=${encodeURIComponent(apellido)}`);
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
                    <th>Familia</th>
                    <th>Cantidad de integrantes</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.map((familia) => (
                    <tr key={familia.apellido}>
                      <td>{familia.apellido}</td>
                      <td>{familia.integrantes?.length}</td>
                      <td>
                        <button
                          className="btn-accion"
                          onClick={() => navigate(`/prestadores/situaciones?query=${encodeURIComponent(familia.apellido)}`)}
                        >
                          Ver grupo familiar
                        </button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ marginTop: "1.5rem", color: "#555" }}>
                🔎 Ingresa un apellido o DNI para buscar afiliados.
              </p>
            )}
          </motion.div>
        </div>
      </PrestadoresLayout>
    </SidebarProvider>
  );
}
