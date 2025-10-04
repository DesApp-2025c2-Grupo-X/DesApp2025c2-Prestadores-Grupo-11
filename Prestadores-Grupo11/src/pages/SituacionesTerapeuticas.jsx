import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import SideBar from "../components/SideBar";
import { Users, Search, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import "../styles/SituacionesTerapeuticas.css";

const SituacionesTerapeuticas = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("query");
  const [familia, setFamilia] = useState(null);

  useEffect(() => {
    // Cargar mock JSON desde public
    fetch("/data/familias.json")
      .then((res) => res.json())
      .then((data) => {
        const resultado = data.find((f) =>
          f.apellido.toLowerCase().includes(query.toLowerCase())
        );
        setFamilia(resultado);
      });
  }, [query]);

  if (!familia) {
    return (
      <Layout header={HeaderPrestadores}>
        <div className="d-flex">
          <SideBar />
          <div className="flex-grow-1 p-4 text-center">
            <p>No se encontraron resultados para “{query}”</p>
            <button className="btn-volver" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} className="me-2" /> Volver
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const totalSituaciones = familia.integrantes.reduce(
    (acc, i) => acc + i.situaciones,
    0
  );
  const totalTerminadas = familia.integrantes.reduce(
    (acc, i) => acc + i.terminadas,
    0
  );

  return (
    <Layout header={HeaderPrestadores}>
      <motion.div
        className="d-flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <SideBar />

        <motion.div
          className="flex-grow-1 p-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <button className="btn-volver mb-3" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} className="me-2" /> Volver
          </button>

          <motion.div
            className="familia-card p-3 mb-4"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="d-flex align-items-center gap-3">
              <Users size={40} />
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

          <h5 className="mb-3">Integrantes del grupo familiar</h5>
          <motion.table
            className="table tabla-integrantes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
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
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <td>
                    <Users size={18} className="me-2" />
                    {p.nombre}
                  </td>
                  <td>{p.edad}</td>
                  <td>{p.dni}</td>
                  <td>{p.situaciones}</td>
                  <td>{p.terminadas}</td>
                  <td>
                    <button
                      className="btn-accion"
                      onClick={() =>
                        navigate(`/prestadores/detalle-situaciones/${p.dni}`)
                      }
                    >
                      <Search size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default SituacionesTerapeuticas;
