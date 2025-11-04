import api from "./Api";

/**
 * Busca afiliados (con integrantes y situaciones)
 * por número de afiliado o apellido, filtrados por prestador.
 * GET /situaciones/:prestadorId/Afiliado/:nroOApellido
 */
export const getIntegrantes = async (prestadorId, valorBusqueda) => {
  try {
    const q = (valorBusqueda || "").trim();

    if (!prestadorId) throw new Error("Falta el ID del prestador.");
    if (!q) throw new Error("Debe ingresar un valor de búsqueda.");

    // ✅ la ruta CORRECTA incluye /Afiliado/
    const res = await api.get(
      `/situaciones/${prestadorId}/Afiliado/${encodeURIComponent(q)}`
    );

    if (!res.data) return [];

    if (Array.isArray(res.data)) return res.data;
    if (res.data.afiliado) return [res.data.afiliado];
    if (res.data.integrantes) return res.data.integrantes;
    return [res.data];
  } catch (error) {
    console.error("Error al obtener integrantes:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
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
