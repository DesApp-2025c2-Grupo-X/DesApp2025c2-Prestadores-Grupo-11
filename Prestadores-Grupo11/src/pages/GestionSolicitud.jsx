import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PrestadoresLayout from "../components/PrestadoresLayout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import SideBar from "../components/SideBar";
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

  const [solicitud, setSolicitud] = useState(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null)
  const [motivo, setMotivo] = useState("")

  const revisarMotivoYActualizarEstado = () => {
    if (!motivo && (estadoSeleccionado === "rechazado" || estadoSeleccionado === "observado")) {
      toast.error("No se cargo el motivo")
    } else {
      navigate(-1)
    }
  }

  useEffect(() => {
    const fetchSolicitud = async () => {
      let res = []
      let data = []

      try {
        switch (tipo) {
          case "reintegro":
            res = await fetch("/reintegros.json");
            if (!res.ok) throw new Error("Error al cargar reintegros.json");
            data = await res.json();
            break;
          case "autorizacion":
            res = await fetch("/autorizaciones.json");
            if (!res.ok) throw new Error("Error al cargar autorizaciones.json");
            data = await res.json();
            break;
          case "receta":
            res = await fetch("/recetas.json");
            if (!res.ok) throw new Error("Error al cargar recetas.json");
            data = await res.json();
            break;
        }
        setSolicitud(data.find(soli => soli.id.toString() === id));
      } catch (err) {
        console.error("Error cargando solicitud:", err);
      }
    };

    fetchSolicitud();
  }, [id, tipo]);

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
                <strong>Fecha de prestacion</strong>
                <p>{solicitud.fechaPrestacion}</p>
              </span>
              <span>
                <strong>Integrante</strong>
                <p>{solicitud.integrante}</p>
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
                <p>{solicitud.lugarAtencion}</p>
              </span>
              <span>
                <strong>Datos de la factura</strong>
                <ul>
                  <li>{solicitud.factura.fecha}</li>
                  <li>{solicitud.factura.cuit}</li>
                  <li>{solicitud.factura.valorTotal}</li>
                  <li>{solicitud.factura.facturadoA}</li>
                </ul>
              </span>
              <span>
                <strong>Forma de pago</strong>
                <ul>
                  <li>{solicitud.formaPago.tipo}</li>
                  <li>{solicitud.formaPago.cbu}</li>
                </ul>
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
