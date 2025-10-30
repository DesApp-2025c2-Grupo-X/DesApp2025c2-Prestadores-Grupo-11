import api from './Api';

// GET /situaciones/:integranteId
export const getSituacionesByIntegrante = async (integranteId, signal) => {
  const res = await api.get(`/situaciones/${integranteId}`, { signal });
  return res.data;
};

// GET /situaciones/prestador/:prestadorId
export const getSituacionesByPrestador = async (prestadorId, signal) => {
  const res = await api.get(`/situaciones/prestador/${prestadorId}`, { signal });
  return res.data;
};
