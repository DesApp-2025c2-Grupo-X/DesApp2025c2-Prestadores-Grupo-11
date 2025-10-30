
import api from './Api';

/**
 * Obtiene un afiliado con sus situaciones por ID del prestador y del afiliado
 * GET /situaciones/:id/afiliado/:afiliadoId
 */
export const getAfiliadoConSituaciones = async (prestadorId, afiliadoId, signal) => {
  try {
    const res = await api.get(`/situaciones/${prestadorId}/afiliado/${afiliadoId}`, { signal });
    return res.data;
  } catch (error) {
    if (error.name === 'CanceledError') throw error;
    console.error(`Error al obtener afiliado con ID ${afiliadoId}:`, error);
    throw error;
  }
};
