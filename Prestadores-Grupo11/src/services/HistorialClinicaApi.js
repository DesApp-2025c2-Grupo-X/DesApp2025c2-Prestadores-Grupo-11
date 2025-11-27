import api from "./Api";
import { getSituacionesByPacienteId } from "./SituacionesApi";
import { getTurnosByPacienteId } from "./TurnosApi";

export const getHistoriaClinicaByAfiliado = async (afiliadoId) => {
  const { data } = await api.get(`/historiaClinica/${afiliadoId}`);
  return data;
};

export const addNotaAHistoriaClinica = async (afiliadoId, nota) => {
  const { data } = await api.post(`/historiaClinica/${afiliadoId}/notas`, { nota });
  return data;
};


// Obtiene el historial clinico del paciente, situaciones terapeuticas en estado "baja" y turnos que
// hayan sucedido, o que tengan una nota asociada.
// Recibe el id (afiliadoId, integranteId), y el tipo de paciente (Afiliado/Integrante)

export const getHistorialClinicoById = async (pacienteId, tipoPaciente, filtro) => {

  if (!pacienteId) return; // Si no hay paciente, no hace nada

  try {

    const historialCompleto = await api.get(`/turnos/historial/${tipoPaciente}/${pacienteId}`)

    const situaciones = historialCompleto.data.situaciones
    const situacionesFormato = situaciones.map(s => ({
      tipo: `Situacion terapeutica Estado: ${s.estado}`,
      fecha: s.fecha_final,
      notas: s.observaciones,
      especialidad: s.especialidad,
      medico: s.prestador.username,
      duration: null,
      estado: s.estado
    }))
    const situacionesOrdenadas = situacionesFormato.sort(
      (a, b) => new Date(b.fecha) - new Date(a.fecha)
    );

    const turnos = historialCompleto.data.turnos
    const turnosFormato = turnos.map(t => ({
      tipo: "Turno",
      fecha: t.date,
      especialidad: t.prestador?.especialidades[0] || "",
      medico: t.prestador?.username || "",
      notas: t.notes || "",
      duration: t.duration,
      estado: null
    }))
    const turnosOrdenados = turnosFormato.sort(
      (a, b) => new Date(b.fecha) - new Date(a.fecha)
    );

    // Comprobacion de filtro
    if (filtro === "notas") {
      const turnosEncontrados = turnosOrdenados.filter(turno => turno.notas)
      return (turnosEncontrados);
    } else if (filtro === "situaciones") {
      return (situacionesOrdenadas)
    } else if (filtro === "situacionesActivas") {
      const situacionesFiltradas = situacionesOrdenadas.filter(situ => situ.estado === "en proceso")
      return (situacionesFiltradas)
    } else if (filtro === "situacionesFinalizadas") {
      const situacionesFiltradas = situacionesOrdenadas.filter(situ => situ.estado === "baja")
      return (situacionesFiltradas)
    }

    //Transformo el nombre de los atributos de situaciones y turnos, para que
    //sea mas facil mostrarlos en la tabla.
    const unificados = [
      ...situacionesFormato,
      ...turnosFormato
    ];

    const ordenadosPorFecha = unificados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    return (ordenadosPorFecha)

  } catch (error) {
    console.error("Hubo un error al buscar las consultas", error)
  }
}