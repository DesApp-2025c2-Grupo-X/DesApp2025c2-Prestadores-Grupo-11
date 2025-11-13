import React from "react";

const DetalleHistorialModal = ({ mostrar, onClose, detalle }) => {
  if (!detalle) return null;

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
            <h5 className="modal-title">Detalle de {detalle.tipo}</h5>
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
            <span>
              <strong>Descripción:</strong>{" "}
              <p>{detalle.descripcion || "Sin descripción"}</p>
            </span>
            <span>
              <strong>Notas:</strong>{" "}
              <p>{detalle.notas && detalle.notas.trim() !== ""
                ? detalle.notas
                : "Sin notas"}
              </p>
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
