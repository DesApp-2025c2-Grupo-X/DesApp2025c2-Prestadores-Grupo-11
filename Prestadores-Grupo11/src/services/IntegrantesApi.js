import api from './Api';


// GET /integrantes?q=valorBusqueda
export const getIntegrantes = async (valorBusqueda, signal) => {
  const res = await api.get('/integrantes', {
    params: { q: valorBusqueda },
    signal,
  });
  return res.data;
};

// GET /integrantes/:id
export const getIntegranteById = async (id, signal) => {
  const res = await api.get(`/integrantes/${id}`, { signal });
  return res.data;
};
