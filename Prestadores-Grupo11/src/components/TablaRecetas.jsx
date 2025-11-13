import React from "react";

export default function TablaRecetas({ solicitudes, tomarSolicitud, navigate }) {
  return (
    <div className="tableScroll">
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
          {solicitudes && solicitudes.length > 0 ? (
            solicitudes.map((s) => (
              <tr key={s.id} className="align-middle">
                <td>{s.integrante?.nombre ?? "Sin datos"}</td>
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
                      onClick={() =>
                        navigate(`/prestadores/solicitudes/${s.id}?tipo=recetas`, {
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
                No hay recetas disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
