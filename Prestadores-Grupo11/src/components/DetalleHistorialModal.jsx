import React from "react";

const DetalleHistorialModal = ({ mostrar, onClose, detalle }) => {
  if (!detalle) return null;

  const user = JSON.parse(localStorage.getItem("miapp_user"));
  let lugar = (user.role === "medico") ? user.centro : user.username

  return (
    <div
      className={`modal fade ${mostrar ? "show d-block" : ""}`}
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Detalle de {detalle.duration == null ? "Situacion Terapeutica" : "Turno"}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <span>
              <strong>Fecha:</strong>{" "}
              <p>{detalle.fecha
                ? new Date(detalle.fecha).toLocaleString("es-AR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : "-"}</p>
            </span>
            <span>
              <strong>Médico:</strong>
              <p>{detalle.medico}</p>
            </span>
            <span>
              <strong>Especialidad:</strong>
              <p>{detalle.especialidad}</p>
            </span>
            {detalle.duration != null && (
              <span>
                <strong>Duración:</strong>{" "}
                <p>{detalle.duration} minutos</p>
              </span>
            )}
            {detalle.duration == null && (
              <div>
                <span>
                  <strong>Lugar de la situación:</strong>{" "}
                  <p>{lugar}</p>
                </span>
                <span>
                  <strong>Estado:</strong>{" "}
                  <p>{detalle.estado}</p>
                </span>
              </div>
            )}
            <span>
              <strong>Notas:</strong>{" "}
              <div
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: "#f9f9f9"
                }}
              >
                {detalle.notas && detalle.notas.trim() !== ""
                  ? detalle.notas
                  : "Sin notas"}
              </div>
            </span>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleHistorialModal;
