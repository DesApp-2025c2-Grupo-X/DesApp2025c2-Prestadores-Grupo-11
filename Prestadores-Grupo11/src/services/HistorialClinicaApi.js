import api from "./Api";

export const getHistoriaClinicaByAfiliado = async (afiliadoId) => {
  const { data } = await api.get(`/historiaClinica/${afiliadoId}`);
  return data;
};

export const addNotaAHistoriaClinica = async (afiliadoId, nota) => {
  const { data } = await api.post(`/historiaClinica/${afiliadoId}/notas`, { nota });
  return data;
};


// Obtiene el historial clinico del paciente, situaciones terapeuticas en estado "baja" y "en proceso", y turnos que
// hayan sucedido, o que tengan una nota asociada.
// Recibe el id (afiliadoId, integranteId), y el tipo de paciente (Afiliado/Integrante), como tambien el filtro escogido
// y la fecha de inicio y de fin si se desea filtrar por fecha

export const getHistorialClinicoById = async (pacienteId, tipoPaciente, filtro, fechaInicio, fechaFin) => {

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

    //Se hace el filtrado entre un periodo de fechas.
    const inicio = fechaInicio ? new Date(fechaInicio) : null;
    const fin = fechaFin ? new Date(fechaFin) : null;

    const dentroDeRango = (f) => {
      const fecha = new Date(f);
      if (inicio && fecha < inicio) return false;
      if (fin && fecha > fin) return false;
      return true;
    };

    const situacionesPorFecha = situacionesOrdenadas.filter(s => dentroDeRango(s.fecha));
    const turnosPorFecha = turnosOrdenados.filter(t => dentroDeRango(t.fecha));

    // Comprobacion de filtro
    if (filtro === "notas") {
      const turnosEncontrados = turnosPorFecha.filter(turno => turno.notas)
      //const turnosEncontrados = await api.get(`/turnos/prestador/${user.id}/${pacienteId}`)
      // const turnosFormato = turnosEncontrados.data.map(t => ({
      //   tipo: "Turno",
      //   fecha: t.date,
      //   especialidad: t.prestador?.especialidades[0] || "",
      //   medico: t.prestador?.username || "",
      //   notas: t.notes || "",
      //   duration: t.duration,
      //   estado: null
      // }))
      // console.log("Turnos formateados",)
      return (turnosEncontrados);

    } else if (filtro === "situaciones") {
      return (situacionesPorFecha)

    } else if (filtro === "situacionesActivas") {
      return situacionesPorFecha.filter(situ => situ.estado === "en proceso")

    } else if (filtro === "situacionesFinalizadas") {
      return situacionesPorFecha.filter(situ => situ.estado === "baja")

    }

    //Transformo el nombre de los atributos de situaciones y turnos, para que
    //sea mas facil mostrarlos en la tabla.
    const unificados = [
      ...situacionesPorFecha,
      ...turnosPorFecha
    ];

    const ordenadosPorFecha = unificados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    return (ordenadosPorFecha)

  } catch (error) {
    console.error("Hubo un error al buscar las consultas", error)
  }
}