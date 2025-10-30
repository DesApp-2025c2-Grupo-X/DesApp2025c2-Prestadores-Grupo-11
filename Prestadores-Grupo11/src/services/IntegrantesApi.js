import api from './Api';

/**
 * Busca integrantes (pacientes) por nombre o DNI.
 * GET /integrantes?q=valorBusqueda
 */
export const getIntegrantes = async (valorBusqueda, signal) => {
  try {
    const res = await api.get('/integrantes', {
      params: { q: valorBusqueda },
      signal,
    });
    return res.data;
  } catch (error) {
    if (error.name === 'CanceledError') throw error; // ignorar si se canceló
    console.error('Error al obtener integrantes:', error);
    throw error;
  }
};

/**
 * Obtiene un integrante por su ID.
 * GET /integrantes/:id
 */
export const getIntegranteById = async (id, signal) => {
  try {
    const res = await api.get(`/integrantes/${id}`, { signal });
    return res.data;
  } catch (error) {
    if (error.name === 'CanceledError') throw error;
    console.error(`Error al obtener integrante con ID ${id}:`, error);
    throw error;
  }
};
