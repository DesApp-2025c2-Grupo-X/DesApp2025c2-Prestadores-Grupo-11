
import api from "./Api";

const request = async (url, params = {}) => {
  const res = await api.get(url, { params });
  return res.data;
};

export const getKpis = () => request("/dashboard/kpis");

export const getSemanal = () => request("/dashboard/semanal");

export const getMensual = () => request("/dashboard/mensual");

export const getAnual = () => request("/dashboard/anual");

export const getRegistros = () => request("/dashboard/registros");

export const getFiltrado = ({ periodo = "semana", estado = "todos", desde, hasta }) => {
  const params = { periodo, estado };

  if (desde) params.desde = desde;
  if (hasta) params.hasta = hasta;

  return api.get("/dashboard/filtrado", { params }).then((r) => r.data);
};

export default {
  getKpis,
  getSemanal,
  getMensual,
  getAnual,
  getRegistros,
  getFiltrado,
};
