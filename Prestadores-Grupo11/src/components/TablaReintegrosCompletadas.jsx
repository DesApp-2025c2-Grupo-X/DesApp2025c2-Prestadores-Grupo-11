import React, { useState } from "react";

export default function TablaReintegrosCompletadas({ solicitudes }) {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  // --- Filtrado por fecha ---
  const solicitudesFiltradas = solicitudes?.filter((s) => {
    if (!s.fecha_finalizacion) return false;

    const fechaFinReal = new Date(s.fecha_finalizacion);

    if (fechaInicio && fechaFin) {
      return (
        fechaFinReal >= new Date(fechaInicio) &&
        fechaFinReal <= new Date(fechaFin)
      );
    }

    if (fechaInicio) return fechaFinReal >= new Date(fechaInicio);
    if (fechaFin) return fechaFinReal <= new Date(fechaFin);

    return true; // sin fechas → no filtra
  }) || [];

  const solicitudesOrdenadas = [...solicitudesFiltradas].sort(
    (a, b) => new Date(b.fecha_finalizacion) - new Date(a.fecha_finalizacion)
  );

  // --- Paginación ---
  const totalPaginas = Math.ceil(solicitudesOrdenadas.length / itemsPorPagina);

  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;

  const solicitudesPaginadas = solicitudesOrdenadas.slice(indiceInicio, indiceFin);

  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  return (
    <>
      <div className="d-flex justify-content-center gap-3 mt-2 mb-3 align-items-center w-100">
        <div>
          <label className="form-label mb-0">Fecha inicio:</label>
          <input
            type="date"
            className="form-control"
            value={fechaInicio}
            onChange={(e) => {
              setPaginaActual(1); // resetea paginación al filtrar
              setFechaInicio(e.target.value);
            }}
          />
        </div>

        <div>
          <label className="form-label mb-0">Fecha fin:</label>
          <input
            type="date"
            className="form-control"
            value={fechaFin}
            onChange={(e) => {
              setPaginaActual(1); // resetea paginación al filtrar
              setFechaFin(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="tableScroll">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Fecha de finalización</th>
              <th>Fecha prestación</th>
              <th>Integrante</th>
              <th>Médico</th>
              <th>Especialidad</th>
              <th>Estado</th>
              <th>Motivo</th>
            </tr>
          </thead>

          <tbody>
            {solicitudesPaginadas.length > 0 ? (
              solicitudesPaginadas.map((s) => (
                <tr key={s.id} className="align-middle">
                  <td>
                    {new Date(s.fecha_finalizacion).toLocaleString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>
                    {new Date(s.fecha_prestacion).toLocaleString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>{s.integrante?.nombre ?? "Sin datos"}</td>
                  <td>{s.medico}</td>
                  <td>{s.especialidad}</td>
                  <td>{s.estado}</td>
                  <td>{s.motivo ?? "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No hay reintegros completados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={paginaAnterior}
            disabled={paginaActual === 1}
          >
            ← Anterior
          </button>

          <span>Página {paginaActual} de {totalPaginas}</span>

          <button
            className="btn btn-outline-primary btn-sm"
            onClick={paginaSiguiente}
            disabled={paginaActual === totalPaginas}
          >
            Siguiente →
          </button>
        </div>
      )}
    </>
  );
}
