import api from './Api';

/**
 * Busca integrantes (pacientes) por nombre o número de afiliado.
 * GET /integrantes?q=valorBusqueda
 */
export const getIntegrantes = async (valorBusqueda) => {
  try {
    if (!valorBusqueda || valorBusqueda.trim().length < 8) {
      throw new Error('La búsqueda requiere al menos 8 caracteres.');
    }

    const res = await api.get('/integrantes', {
      params: { q: valorBusqueda.trim() },
    });

    return res.data;
  } catch (error) {
    console.error('Error al obtener integrantes:', error);
    throw error;
  }
};

export const getAllIntegrantes = async () => {
  try {

    const res = await api.get('/integrantes');
    return res.data;
  } catch (error) {
    console.error('Error al obtener integrantes:', error);
    throw error;
  }
};

/**
 * Obtiene un integrante por su ID.
 * GET /integrantes/:id
 */
export const getIntegranteById = async (id) => {
  try {
    const res = await api.get(`/integrantes/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error al obtener integrante con ID ${id}:`, error);
    throw error;
  }
};

