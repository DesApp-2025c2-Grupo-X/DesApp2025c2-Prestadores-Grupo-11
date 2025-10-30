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
