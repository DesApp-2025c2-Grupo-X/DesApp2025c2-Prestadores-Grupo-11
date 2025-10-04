import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import SideBar from "../components/SideBar";
import Buscador from "../components/Buscador";
import { motion } from "framer-motion";
import "../styles/SituacionesTerapeuticas.css";


const BusquedaSituacionesTerapeuticas = () => {
  const navigate = useNavigate();

  // 🔹 Cuando el usuario presiona Enter o busca
  const handleSearch = (valor) => {
    if (valor.trim() !== "") {
      navigate(`/prestadores/situaciones?query=${encodeURIComponent(valor)}`);
    }
  };

  return (
    <Layout header={HeaderPrestadores}>
      <motion.div className="d-flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <SideBar />
        <motion.div
          className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="mb-4 text-center">Gestión de Situaciones Terapéuticas</h3>
          <p className="text-center mb-3">
            Ingresa N° de afiliado, DNI, o apellido del afiliado:
          </p>

          <Buscador placeholder="Buscar afiliado..." onSearch={handleSearch} />
         </motion.div>
      </motion.div>
    </Layout>
  );
};

export default BusquedaSituacionesTerapeuticas;
