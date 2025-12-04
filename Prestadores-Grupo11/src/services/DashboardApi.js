import api from "./Api";

// Utilidad para GET con params
const request = async (url, params = {}) => {
  try {
    const res = await api.get(url, { params });
    return res.data;
  } catch (error) {
    throw formatError(error);
  }
};

// Formateo único de errores
const formatError = (error) => {
  let msg = "Error obteniendo datos";

  if (error?.response?.data?.error) msg = error.response.data.error;
  if (error?.message) msg = error.message;

  return { message: msg };
};

// ENDPOINTS SIMPLES GET
export const getKpis      = () => request("/dashboard/kpis");
export const getSemanal   = () => request("/dashboard/semanal");
export const getMensual   = () => request("/dashboard/mensual");
export const getAnual     = () => request("/dashboard/anual");
export const getRegistros = () => request("/dashboard/registros");

// GET /dashboard/filtrado
/**
 * @param {Object} params
 * @param {string} params.desde  - Fecha YYYY-MM-DD
 * @param {string} params.hasta  - Fecha YYYY-MM-DD
 * @param {string} [params.estado="todos"]
 */
export const getFiltrado = ({ estado = "todos", desde, hasta }) => {
  const hoy = new Date().toISOString().split("T")[0];
  const desdeDefault = "2025-01-01";

  return api
    .get("/dashboard/filtrado", {
      params: {
        estado,
        desde: desde || desdeDefault,
        hasta: hasta || hoy,
        t: Date.now(),
      },
      headers: { "Cache-Control": "no-cache" },
    })
    .then((res) => res.data)
    .catch((error) => Promise.reject(formatError(error)));
};


export default {
  getKpis,
  getSemanal,
  getMensual,
  getAnual,
  getRegistros,
  getFiltrado,
};