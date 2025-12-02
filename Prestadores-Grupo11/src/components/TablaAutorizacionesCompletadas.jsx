import React, { useState } from "react";

export default function TablaAutorizacionesCompletadas({ solicitudes }) {
  
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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

  const totalPages = Math.ceil(solicitudesOrdenadas.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const autorizacionesPaginadas = solicitudesOrdenadas.slice(
    startIndex,
    startIndex + pageSize
  );

  const paginaAnterior = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const paginaSiguiente = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
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
              setCurrentPage(1); // resetea paginación al filtrar
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
              setCurrentPage(1); // resetea paginación al filtrar
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
              <th>Fecha prevista</th>
              <th>Integrante</th>
              <th>Médico</th>
              <th>Especialidad</th>
              <th>Estado</th>
              <th>Motivo</th>
            </tr>
          </thead>

          <tbody>
            {autorizacionesPaginadas.length > 0 ? (
              autorizacionesPaginadas.map((s) => (
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
                    {new Date(s.fecha_prevista).toLocaleString("es-AR", {
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
                  No hay autorizaciones completadas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={paginaAnterior}
            disabled={currentPage === 1}
          >
            Anterior
          </button>

          <span>
            Página {currentPage} de {totalPages}
          </span>

          <button
            className="btn btn-outline-primary btn-sm"
            onClick={paginaSiguiente}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </>
  );
}