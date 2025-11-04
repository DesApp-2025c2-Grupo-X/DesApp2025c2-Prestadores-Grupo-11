import api from './Api';

// GET /turnos/integrante/:integranteId
export const getTurnosByIntegrante = async (integranteId, signal) => {
  const res = await api.get(`/turnos/integrante/${integranteId}`, { signal });
  return res.data;
};

// GET /turnos/prestador/:prestadorId
export const getTurnosByPrestador = async (prestadorId, signal) => {
  const res = await api.get(`/turnos/prestador/${prestadorId}`, { signal });
  return res.data;
};

// GET /turnos/prestador/:prestadorId?especialidad=cardiología
export const getTurnosByPrestadorAndEspecialidad = async (prestadorId, especialidad, signal) => {
  const res = await api.get(`/turnos/prestador/${prestadorId}`, {
    params: { especialidad },
    signal,
  });
  return res.data;
};

// Devuelve todos los turnos que le corresponden al integrante de id **pacienteId**
export const getTurnosByIntegranteId = async (pacienteId) => {
  try {
    const res = await api.get("/turnos/centro/3");
    const data = Array.isArray(res.data) ? res.data : []; //Si no hay turnos, devuelve array vacio
    const filtrados = data.filter(turno => turno.integranteId === pacienteId);
    return filtrados;
  } catch (error) {
    console.error("Hubo un error al traerse los turnos del integrante", error);
    return [];
  }
};