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
import { ArrowLeft } from "lucide-react";
import { CheckCircle, XCircle, Eye } from "lucide-react";
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

  // Esta funcion es usada para renderizar las cards para el detalle de cada solicitud.
  const renderCampo = (titulo, valor) => (
    <div className="col-md-6 mb-3">
      <div className="p-3 border rounded bg-light h-100">
        <strong className="d-block mb-1 text-primary">{titulo}</strong>
        {Array.isArray(valor) ? (
          <ul className="mb-0 ps-3">
            {valor.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        ) : (
          <p className="mb-0">{valor || "—"}</p>
        )}
      </div>
    </div>
  );

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
          {/* Botón volver */}
          <motion.button
            className="btn-volver mb-3"
            whileHover={{ scale: 1.05, backgroundColor: "var(--verde-agua)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} className="me-2" /> Volver
          </motion.button>
          <h1>Datos de la solicitud</h1>

          {/* Contenedor de informacion y selector de estado */}
          <div className="contenedorSolicitud" >

            {/* Seccion donde se muestra la info de la solicitud */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="container py-3 tablaDetalleSolicitud"
            >
              <div className="row g-3">
                {tipo === "autorizaciones" && (
                  <>
                    {renderCampo("Fecha prevista", formatearFecha(solicitud.fecha_prevista))}
                    {renderCampo("Integrante", solicitud.integrante?.nombre)}
                    {renderCampo("Médico", solicitud.medico)}
                    {renderCampo("Especialidad", solicitud.especialidad)}
                    {renderCampo("Lugar donde se realizará la prestación", solicitud.lugar)}
                    {renderCampo("Días de internación", solicitud.dias_internacion)}
                    {renderCampo("Observaciones", solicitud.observaciones)}
                  </>
                )}

                {tipo === "recetas" && (
                  <>
                    {renderCampo("Integrante", solicitud.integrante?.nombre)}
                    {renderCampo("Medicamento", solicitud.medicamento)}
                    {renderCampo("Cantidad", solicitud.cantidad)}
                    {renderCampo("Presentación", solicitud.presentacion)}
                    {renderCampo("Observaciones", solicitud.observaciones)}
                  </>
                )}

                {tipo === "reintegros" && (
                  <>
                    {renderCampo("Fecha de la prestación", formatearFecha(solicitud.fecha_prestacion))}
                    {renderCampo("Integrante", solicitud.integrante?.nombre)}
                    {renderCampo("Médico", solicitud.medico)}
                    {renderCampo("Especialidad", solicitud.especialidad)}
                    {renderCampo("Lugar donde fue atendido", solicitud.lugar)}
                    {renderCampo("Datos de la factura", [
                      `Fecha: ${formatearFecha(solicitud.factura_fecha)}`,
                      `Cuit: ${solicitud.factura_cuit}`,
                      `Valor: $${solicitud.factura_valor}`,
                      `A nombre de: ${solicitud.factura_persona}`,
                    ])}
                    {renderCampo("Forma de pago del reintegro", solicitud.forma_pago)}
                    {renderCampo("Observaciones", solicitud.comprobante)}
                  </>
                )}
              </div>
            </motion.div>

            {/* Selector de nuevo estado */}
            <div className="d-flex flex-column justify-content-center gap-3 my-3 selectorEstado">
              <h2>Seleccionar estado</h2>
              {/* Aprobado */}
              <input
                type="radio"
                className="btn-check"
                name="estado"
                id="aprobado"
                autoComplete="off"
                checked={estadoSeleccionado === "aprobado"}
                onChange={() => setEstadoSeleccionado("aprobado")}
              />
              <label className="btn btn-outline-success d-flex align-items-center gap-2 px-3" htmlFor="aprobado">
                <CheckCircle size={18} /> Aprobado
              </label>

              {/* Rechazado */}
              <input
                type="radio"
                className="btn-check"
                name="estado"
                id="rechazado"
                autoComplete="off"
                checked={estadoSeleccionado === "rechazado"}
                onChange={() => setEstadoSeleccionado("rechazado")}
              />
              <label className="btn btn-outline-danger d-flex align-items-center gap-2 px-3" htmlFor="rechazado">
                <XCircle size={18} /> Rechazado
              </label>

              {/* Observado */}
              <input
                type="radio"
                className="btn-check"
                name="estado"
                id="observado"
                autoComplete="off"
                checked={estadoSeleccionado === "observado"}
                onChange={() => setEstadoSeleccionado("observado")}
              />
              <label className="btn btn-outline-warning d-flex align-items-center gap-2 px-3" htmlFor="observado">
                <Eye size={18} /> Observado
              </label>
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
              <button
                className="btn btn-primary btn-lg"
                onClick={() => revisarMotivoYActualizarEstado()}
              >Actualizar estado</button>
            </div>
          )}
        </div>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </PrestadoresLayout>
    </SidebarProvider>
  );
}
