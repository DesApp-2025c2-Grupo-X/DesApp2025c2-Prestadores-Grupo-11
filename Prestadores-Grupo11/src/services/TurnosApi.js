import api from "./Api";

/*---   MÉDICO   --- */
// Trae todos los turnos de un médico por su ID
export const getTurnosByMedicoId = async (medicoId) => {
  if (!medicoId) {
    console.warn("getTurnosByMedicoId fue llamado sin medicoId");
    return [];
  }

  try {
    const res = await api.get(`/turnos/medico/${medicoId}`);
    console.log("getTurnosByMedicoId:", res.status, res.data);
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Error en getTurnosByMedicoId:", error);
    return [];
  }
};



/*---   PRESTADOR (médico o centro) ---*/

// Turnos de un prestador (médico principal)
export const getTurnosByPrestadorId = async (prestadorId) => {
  if (!prestadorId) {
    console.warn("getTurnosByPrestadorId sin prestadorId");
    return { ok: false, data: [] };
  }

  try {
    const res = await api.get(`/turnos/prestador/${prestadorId}`);

    if (!Array.isArray(res.data)) {
      console.error("Respuesta inválida:", res.data);
      return { ok: false, data: [] };
    }

    return { ok: true, data: res.data };
  } catch (error) {
    console.error("Error en getTurnosByPrestadorId:", error);
    return { ok: false, data: [] }; 
  }
};


// Actualiza notas del turno
export const updateNotasTurno = async (prestadorId, turnoId, notas) => {
  return await api.patch(`/turnos/${prestadorId}/turno/${turnoId}`, {
    notes: notas,
  });
};




/*  --   CENTRO MÉDICO   ---*/
export const getTurnosCentro = async (centroId) => {
  if (!centroId) {
    console.warn("getTurnosCentro sin centroId");
    return [];
  }

  return await api.get(`/turnos/centro/${centroId}`);
};

// Turnos por especialidad dentro del centro
export const getTurnosCentroByEspecialidad = async (centroId, especialidad) => {
  return await api.get(
    `/turnos/centro/${centroId}/especialidad/${especialidad}`
  );
};

// Turnos de un médico dentro del centro
export const getTurnosCentroByMedico = async (centroId, medicoId) => {
  return await api.get(`/turnos/centro/${centroId}/medico/${medicoId}`);
};




/* ---   PACIENTE / INTEGRANTE   --- */
export const getTurnosByIntegranteId = async (integranteId) => {
  if (!integranteId) {
    console.warn("getTurnosByIntegranteId sin integranteId");
    return [];
  }

  try {
    const res = await api.get(`/turnos/integrante/${integranteId}`);
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Error al obtener turnos de integrante:", error);
    return [];
  }
};

export const getTurnosByPacienteId = async (pacienteId) => {
  if (!pacienteId) {
    console.warn("getTurnosByPacienteId sin pacienteId");
    return [];
  }

  try {
    const res = await api.get(`/turnos/paciente/${pacienteId}`);
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Error al obtener turnos del paciente:", error);
    return [];
  }
};
