import React from "react";

export default function TablaReintegrosCompletadas({ solicitudes }) {
  return (
    <div className="tableScroll">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Fecha prestación</th>
            <th>Integrante</th>
            <th>Médico</th>
            <th>Especialidad</th>
            <th>Estado</th>
            <th>Motivo</th>
            <th>Fecha de finalización</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes && solicitudes.length > 0 ? (
            solicitudes.map((s) => (
              <tr key={s.id}>
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
                <td>{new Date(s.fecha_finalizacion).toLocaleString("es-AR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}</td>
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
  );
}
