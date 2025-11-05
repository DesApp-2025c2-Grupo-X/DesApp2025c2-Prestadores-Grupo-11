import api from "./Api";

/**
 * Busca afiliados (integrantes) por nombre, apellido o número de afiliado.
 * @param {string|number} prestadorId - ID del prestador
 * @param {string} query - término de búsqueda (nombre completo o número)
 */
export const getIntegrantes = async (prestadorId, query) => {
  try {
    const search = (query || "").trim();

    // Siempre usa la ruta con /situaciones/:prestadorId/Afiliado/:nroOApellido
    const endpoint = `/situaciones/${prestadorId}/Afiliado/${encodeURIComponent(search)}`;

    console.log("🛰️ Llamando a backend:", endpoint);

    const response = await api.get(endpoint, { timeout: 7000 });

    console.log(" Respuesta búsqueda integrantes:", {
      status: response.status,
      data: response.data,
    });

    return response.data;
  } catch (error) {
    console.error(" Error búsqueda integrantes:", error);
    throw error;
  }
};

/**
 * Obtiene un integrante específico por su ID
 */
export const getIntegranteById = async (afiliadoId) => {
  try {
    // Esta ruta es la que existe en backend para buscar por ID
    const endpoint = `/situaciones/Afiliado/${afiliadoId}`;
    const response = await api.get(endpoint);

    console.log("Detalle afiliado:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo afiliado ${afiliadoId}:`, error);
    throw error;
  }
};
