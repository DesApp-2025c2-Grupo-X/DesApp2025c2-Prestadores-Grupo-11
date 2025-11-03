import api from './Api';

/**
 * Trae el username del prestador usando el prestadorId
 * GET /dashboard/:prestadorId
 */
export const getNombrePrestadorById = async (prestadorId) => {
  try {
    const res = await api.get(`/dashboard/${prestadorId}`);
    return res.data.username
  } catch (error) {
    console.error("Error al traer el nombre del prestador:", error);
    throw error;
  }
}