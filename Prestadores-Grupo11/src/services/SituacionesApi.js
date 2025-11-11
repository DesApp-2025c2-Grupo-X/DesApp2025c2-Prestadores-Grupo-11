
import api from './Api';

/**
 * Obtiene todas las situaciones de un afiliado según el prestador y nro/apellido
 * GET /situaciones/:prestadorId/Afiliado/:nroOApellido
 */
export const getSituacionesByNroOApellidoAfiliado = async (prestadorId, nroOApellido, signal) => {
  try {
    const res = await api.get(`/situaciones/${prestadorId}/Afiliado/${nroOApellido}`, { signal });
    return res.data;
  } catch (error) {
    if (error.name === 'CanceledError') throw error;
    console.error(`Error al obtener situaciones del afiliado ${nroOApellido}:`, error);
    throw error;
  }
};

/**
 * Obtiene todas las situaciones de un afiliado por ID
 * GET /situaciones/Afiliado/:id
 */
export const getSituacionesByAfiliadoId = async (afiliadoId) => {
  try {
    const res = await api.get(`/situaciones/Afiliado/${afiliadoId}`);
    return res.data?.situaciones || [];
  } catch (error) {
    console.error(`Error al obtener situaciones del afiliado ${afiliadoId}:`, error);
    throw error;
  }
};

/**
 * Obtiene todas las situaciones de un integrante
 * GET /situaciones/Integrante/:idIntegrante
 */
export const getSituacionesByIntegranteId = async (integranteId) => {
  try {
    const res = await api.get(`/situaciones/Integrante/${integranteId}`);
    return res.data?.situaciones || [];
  } catch (error) {
    console.error("Error al traerse las situaciones del integrante:", error);
    throw error;
  }
};

/**
 * Crear nueva situación
 * POST /situaciones/:prestadorId
 */
export const crearSituacion = async (prestadorId, data) => {
  try {
    const res = await api.post(`/situaciones/${prestadorId}`, data);
    return res.data;
  } catch (error) {
    console.error('Error al crear situación:', error);
    throw error;
  }
};

/**
 * Actualizar estado de situación
 * PATCH /situaciones/:id
 */
export const actualizarSituacion = async (id, data) => {
  try {
    const res = await api.patch(`/situaciones/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(`Error al actualizar situación ${id}:`, error);
    throw error;
  }
};
