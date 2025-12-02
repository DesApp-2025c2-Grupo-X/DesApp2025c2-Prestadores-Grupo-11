import React from "react";

export default function HistorialFiltroRadios({ filtro, onChange }) {
  const user = JSON.parse(localStorage.getItem("miapp_user"));
  return (
    <div className="d-flex justify-content-center mb-3">

      <div className="form-check ms-3">
        <input
          className="form-check-input"
          type="radio"
          name="filtroHistorial"
          value="none"
          checked={filtro === "none"}
          onChange={(e) => onChange(e.target.value)}
        />
        <label className="form-check-label ms-2">Historial completo</label>
      </div>

      {user.role === "medico" &&
        <div className="form-check ms-3">
          <input
            className="form-check-input"
            type="radio"
            name="filtroHistorial"
            value="notas"
            checked={filtro === "notas"}
            onChange={(e) => onChange(e.target.value)}
          />
          <label className="form-check-label ms-2">Notas propias</label>
        </div>
      }

      <div className="form-check ms-3">
        <input
          className="form-check-input"
          type="radio"
          name="filtroHistorial"
          value="situaciones"
          checked={filtro === "situaciones"}
          onChange={(e) => onChange(e.target.value)}
        />
        <label className="form-check-label ms-2">Solo situaciones</label>
      </div>

      <div className="form-check ms-3">
        <input
          className="form-check-input"
          type="radio"
          name="filtroHistorial"
          value="situacionesActivas"
          checked={filtro === "situacionesActivas"}
          onChange={(e) => onChange(e.target.value)}
        />
        <label className="form-check-label ms-2">Situaciones activas</label>
      </div>

      <div className="form-check ms-3">
        <input
          className="form-check-input"
          type="radio"
          name="filtroHistorial"
          value="situacionesFinalizadas"
          checked={filtro === "situacionesFinalizadas"}
          onChange={(e) => onChange(e.target.value)}
        />
        <label className="form-check-label ms-2">Situaciones terminadas</label>
      </div>

    </div>
  );
}
