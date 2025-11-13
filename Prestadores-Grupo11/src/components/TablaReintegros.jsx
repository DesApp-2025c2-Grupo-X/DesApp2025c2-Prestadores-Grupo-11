import React from "react";

export default function TablaReintegros({ solicitudes, tomarSolicitud, navigate }) {
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
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes && solicitudes.length > 0 ? (
            solicitudes.map((s) => (
              <tr key={s.id} className="align-middle">
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
                <td>
                  {s.estado === "recibido" ? (
                    <button className="btn-accion" onClick={() => tomarSolicitud(s.id)}>
                      Tomar solicitud
                    </button>
                  ) : (
                    <button
                      className="btn-accion"
                      onClick={() =>
                        navigate(`/prestadores/solicitudes/${s.id}?tipo=reintegros`, {
                          state: { solicitud: s },
                        })
                      }
                    >
                      Ver más y gestionar
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No hay reintegros disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
