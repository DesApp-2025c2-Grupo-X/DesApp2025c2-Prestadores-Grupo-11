import api from "./Api";

export const getHistoriaClinicaByAfiliado = async (afiliadoId) => {
  const { data } = await api.get(`/historiaClinica/${afiliadoId}`);
  return data;
};

export const addNotaAHistoriaClinica = async (afiliadoId, nota) => {
  const { data } = await api.post(`/historiaClinica/${afiliadoId}/notas`, { nota });
  return data;
};
