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


// Trae todos los prestadores del centro

export const getMedicosDeCentroApi = async (centroId) => {
  try {
    const res = await api.get(`/prestador/centro/${centroId}`);
    return res.data
  } catch (error) {
    console.error("Error al traer los medicos del centro:", error);
    throw error;
  }
}