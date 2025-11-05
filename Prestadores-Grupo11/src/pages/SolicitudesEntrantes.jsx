import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/SituacionesTerapeuticas.css";
import HeaderPrestadores from "../components/HeaderPrestadores";
import PrestadoresLayout from "../components/PrestadoresLayout";
import SideBar from "../components/SideBar";
import { getAutorizacionesPropias } from "../services/Solicitudes";
import { SidebarProvider } from "../context/SidebarContext";

export default function SolicitudesEntrantes() {
	const navigate = useNavigate();

	const [tipoSolicitud, setTipoSolicitud] = useState("reintegro")
	const [reintegros, setReintegros] = useState([])
	const [autorizaciones, setAutorizaciones] = useState([])
	const [recetas, setRecetas] = useState([])

	//solicitudesDisponibles contiene los reintegros/autorizaciones/recetas a mostrar (estado "recibido" o "en analisis")
	const [solicitudesDisponibles, setSolicitudesDisponibles] = useState([])

	const mostrarSolicitudesDisponibles = () => {

		const solicitudes = {
			reintegro: reintegros,
			autorizacion: autorizaciones,
			receta: recetas,
		};

		const lista = solicitudes[tipoSolicitud];

		if (!lista) {
			console.error("Tipo de solicitud inválido:", tipoSolicitud);
			return;
		}

		const filtradas = lista.filter(
			(item) => item.estado === "recibido" || item.estado === "en analisis"
		);

		console.log("Solicitudes a mostrar", filtradas)
		setSolicitudesDisponibles(filtradas);
	}

	//Esta funcion se borrara cuando se haga el vinculo con el backend
	const tomarSolicitud = (id) => {
		const actualizarLista = (lista, setLista) => {
			const actualizada = lista.map((item) =>
				item.id === id ? { ...item, estado: "en analisis" } : item
			);
			setLista(actualizada);
		};

		if (tipoSolicitud === "reintegro") {
			actualizarLista(reintegros, setReintegros);
		} else if (tipoSolicitud === "autorizacion") {
			actualizarLista(autorizaciones, setAutorizaciones);
		} else if (tipoSolicitud === "receta") {
			actualizarLista(recetas, setRecetas);
		}
	};


	// Primer useEffect, se obtiene la informacion de reintegros, autrizaciones y recetas.
	useEffect(() => {
		const fetchDatos = async () => {
			try {
				const resReintegros = await fetch("/reintegros.json");
				if (!resReintegros.ok) throw new Error("Error al cargar reintegros.json");
				const dataReintegros = await resReintegros.json();
				setReintegros(dataReintegros);

				const resRecetas = await fetch("/recetas.json");
				if (!resRecetas.ok) throw new Error("Error al cargar recetas.json");
				const dataRecetas = await resRecetas.json();
				setRecetas(dataRecetas);

				const dataAutorizaciones = await getAutorizacionesPropias();
				setAutorizaciones(dataAutorizaciones);

			} catch (err) {
				console.error("Error cargando datos:", err);
			}
		};

		fetchDatos();
	}, []);

	// Segundo useEffect: filtrar cuando los datos o el tipo cambian
	useEffect(() => {
		mostrarSolicitudesDisponibles();
	}, [reintegros, autorizaciones, recetas, tipoSolicitud]);

	return (
		<SidebarProvider>
			<PrestadoresLayout header={<HeaderPrestadores />}>
				<SideBar />
				<div className="contenido-principal main-with-sidebar">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						style={{ display: "flex", justifyContent: "center", gap: "30px", marginBottom: "30px" }}
					>
						<div className="info-card">
							<h5>Solicitudes Pendientes</h5>
							<p>14</p>
						</div>
						<div className="info-card">
							<h5>Solicitudes resueltas del dia</h5>
							<p>12</p>
						</div>
						<div className="info-card">
							<h5>Solicitudes resueltas de la semana</h5>
							<p>114</p>
						</div>
					</motion.div>

					<select
						className="form-select"
						aria-label="Tipo de solicitud"
						value={tipoSolicitud}
						onChange={(e) => setTipoSolicitud(e.target.value)}
					>
						<option value="reintegro">Reintegro</option>
						<option value="autorizacion">Autorización</option>
						<option value="receta">Receta</option>
					</select>

					<motion.div
						className="tabla-container"
						initial={{ opacity: 0 }}
						animate={{ opacity: solicitudesDisponibles.length ? 1 : 0 }}
						transition={{ duration: 0.4 }}
					>
						<div className="tabla-container">

							{/*Tabla para los reintegros*/}
							{tipoSolicitud === "reintegro" && (
								<table className="table table-striped">
									<thead>
										<tr>
											<th>Fecha prestación</th>
											<th>Integrante</th>
											<th>Médico</th>
											<th>Especialidad</th>
											<th>Estado</th>
											<th>Acción</th>
										</tr>
									</thead>
									<tbody>
										{solicitudesDisponibles.map((s) => (
											<tr key={s.id}>
												<td>{s.fechaPrestacion}</td>
												<td>{s.integrante}</td>
												<td>{s.medico}</td>
												<td>{s.especialidad}</td>
												<td>{s.estado}</td>
												<td>
													{s.estado === "recibido" ? (
														<button className="btn-accion" onClick={() => tomarSolicitud(s.id)}>
															Tomar solicitud
														</button>
													) : (
														<button
															className="btn-accion"
															onClick={() =>
																navigate(`/prestadores/solicitudes/${s.id}?tipo=${tipoSolicitud}`, {
																	state: { solicitud: s } // Se pasa la solicitud clickeada a la siguiente página
																})
															}
														>
															Ver más y gestionar
														</button>

													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)}

							{/*Tabla para las autorizaciones*/}
							{tipoSolicitud === "autorizacion" && (
								<table className="table table-striped">
									<thead>
										<tr>
											<th>Fecha prevista</th>
											<th>Integrante</th>
											<th>Médico</th>
											<th>Especialidad</th>
											<th>Estado</th>
											<th>Acción</th>
										</tr>
									</thead>
									<tbody>
										{solicitudesDisponibles && solicitudesDisponibles.length > 0 ? (
											solicitudesDisponibles.map((s) => {
												console.log("Renderizando solicitud:", s);

												return (
													<tr key={s.id}>
														<td>
															{new Date(s.fecha_prevista).toLocaleString("es-AR", {
																day: "2-digit",
																month: "2-digit",
																year: "numeric",
																hour: "2-digit",
																minute: "2-digit",
															})}
														</td>
														<td>{s.integrante.nombre}</td>
														<td>{s.medico}</td>
														<td>{s.especialidad}</td>
														<td>{s.estado}</td>
														<td>
															{s.estado === "recibido" ? (
																<button className="btn-accion" onClick={() => tomarSolicitud(s.id)}>
																	Tomar solicitud
																</button>
															) : (
																<button
																	className="btn-accion"
																	onClick={() => {
																		console.log("Solicitud enviada al navigate:", s);
																		navigate(`/prestadores/solicitudes/${s.id}?tipo=${tipoSolicitud}`, {
																			state: { solicitud: s }, // se pasa el objeto completo
																		});
																	}}
																>
																	Ver más y gestionar
																</button>
															)}
														</td>
													</tr>
												);
											})
										) : (
											<tr>
												<td colSpan="6" style={{ textAlign: "center" }}>
													No hay solicitudes disponibles
												</td>
											</tr>
										)}
									</tbody>
								</table>
							)}

							{/*Tabla para las recetas*/}
							{tipoSolicitud === "receta" && (
								<table className="table table-striped">
									<thead>
										<tr>
											<th>Integrante</th>
											<th>Medicamento</th>
											<th>Cantidad</th>
											<th>Presentación</th>
											<th>Estado</th>
											<th>Acción</th>
										</tr>
									</thead>
									<tbody>
										{solicitudesDisponibles.map((s) => (
											<tr key={s.id}>
												<td>{s.integrante}</td>
												<td>{s.medicamento}</td>
												<td>{s.cantidad}</td>
												<td>{s.presentacion}</td>
												<td>{s.estado}</td>
												<td>
													{s.estado === "recibido" ? (
														<button className="btn-accion" onClick={() => tomarSolicitud(s.id)}>
															Tomar solicitud
														</button>
													) : (
														<button
															className="btn-accion"
															onClick={() => navigate(`/prestadores/solicitudes/${s.id}?tipo=${tipoSolicitud}`)}
														>
															Ver más y gestionar
														</button>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)}

						</div>

					</motion.div>
				</div>
			</PrestadoresLayout>
		</SidebarProvider>
	)
}