import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PrestadoresLayout from "../components/PrestadoresLayout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import SideBar from "../components/SideBar";
import { cambiarEstadoAutorizacion, cambiarEstadoReceta, cambiarEstadoReintegro } from "../services/Solicitudes";
import { SidebarProvider } from "../context/SidebarContext";
import { motion } from "framer-motion";
import "../styles/GestionSolicitud.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import check from "../assets/check.png";
import cross from "../assets/cross.png";
import eye from "../assets/eye.png"

export default function GestionSolicitud() {
  const { id } = useParams(); //No utilizado
  const navigate = useNavigate();

  //Obtener el tipo de solicitud desde el query parameter
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tipo = queryParams.get("tipo"); // "reintegros", "recetas", "autorizaciones"

  const { solicitud } = location.state || {}; // Me traigo la solicitud de la pagina anterior

  // if (!solicitud) {
  //   return <p>No se recibió la solicitud. Tal vez debas volver a la lista.</p>;
  // }

  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null)
  const [motivo, setMotivo] = useState("")

  // Para mostrar las fechas con mejor formato
  const formatearFecha = (fechaString) => {
    if (!fechaString) return "";

    const fecha = new Date(fechaString);

    // Valida que no sea una fecha invalida
    if (isNaN(fecha)) return "";

    return fecha.toLocaleString("es-AR", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

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

      console.log("Body que se envía:", body); //Log de prueba

      switch (tipo) {
        case "reintegros":
          await cambiarEstadoReintegro(solicitud.id, body)
          break
        case "autorizaciones":
          await cambiarEstadoAutorizacion(solicitud.id, body)
          break
        case "recetas":
          await cambiarEstadoReceta(solicitud.id, body)
          break
        default:
          console.warn("Tipo desconocido:", tipo);
          toast.error("Tipo de solicitud no reconocido");
          return;
      }

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
              {tipo === "autorizaciones" && (
                <>
                  <span>
                    <strong>Fecha prevista</strong>
                    <p>{formatearFecha(solicitud.fecha_prevista)}</p>
                  </span>
                  <span>
                    <strong>Integrante</strong>
                    <p>{solicitud.integranteId}</p>
                  </span>
                  <span>
                    <strong>Médico</strong>
                    <p>{solicitud.medico}</p>
                  </span>
                  <span>
                    <strong>Especialidad</strong>
                    <p>{solicitud.especialidad}</p>
                  </span>
                  <span>
                    <strong>Lugar donde se realizará la prestación</strong>
                    <p>{solicitud.lugar}</p>
                  </span>
                  <span>
                    <strong>Días de internación</strong>
                    <p>{solicitud.dias_internacion}</p>
                  </span>
                  <span>
                    <strong>Observaciones</strong>
                    <p>{solicitud.observaciones}</p>
                  </span>
                </>
              )}

              {tipo === "recetas" && (
                <>
                  <span>
                    <strong>Integrante</strong>
                    <p>{solicitud.integrante.nombre}</p>
                  </span>
                  <span>
                    <strong>Medicamento</strong>
                    <p>{solicitud.medicamento}</p>
                  </span>
                  <span>
                    <strong>Cantidad</strong>
                    <p>{solicitud.cantidad}</p>
                  </span>
                  <span>
                    <strong>Presentacion</strong>
                    <p>{solicitud.presentacion}</p>
                  </span>
                  <span>
                    <strong>Observaciones</strong>
                    <p>{solicitud.observaciones}</p>
                  </span>
                </>
              )}

              {tipo === "reintegros" && (
                <>
                  <span>
                    <strong>Fecha de la prestacion</strong>
                    <p>{formatearFecha(solicitud.fecha_prestacion)}</p>
                  </span>
                  <span>
                    <strong>Integrante</strong>
                    <p>{solicitud.integrante.nombre}</p>
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
                    <strong>Lugar donde fue atendido</strong>
                    <p>{solicitud.lugar}</p>
                  </span>
                  <span>
                    <strong>Datos de la factura</strong>
                    <ul>
                      <li>{formatearFecha(solicitud.factura_fecha)}</li>
                      <li>{solicitud.factura_cuit}</li>
                      <li>{solicitud.factura_valor}</li>
                      <li>{solicitud.factura_persona}</li>
                    </ul>
                  </span>
                  <span>
                    <strong>Forma de pago del reintegro</strong>
                    <p>{solicitud.forma_pago}</p>
                  </span>
                  <span>
                    <strong>Observaciones</strong>
                    <p>{solicitud.comprobante}</p>
                  </span>
                </>
              )}
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
