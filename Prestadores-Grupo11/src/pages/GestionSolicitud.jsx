import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PrestadoresLayout from "../components/PrestadoresLayout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import SideBar from "../components/SideBar";
import { modificarEstado } from "../services/Solicitudes";
import { SidebarProvider } from "../context/SidebarContext";
import { motion } from "framer-motion";
import "../styles/GestionSolicitud.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import check from "../assets/check.png";
import cross from "../assets/cross.png";
import eye from "../assets/eye.png"

export default function GestionSolicitud() {
  const { id } = useParams();
  const navigate = useNavigate();

  //Obtener el tipo de solicitud desde el query parameter
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tipo = queryParams.get("tipo"); // "reintegro", "receta", "autorizacion"

  const { solicitud } = location.state || {}; // Aquí recibís la solicitud

  // if (!solicitud) {
  //   return <p>No se recibió la solicitud. Tal vez debas volver a la lista.</p>;
  // }

  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null)
  const [motivo, setMotivo] = useState("")

  const revisarMotivoYActualizarEstado = async () => {
    const usuario = JSON.parse(localStorage.getItem("miapp_user"));

    if (!motivo && (estadoSeleccionado === "rechazado" || estadoSeleccionado === "observado")) {
      toast.error("No se cargó el motivo");
      return;
    }

    if (!usuario || !usuario.id) {
      toast.error("No se encontró el usuario en el localStorage");
      return;
    }

    try {
      const body =
        estadoSeleccionado === "rechazado" || estadoSeleccionado === "observado"
          ? { nuevoEstado: estadoSeleccionado, motivo, usuarioId: usuario.id }
          : { nuevoEstado: "aprobado", usuarioId: usuario.id };

      console.log("Body que se envía:", body); // 🔍 Comprobá esto en consola

      await modificarEstado(solicitud.id, body);

      toast.success("Estado actualizado correctamente");
      navigate(-1);
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      toast.error("Hubo un error al actualizar el estado");
    }
  };

  if (!solicitud) return <p>Cargando o solicitud no encontrada...</p>;

  return (
    <SidebarProvider>
      <PrestadoresLayout header={<HeaderPrestadores />}>
        <SideBar />
        <div className="contenido-principal main-with-sidebar">
          <h1>Datos de la solicitud</h1>
          <div className="contenedorSolicitud">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="contenedorInfo"
            >
              <span>
                <strong>Fecha prevista</strong>
                <p>{solicitud.fecha_prevista}</p>
              </span>
              <span>
                <strong>Integrante</strong>
                <p>{solicitud.integranteId}</p>
              </span>
              <span>
                <strong>Medico</strong>
                <p>{solicitud.medico}</p>
              </span>
              <span>
                <strong>Especialidad</strong>
                <p>{solicitud.especialidad}</p>
              </span>
              <span>
                <strong>Lugar donde se realizara la prestacion</strong>
                <p>{solicitud.lugar}</p>
              </span>
              <span>
                <strong>Dias de internacion</strong>
                <p>{solicitud.dias_internacion}</p>
              </span>
              <span>
                <strong>Observaciones</strong>
                <p>{solicitud.observaciones}</p>
              </span>
            </motion.div>
            <div style={{ textAlign: "center" }}>
              <img
                src={check}
                onClick={() => setEstadoSeleccionado("aprobado")}
                className="img-icon"
                style={{
                  border: estadoSeleccionado === "aprobado" ? "5px solid #b6e4db" : "none",
                  borderRadius: "50%",
                }}
              />
              <img
                src={cross}
                onClick={() => setEstadoSeleccionado("rechazado")}
                className="img-icon"
                style={{
                  border: estadoSeleccionado === "rechazado" ? "5px solid #b6e4db" : "none",
                  borderRadius: "50%",
                }}
              />
              <img
                src={eye}
                onClick={() => setEstadoSeleccionado("observado")}
                className="img-icon"
                style={{
                  border: estadoSeleccionado === "observado" ? "5px solid #b6e4db" : "none",
                  borderRadius: "50%",
                }}
              />
            </div>
          </div>
          {/*Renderizado del input y boton de cambio de estado*/}
          {estadoSeleccionado && (
            <div style={{ marginTop: "30px" }}>
              {(estadoSeleccionado === "rechazado" || estadoSeleccionado === "observado") && (
                <>
                  <h1>Motivo de {estadoSeleccionado === "rechazado" ? "rechazo" : "observación"}:</h1>
                  <textarea
                    style={{ width: "80%", height: "150px", fontSize: "18px", marginBottom: "15px" }}
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                  />
                </>
              )}
              <br />
              <button className="btn-accion" onClick={() => revisarMotivoYActualizarEstado()}>Actualizar estado</button>
            </div>
          )}
        </div>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </PrestadoresLayout>
    </SidebarProvider>
  );
}
