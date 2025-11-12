import api from "./Api";


// --- MÉDICO --- //
export const getTurnosByPrestador= async (prestadorId) => {
  if (!prestadorId) {
    console.warn("getTurnosByPrestador called without prestadorId");
    return [];
  }

  try {
    const res = await api.get(`/turnos/${prestadorId}`);
    console.log("getTurnosByPrestador:", res.status, res.data);
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Error en getTurnosByPrestador:", error);
    throw error;
  }
};

export const updateNotasTurno = async (prestadorId, turnoId, notas) => {
  return await api.patch(`/turnos/${prestadorId}/turno/${turnoId}`, { notas });
};

// Trae todos los turnos de un médico por su username
export const getTurnosByMedicoId = async (id) => {
  if (!id) {
    console.warn("getTurnosByMedicoId called without id");
    return [];
  }

  try {
    const res = await api.get(`/turnos/medico/id/${id}`);
    console.log("getTurnosByMedicoId:", res.status, res.data);
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Error en getTurnosByMedicoId:", error);
    return [];
  }
};


// --- CENTRO MÉDICO --- //
export const getTurnosCentro = async (prestadorId) => {
  return await api.get(`/turnos/centro/${prestadorId}`);
};

export const getTurnosCentroByEspecialidad = async (
  prestadorId,
  especialidad
) => {
  return await api.get(
    `/turnos/centro/${prestadorId}/especialidad/${especialidad}`
  );
};

export const getTurnosCentroByMedico = async (prestadorId, medicoId) => {
  return await api.get(`/turnos/centro/${prestadorId}/medico/${medicoId}`);
};

// Devuelve todos los turnos que le corresponden al integrante de id **pacienteId**
export const getTurnosByIntegranteId = async (pacienteId) => {
  try {
    const res = await api.get("/turnos/centro/3");
    const data = Array.isArray(res.data) ? res.data : [];
    return data.filter((turno) => turno.integranteId === pacienteId);
  } catch (error) {
    console.error("Hubo un error al traerse los turnos del integrante", error);
    return [];
  }
};

// Devuelve todos los turnos que le corresponden al paciente de id **pacienteId**
export const getTurnosByPacienteId = async (pacienteId, tipoPaciente) => {
  const tipoLowercase = tipoPaciente.toLowerCase();
  try {
    const res = await api.get("/turnos/centro/3");
    const data = Array.isArray(res.data) ? res.data : [];
    return data.filter((turno) => turno[`${tipoLowercase}Id`] === pacienteId);
  } catch (error) {
    console.error("Hubo un error al traerse los turnos del integrante", error);
    return [];
  }
};
