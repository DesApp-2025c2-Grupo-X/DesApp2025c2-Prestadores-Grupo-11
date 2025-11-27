import React, { useState } from "react";

export default function TablaRecetas({ solicitudes }) {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;

  const solicitudesFiltradas = solicitudes.filter((s) => {
    if (!s.fecha_finalizacion) return false;

    const fechaReal = new Date(s.fecha_finalizacion);

    if (fechaInicio && fechaFin) {
      return (
        fechaReal >= new Date(fechaInicio) &&
        fechaReal <= new Date(fechaFin)
      );
    }

    if (fechaInicio) return fechaReal >= new Date(fechaInicio);
    if (fechaFin) return fechaReal <= new Date(fechaFin);
    return true;
  });

  const solicitudesOrdenadas = [...solicitudesFiltradas].sort(
    (a, b) => new Date(b.fecha_finalizacion) - new Date(a.fecha_finalizacion)
  );

  const totalPages = Math.ceil(solicitudesOrdenadas.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const recetasPaginadas = solicitudesOrdenadas.slice(
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
              setCurrentPage(1);
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
              setCurrentPage(1);
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
              <th>Integrante</th>
              <th>Medicamento</th>
              <th>Cantidad</th>
              <th>Presentación</th>
              <th>Estado</th>
              <th>Motivo</th>
            </tr>
          </thead>

          <tbody>
            {recetasPaginadas.length > 0 ? (
              recetasPaginadas.map((s) => (
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
                  <td>{s.integrante?.nombre ?? "Sin datos"}</td>
                  <td>{s.medicamento}</td>
                  <td>{s.cantidad}</td>
                  <td>{s.presentacion}</td>
                  <td>{s.estado}</td>
                  <td>{s.motivo ?? "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No hay recetas completadas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={paginaAnterior}
            disabled={currentPage === 1}
          >
            Anterior
          </button>

          <span>Página {currentPage} de {totalPages}</span>

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
