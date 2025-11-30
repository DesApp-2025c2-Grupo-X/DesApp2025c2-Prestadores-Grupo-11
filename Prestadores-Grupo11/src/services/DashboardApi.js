
import api from "./Api";


export default {
  getKpis() {
    return api.get("/dashboard/kpis").then((r) => r.data);
  },
  getSemanal() {
    return api.get("/dashboard/semanal").then((r) => r.data);
  },
  getMensual() {
    return api.get("/dashboard/mensual").then((r) => r.data);
  },
  getAnual() {
    return api.get("/dashboard/anual").then((r) => r.data);
  },
  getRegistros() {
    return api.get("/dashboard/registros").then((r) => r.data);
  },
  getFiltrado(periodo = "semana", estado = "todos") {
    return api
      .get("/dashboard/filtrado", { params: { periodo, estado } })
      .then((r) => r.data);
  },
};