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

export const getHistorialClinicoById = async (pacienteId, tipoPaciente, filtroNotas = false) => {

  const storedUser = JSON.parse(localStorage.getItem("miapp_user") || "null");
  const user = storedUser;

  if (!pacienteId) return; // Si no hay paciente, no hace nada

  try {
    const situacionesEncontradas = await getSituacionesByPacienteId(pacienteId, tipoPaciente);
    const situacionesDeBaja = situacionesEncontradas.filter((situacion) => situacion.estado === "baja")

    let turnosEncontrados = await getTurnosByPacienteId(pacienteId, tipoPaciente);

    if (filtroNotas) {
      turnosEncontrados = turnosEncontrados.filter(turno => turno.notes && turno.prestadorId == user?.id)

      const turnosFiltrados = turnosEncontrados.map((t) => ({
        tipo: "Turno",
        fecha: t.date,
        descripcion: t.descripción,
        especialidad: t.prestador?.especialidad || "",
        medico: t.prestador?.username || "",
        notas: t.notes || "",
      }));

      const ordenadosPorFecha = turnosFiltrados.sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );

      //setConsultas(ordenadosPorFecha);
      return(ordenadosPorFecha);

    }

    const ahora = new Date();
    const turnosResult = turnosEncontrados.filter(turno => {
      const fechaTurno = new Date(turno.date);
      const turnoFinalizado = fechaTurno.getTime() < ahora.getTime();
      const turnoNotas = turno.notes && turno.notes.trim() !== "";

      return turnoFinalizado || turnoNotas
    });

    //Transformo el nombre de los atributos de situaciones y turnos, para que
    //sea mas facil mostrarlos en la tabla.
    const unificados = [
      ...situacionesDeBaja.map(s => ({
        tipo: "Situacion terapeutica",
        fecha: s.fecha_final,
        descripcion: s.observaciones,
        especialidad: s.especialidad,
        medico: s.prestador.username,
        notas: ""
      })),
      ...turnosResult.map(t => ({
        tipo: "Turno",
        fecha: t.date,
        descripcion: t.descripción,
        especialidad: t.prestador?.especialidad || "",
        medico: t.prestador?.username || "",
        notas: t.notes || ""
      }))
    ];

    const ordenadosPorFecha = unificados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    //setConsultas(ordenadosPorFecha);
    return(ordenadosPorFecha)

  } catch (error) {
    console.error("Hubo un error al buscar las consultas", error)
  }
}