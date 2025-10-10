import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PrestadoresLayout from "../components/PrestadoresLayout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import SideBar from "../components/SideBar";
import { Users, Search, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import "../styles/SituacionesTerapeuticas.css";

export default function SituacionesTerapeuticas() {
  const [familias, setFamilias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("query")?.toLowerCase() || "";

  useEffect(() => {
    const cargarFamilias = async () => {
      try {
        const res = await fetch("/familias.json");
        if (!res.ok) throw new Error("Error al cargar familias.json");
        const data = await res.json();
        setFamilias(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarFamilias();
  }, []);

  if (loading) {
    return (
      <PrestadoresLayout header={HeaderPrestadores}>
        <div className="d-flex">
          <SideBar />
          <div className="flex-grow-1 p-4 text-center">
            <p>Cargando información...</p>
          </div>
        </div>
      </PrestadoresLayout>
    );
  }

  if (error) {
    return (
      <PrestadoresLayout header={HeaderPrestadores}>
        <div className="d-flex">
          <SideBar />
          <div className="flex-grow-1 p-4 text-center">
            <p>Error: {error}</p>
            <button className="btn-volver mt-3" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} className="me-2" /> Volver
            </button>
          </div>
        </div>
      </PrestadoresLayout>
    );
  }

  const familia = familias.find((f) =>
    f.apellido.toLowerCase().includes(query)
  );

  if (!familia) {
    return (
      <PrestadoresLayout header={HeaderPrestadores}>
        <div className="d-flex">
          <SideBar />
          <div className="flex-grow-1 p-4 text-center">
            <h5>No se encontraron resultados para “{query}”.</h5>
            <button className="btn-volver mt-3" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} className="me-2" /> Volver
            </button>
          </div>
        </div>
      </PrestadoresLayout>
    );
  }

  const totalSituaciones = familia.integrantes.reduce(
    (acc, i) => acc + i.situaciones.length,
    0
  );
  const totalTerminadas = familia.integrantes.reduce(
    (acc, i) =>
      acc + i.situaciones.filter((s) => s.estado === "Terminada").length,
    0
  );

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
          <h3>Situaciones Terapéuticas</h3>
          {/* Card familia */}
          <motion.div
            className="familia-card p-3 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 10px rgba(251, 195, 194, 0.6)",
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <Users size={40} color="var(--azul-petroleo)" />
              <div>
                <h4>Familia {familia.apellido}</h4>
                <p>
                  Integrantes: <strong>{familia.integrantes.length}</strong> | Situaciones totales:{" "}
                  <strong>{totalSituaciones}</strong> | Terminadas:{" "}
                  <strong>{totalTerminadas}</strong>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tabla integrantes */}
          <h5 className="mb-3">Integrantes</h5>
          <div className="table-responsive">
            <table className="table tabla-integrantes">
              <thead>
                <tr>
                  <th>Nombre completo</th>
                  <th>Edad</th>
                  <th>DNI</th>
                  <th>Situaciones</th>
                  <th>Terminadas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {familia.integrantes.map((p, i) => (
                  <motion.tr
                    key={p.dni}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: "var(--verde-menta)",
                    }}
                  >
                    <td>
                      <Users size={18} className="me-2" /> {p.nombre}
                    </td>
                    <td>{p.edad}</td>
                    <td>{p.dni}</td>
                    <td>{p.situaciones.length}</td>
                    <td>
                      {p.situaciones.filter((s) => s.estado === "Terminada").length}
                    </td>
                    <td>
                      <motion.button
                        className="btn-accion"
                        whileHover={{
                          scale: 1.1,
                          backgroundColor: "var(--rosa)",
                        }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          navigate(`/prestadores/situaciones/detalle/${p.dni}`)
                        }
                      >
                        <Search size={18} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PrestadoresLayout>
  );
}

