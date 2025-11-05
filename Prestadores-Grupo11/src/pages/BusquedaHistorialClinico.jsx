import React, { useState, useEffect, useCallback } from "react";
import Buscador from "../components/Buscador";
import HeaderPrestadores from "../components/HeaderPrestadores";
import PrestadoresLayout from "../components/PrestadoresLayout";
import SideBar from "../components/SideBar";
import { SidebarProvider } from "../context/SidebarContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getAllIntegrantes } from "../services/IntegrantesApi";
import { getAllAfiliados } from "../services/AfiliadosApi";

export default function BusquedaHistorialClinico() {
  //const [dni, setDni] = useState("")
  //const [resultados, setResultados] = useState([])
  // const [afiliados, setAfiliados] = useState([])
  // const [integrantes, setIntegrantes] = useState([])
  const [pacientes, setPacientes] = useState([]);
  const navigate = useNavigate();

  const handleSearchAfiliado = (valor) => {
    // const lower = valor?.toLowerCase() || "";

    // if (!lower) {
    //   setResultados([]);
    //   return;
    // }

    // const filtrados = afiliados.filter((af) => {
    //   const dniMatch = af.dni.includes(lower);
    //   const nombreMatch = af.nombre.toLowerCase().includes(lower);
    //   return dniMatch || nombreMatch;
    // });

    // console.log(filtrados)
    // setResultados(filtrados);
  };


  useEffect(() => {

    const getPacientes = async () => {
      try {
        const integrantes = await getAllIntegrantes();
        const afiliados = await getAllAfiliados();

        //Unifico los afiliados e integrantes en una unica lista.
        const pacientesUnificados = [
          ...integrantes.map(integrante => ({
            nombre: integrante.nombre,
            dni: integrante.dni,
            tipo: "Integrante"
          })),
          ...afiliados.map(afiliado => ({
            nombre: `${afiliado.nombre} ${afiliado.apellido}`,
            dni: afiliado.dni,
            tipo: "Afiliado"
          }))
        ];

        console.log(pacientesUnificados) //BORRAR
        setPacientes(pacientesUnificados);

      } catch (error) {
        console.error("Error al traerse todos los pacientes", error)
      }

    }

    getPacientes();
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
            <Buscador onSearch={handleSearchAfiliado} />  {/*basePath={`historialClinico/${dni}`}*/}
          </motion.div>

          <motion.div
            className="tabla-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: pacientes.length ? 1 : 0 }} //opacity: resultados.length ? 1 : 0
            transition={{ duration: 0.4 }}
          >

            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nombre completo</th>
                  <th>DNI</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map((paciente) => (
                  <tr key={paciente.dni}>
                    <td>{paciente.nombre}</td>
                    <td>{paciente.dni}</td>
                    <td>
                      <button
                        className="btn-accion"
                        onClick={() => navigate(`/prestadores/historialClinico/${paciente.dni}?tipo=${paciente.tipo}`)}
                      >
                        Ver historial clinico
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </motion.div>
        </div>
      </PrestadoresLayout>
    </SidebarProvider>
  );
}