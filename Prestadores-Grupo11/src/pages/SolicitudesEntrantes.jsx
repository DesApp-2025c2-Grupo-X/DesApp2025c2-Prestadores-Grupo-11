import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/SituacionesTerapeuticas.css";
import HeaderPrestadores from "../components/HeaderPrestadores";
import PrestadoresLayout from "../components/PrestadoresLayout";
import SideBar from "../components/SideBar";
import TablaReintegros from "../components/TablaReintegros";
import TablaAutorizaciones from "../components/TablaAutorizaciones";
import TablaRecetas from "../components/TablaRecetas";
import TablaAutorizacionesCompletadas from "../components/TablaAutorizacionesCompletadas";
import TablaReintegrosCompletadas from "../components/TablaReintegrosCompletadas";
import TablaRecetasCompletadas from "../components/TablaRecetasCompletadas";
import {
	getAutorizacionesPropias, getRecetasPropias, getReintegrosPropias, getAutorizacionesCompletados,
	getRecetasCompletados, getReintegrosCompletados, getAutorizacionesPropiasAnalisis, getReintegrosPropiasAnalisis, getRecetasPropiasAnalisis,
	getSolicitudesByTipo, cambiarEstadoAutorizacion, cambiarEstadoReceta, cambiarEstadoReintegro
} from "../services/Solicitudes";
import { SidebarProvider } from "../context/SidebarContext";

export default function SolicitudesEntrantes() {
	const navigate = useNavigate();

	// Utilizado para la tabla de los pendientes
	const [tipoSolicitud, setTipoSolicitud] = useState("reintegros")
	// Utilizado para la tabla de los completados
	const [tipoSolicitudCompletados, setTipoSolicitudCompletados] = useState("reintegros")

	const [reintegrosDisponibles, setReintegrosDisponibles] = useState([])
	const [autorizacionesDisponibles, setAutorizacionesDisponibles] = useState([])
	const [recetasDisponibles, setRecetasDisponibles] = useState([])

	const [reintegrosCompletados, setReintegrosCompletados] = useState([])
	const [autorizacionesCompletados, setAutorizacionesCompletados] = useState([])
	const [recetasCompletados, setRecetasCompletados] = useState([])

	//Para mostrar la info de las solicitudes
	const [cantReintegrosAnalisis, setCantReintegrosAnalisis] = useState(0);
	const [cantAutorizacionesAnalisis, setCantAutorizacionesAnalisis] = useState(0);
	const [cantRecetasAnalisis, setCantRecetasAnalisis] = useState(0);

	//solicitudesDisponibles contiene los reintegros/autorizaciones/recetas a mostrar (estado "recibido" o "en analisis")
	const [solicitudesDisponibles, setSolicitudesDisponibles] = useState([])
	//solicitudesCompletadas contiene los reintegros/autorizaciones/recetas aprobados (estado "aprobado", "rechazado" o "observado")
	const [solicitudesCompletadas, setSolicitudesCompletadas] = useState([])

	const user = JSON.parse(localStorage.getItem("miapp_user"));

	const mostrarSolicitudesDisponibles = async () => {

		const solicitudes = {
			reintegros: reintegrosDisponibles,
			autorizaciones: autorizacionesDisponibles,
			recetas: recetasDisponibles,
		};

		const lista = solicitudes[tipoSolicitud];

		if (!lista) {
			console.error("Tipo de solicitud inválido:", tipoSolicitud);
			return;
		}

		setSolicitudesDisponibles(lista);
	}

	const mostrarSolicitudesCompletadas = async () => {

		const solicitudes = {
			reintegros: reintegrosCompletados,
			autorizaciones: autorizacionesCompletados,
			recetas: recetasCompletados,
		};

		const lista = solicitudes[tipoSolicitudCompletados]

		if (!lista) {
			console.error("Tipo de solicitud invalido:", tipoSolicitudCompletados)
			return;
		}

		setSolicitudesCompletadas(lista);
	}

	const infoCantSolicitudes = async () => {
		try {
			//Reintegros en analisis
			const cantidadReintegrosAnalisis = await getReintegrosPropiasAnalisis(user.id)
			setCantReintegrosAnalisis(cantidadReintegrosAnalisis.length)

			//Autorizaciones en analisis
			const cantidadAutorizacionesAnalisis = await getAutorizacionesPropiasAnalisis(user.id)
			setCantAutorizacionesAnalisis(cantidadAutorizacionesAnalisis.length)

			//Recetas en analisis
			const cantidadRecetasAnalisis = await getRecetasPropiasAnalisis(user.id)
			setCantRecetasAnalisis(cantidadRecetasAnalisis.length)


		} catch (error) {
			console.log("Error al contar cuantas solicitudes en analisis hay", error)
			throw error;
		}
	}

	const tomarSolicitud = async (id) => {
		try {
			if (!tipoSolicitud) {
				console.error("Tipo de solicitud no definido");
				return;
			}

			const body = {
				nuevoEstado: "en analisis",
				usuarioUltimoCambio: user.id,
				usuarioId: user.id
			};

			let response;

			switch (tipoSolicitud) {
				case "autorizaciones":
					response = await cambiarEstadoAutorizacion(id, body);
					break;

				case "recetas":
					response = await cambiarEstadoReceta(id, body);
					break;

				case "reintegros":
					response = await cambiarEstadoReintegro(id, body);
					break;

				default:
					console.error("Tipo de solicitud no válido:", tipoSolicitud);
					return;
			}

			console.log(`${tipoSolicitud} ahora en análisis:`, response.data);

			//Actualiza la lista nuevamente tras hacer el cambio, asi se ve la solicitud cambiada
			const nuevasSolicitudes = await getSolicitudesByTipo(tipoSolicitud, user);
			setSolicitudesDisponibles(nuevasSolicitudes);

		} catch (error) {
			console.error("Error al reclamar solicitud:", error);
		}

		//Para actualizar el contador de cuantos en analisis hay
		infoCantSolicitudes()
	};


	// Primer useEffect, se obtiene la informacion de reintegros, autorizaciones y recetas.
	useEffect(() => {
		const fetchDatos = async () => {
			try {

				const dataReintegrosDisponibles = await getReintegrosPropias(user);
				setReintegrosDisponibles(dataReintegrosDisponibles);

				const dataRecetasDisponibles = await getRecetasPropias(user.id);
				setRecetasDisponibles(dataRecetasDisponibles)

				const dataAutorizacionesDisponibles = await getAutorizacionesPropias(user);
				setAutorizacionesDisponibles(dataAutorizacionesDisponibles);

				const dataReintegrosCompletados = await getReintegrosCompletados(user.id);
				setReintegrosCompletados(dataReintegrosCompletados)

				const dataAutorizacionesCompletados = await getAutorizacionesCompletados(user.id);
				setAutorizacionesCompletados(dataAutorizacionesCompletados)

				const dataRecetasCompletados = await getRecetasCompletados(user.id);
				setRecetasCompletados(dataRecetasCompletados)

			} catch (err) {
				console.error("Error cargando datos:", err);
			}
		};

		fetchDatos();
	}, []);

	// Filtrar cuando el tipo cambia
	useEffect(() => {
		mostrarSolicitudesDisponibles();
	}, [reintegrosDisponibles, tipoSolicitud]);

	// Filtrar cuando el tipo de las completadas cambia
	useEffect(() => {
		mostrarSolicitudesCompletadas();
	}, [tipoSolicitudCompletados, reintegrosCompletados, autorizacionesCompletados, recetasCompletados])

	// Actualizar la info de las solicitudes cuando cambian las solicitudes
	useEffect(() => {
		infoCantSolicitudes();
	}, [reintegrosDisponibles, autorizacionesDisponibles, recetasDisponibles])

	return (
		<SidebarProvider>
			<PrestadoresLayout header={<HeaderPrestadores />}>
				<SideBar />
				<div className="contenido-principal main-with-sidebar">

					{/* Selector de tipo de solicitud */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="cards-container"
					>
						{/* Reintegros */}
						<motion.div
							className={`info-card cardSolicitud ${tipoSolicitud === "reintegros" ? "selected" : ""}`}
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.97 }}
							onClick={() => setTipoSolicitud("reintegros")}
						>
							<h1>Reintegros</h1>
							<hr />
							<h5>Reintegros por analizar:</h5>
							<p>{cantReintegrosAnalisis}</p>
						</motion.div>

						{/* Autorizaciones */}
						<motion.div
							className={`info-card cardSolicitud ${tipoSolicitud === "autorizaciones" ? "selected" : ""}`}
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.97 }}
							onClick={() => setTipoSolicitud("autorizaciones")}
						>
							<h1>Autorizaciones</h1>
							<hr />
							<h5>Autorizaciones por analizar:</h5>
							<p>{cantAutorizacionesAnalisis}</p>
						</motion.div>

						{/* Recetas */}
						<motion.div
							className={`info-card cardSolicitud ${tipoSolicitud === "recetas" ? "selected" : ""}`}
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.97 }}
							onClick={() => setTipoSolicitud("recetas")}
						>
							<h1>Recetas</h1>
							<hr />
							<h5>Recetas por analizar:</h5>
							<p>{cantRecetasAnalisis}</p>
						</motion.div>
					</motion.div>

					{/* Tabla de solicitudes */}
					<motion.div
						className="tabla-container"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.4 }}
					>
						<div className="tabla-container">

							{/* Tabla para los reintegros */}
							{tipoSolicitud === "reintegros" && (
								<TablaReintegros
									solicitudes={solicitudesDisponibles}
									tomarSolicitud={tomarSolicitud}
									navigate={navigate}
								/>
							)}

							{/* Tabla para las autorizaciones */}
							{tipoSolicitud === "autorizaciones" && (
								<TablaAutorizaciones
									solicitudes={solicitudesDisponibles}
									tomarSolicitud={tomarSolicitud}
									navigate={navigate}
								/>
							)}

							{/* Tabla para las recetas */}
							{tipoSolicitud === "recetas" && (
								<TablaRecetas
									solicitudes={solicitudesDisponibles}
									tomarSolicitud={tomarSolicitud}
									navigate={navigate}
								/>
							)}

						</div>
					</motion.div>

					{/* Seccion de solicitudes aprobadas, rechazadas y observadas */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						style={{
							// display: "flex",
							// justifyContent: "center",
							gap: "30px",
							marginBottom: "30px",
						}}
					>
						<p className="d-flex justify-content-center">
							<a className="verMas" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
								Ver tus solicitudes completadas ↓
							</a>
						</p>
						<div className="collapse" id="collapseExample">

							<hr />

							{/* Selector de tipo de solicitud */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
								className="cards-container"
							>
								{/* Reintegros */}
								<motion.div
									className={`cardSolicitudCompletada ${tipoSolicitudCompletados === "reintegros" ? "selected" : ""}`}
									whileHover={{ scale: 1.03 }}
									whileTap={{ scale: 0.97 }}
									onClick={() => setTipoSolicitudCompletados("reintegros")}
								>
									<h2>Reintegros</h2>
								</motion.div>

								{/* Autorizaciones */}
								<motion.div
									className={`cardSolicitudCompletada ${tipoSolicitudCompletados === "autorizaciones" ? "selected" : ""}`}
									whileHover={{ scale: 1.03 }}
									whileTap={{ scale: 0.97 }}
									onClick={() => setTipoSolicitudCompletados("autorizaciones")}
								>
									<h2>Autorizaciones</h2>
								</motion.div>

								{/* Recetas */}
								<motion.div
									className={`cardSolicitudCompletada ${tipoSolicitudCompletados === "recetas" ? "selected" : ""}`}
									whileHover={{ scale: 1.03 }}
									whileTap={{ scale: 0.97 }}
									onClick={() => setTipoSolicitudCompletados("recetas")}
								>
									<h2>Recetas</h2>
								</motion.div>
							</motion.div>

							{/* Tabla de solicitudes completadas */}
							<motion.div
								className="tabla-container"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.4 }}
							>
								<div className="tabla-container">

									{/* Tabla para los reintegros completados */}
									{tipoSolicitudCompletados === "reintegros" && (
										<TablaReintegrosCompletadas
											solicitudes={solicitudesCompletadas}
										/>
									)}

									{/* Tabla para las autorizaciones completados */}
									{tipoSolicitudCompletados === "autorizaciones" && (
										<TablaAutorizacionesCompletadas
											solicitudes={solicitudesCompletadas}
										/>
									)}

									{/* Tabla para las recetas completados */}
									{tipoSolicitudCompletados === "recetas" && (
										<TablaRecetasCompletadas
											solicitudes={solicitudesCompletadas}
										/>
									)}

								</div>
							</motion.div>
						</div>
					</motion.div>
				</div>
			</PrestadoresLayout>
		</SidebarProvider>
	);
}