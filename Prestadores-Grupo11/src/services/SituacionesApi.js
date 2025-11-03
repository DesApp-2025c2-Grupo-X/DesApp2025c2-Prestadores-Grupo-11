// src/services/situacionesApi.js
import api from './Api';

/**
 * Obtiene todas las situaciones de un afiliado según el prestador
 * GET /situaciones/:id/Afiliado/:afiliadoId
 * (id = prestadorId)
 */
export const getSituacionesByAfiliado = async (prestadorId, afiliadoId, signal) => {
  try {
    const res = await api.get(`/situaciones/${prestadorId}/Afiliado/${afiliadoId}`, { signal });
    return res.data;
  } catch (error) {
    if (error.name === 'CanceledError') throw error;
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
    return res.data.situaciones || [];
  } catch (error) {
    console.error("Error al traerse las situaciones del integrante:", error);
    throw error;
  }
}

/**
 * Crear nueva situación
 * POST /situaciones
 */
export const crearSituacion = async (data) => {
  try {
    const res = await api.post('/situaciones', data);
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
