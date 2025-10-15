import React, { useState, useEffect } from "react";
import Buscador from "../components/Buscador";
import HeaderPrestadores from "../components/HeaderPrestadores";
import PrestadoresLayout from "../components/PrestadoresLayout";
import SideBar from "../components/SideBar";
import { SidebarProvider } from "../context/SidebarContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/BusquedaHistorialClinico.css";

export default function BusquedaHistorialClinico() {
    const [dni, setDni] = useState("")
    const [afiliados, setAfiliados] = useState([])
    const [resultados, setResultados] = useState([])
    const navigate = useNavigate();

    const handleSearchAfiliado = (valor) => {
        const lower = valor?.toLowerCase() || "";

        if (!lower) {
            setResultados([]);
            return;
        }

        const filtrados = afiliados.filter((af) => {
            const dniMatch = af.dni.includes(lower)
            const nombreMatch = af.nombre.toLowerCase().includes(lower)
            return dniMatch || nombreMatch;
        });

        setResultados(filtrados);
    };

    //Se traen los datos de los afiliados, desde afiliados.json
    useEffect(() => {
        const fetchAfiliados = async () => {
            try {
                const res = await fetch("/afiliados.json");
                if (!res.ok) throw new Error("Error al cargar afiliados.json");
                const data = await res.json();
                setAfiliados(data);
                console.log("Afiliados cargadas:", data);
            } catch (err) {
                console.error("Error cargando afiliados:", err);
            }
        };

        fetchAfiliados();
    }, [])

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
                        <h3>Búsqueda de Historial clinico</h3>
                        <Buscador onSearch={handleSearchAfiliado} basePath={`historialClinico/${dni}`} />
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
                                        <th>Nombre completo</th>
                                        <th>DNI</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultados.map((afiliado) => (
                                        <tr key={afiliado.dni}>
                                            <td>{afiliado.nombre}</td>
                                            <td>{afiliado.dni}</td>
                                            <td>
                                                <button
                                                    className="btn-accion"
                                                    onClick={() => navigate(`/prestadores/historialClinico/${afiliado.dni}`)}
                                                >
                                                    Ver historial clinico
                                                </button>

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p style={{ marginTop: "1.5rem", color: "#555" }}>
                                🔎 Ingresa un nombre o DNI para buscar afiliados.
                            </p>
                        )}
                    </motion.div>
                </div>
            </PrestadoresLayout>
        </SidebarProvider>
    );
}