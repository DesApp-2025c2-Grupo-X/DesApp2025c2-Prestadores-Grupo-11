import api from "./Api";

/**
*Busca afiliados (con integrantes y situaciones)
 * por número de afiliado o apellido, filtrados por prestador.
 * GET /situaciones/:prestadorId/afiliado/:nroOApellido
 *
 * @param {number|string} prestadorId
 * @param {string} valorBusqueda
 * @param {AbortSignal} [signal] - opcional, para cancelar la petición desde el front
 * @returns {Promise<object>} - devuelve el objeto que retorna el backend (afiliado con situaciones e integrantes)
 */
export const getIntegrantes = async (prestadorId, valorBusqueda, signal) => {
  try {
    const q = (valorBusqueda || "").trim();

    if (!prestadorId) throw new Error("Falta el ID del prestador.");
    // cambio: no lanzar error al usuario por <3 chars (mejor devolver [] para que la UI no muestre error)
    if (!q || q.length < 3) {
      return []; // front debe ignorar / no mostrar resultados hasta que haya >= 3 chars
    }

    const res = await api.get(
      `/situaciones/${prestadorId}/afiliado/${encodeURIComponent(q)}`,
      {
        signal, // axios soporta AbortController.signal
      }
    );

    // Normal: backend retorna un objeto con afiliado (no array)
    return res.data || [];
  } catch (error) {
    // Si la petición fue cancelada, relanzamos un error con nombre específico
    if (error?.name === "CanceledError" || error?.message === "canceled") {
      const cancelErr = new Error("Petición cancelada");
      cancelErr.name = "CanceledError";
      throw cancelErr;
    }

    // Mejor logging y mensaje más amigable
    console.error("Error al obtener integrantes:", error);

    // Si la respuesta tiene mensaje de error del backend:
    const backendMsg = error?.response?.data?.error || error?.response?.data?.message;
    const message = backendMsg || error.message || "Error desconocido al buscar afiliado.";

    const err = new Error(message);
    err.details = error;
    throw err;
  }
};


/** 
 * Obtiene todos los integrantes (no usado aquí)
 */
export const getAllIntegrantes = async () => {
  try {
    const res = await api.get("/integrantes");
    return res.data;
  } catch (error) {
    console.error("Error al obtener integrantes:", error);
    throw error;
  }
};

/**
 * Obtiene un integrante por ID
 * GET /situaciones/integrante/:id
 * (solo si tu backend tiene esta ruta)
 */
export const getIntegranteById = async (id) => {
  try {
    const endpoint = `/situaciones/integrante/${id}`;
    const response = await api.get(endpoint);

    console.log("Detalle del integrante:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo integrante ${id}:`, error);
    throw error;
  }
};
