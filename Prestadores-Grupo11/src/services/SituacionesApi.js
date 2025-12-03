import api from "./Api";

/**
 * Obtiene todas las situaciones de un afiliado según el prestador y nro/apellido
 * GET /situaciones/:prestadorId/Afiliado/:nroOApellido
 */
export const getSituacionesByNroOApellidoAfiliado = async (
  prestadorId,
  nroOApellido,
  signal
) => {
  try {
    const res = await api.get(
      `/situaciones/${prestadorId}/Afiliado/${nroOApellido}`,
      {
        signal,
      }
    );
    return res.data;
  } catch (error) {
    if (error.name === "CanceledError" || error.name === "AbortError")
      throw error;
    console.error(
      `Error al obtener situaciones del afiliado ${nroOApellido}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Obtiene todas las situaciones de un afiliado por ID
 * GET /situaciones/:prestadorId/Afiliado/:idAfiliado
 */
export const getSituacionesByAfiliadoId = async (
  prestadorId,
  afiliadoId,
  signal
) => {
  try {
    const res = await api.get(
      `/situaciones/${prestadorId}/Afiliado/${afiliadoId}`,
      {
        signal,
      }
    );
    return res.data; // devuelve objeto completo (info del paciente + situaciones)
  } catch (error) {
    if (error.name === "CanceledError" || error.name === "AbortError")
      throw error;
    console.error(
      `Error al obtener situaciones del afiliado ${afiliadoId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Obtiene todas las situaciones de un integrante
 * GET /situaciones/Integrante/:idIntegrante
 */
export const getSituacionesByIntegranteId = async (integranteId, signal) => {
  try {
    const res = await api.get(`/situaciones/Integrante/${integranteId}`, {
      signal,
    });
    return res.data; // devuelve array de situaciones o {situaciones: [...]} según backend
  } catch (error) {
    if (error.name === "CanceledError" || error.name === "AbortError")
      throw error;
    console.error(
      `Error al traerse las situaciones del integrante ${integranteId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};


/**
 * Obtiene todas las situaciones de un integrante
 * GET /situaciones/Integrante/:idIntegrante
 */
export const getSituacionesDePrestadorByIntegranteId = async (prestadorId, integranteId, signal) => {
  try {
    const res = await api.get(`/situaciones/Integrante/${integranteId}`, {
      signal,
    });
    const integrante = res.data

    const situacionesFiltradas = (integrante.situaciones || []).filter(
      (s) => s.prestadorId === prestadorId
    );
    
    return {
      ...integrante,
      situaciones: situacionesFiltradas,
    };
  } catch (error) {
    if (error.name === "CanceledError" || error.name === "AbortError")
      throw error;
    console.error(
      `Error al traerse las situaciones del integrante ${integranteId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};


/**
 * Obtiene todas las situaciones de un paciente (Afiliado o Integrante)
 * GET /situaciones/:tipoPaciente/:idIntegrante
 */
export const getSituacionesByPacienteId = async (pacienteId, tipoPaciente) => {
  try {
    const res = await api.get(`/situaciones/${tipoPaciente}/${pacienteId}`);
    return res.data?.situaciones || [];
  } catch (error) {
    console.error("Error al traerse las situaciones del paciente:", error);
    throw error;
  }
}

/**
 * Crea una nueva situación terapéutica
 * @param {string|number} prestadorId - ID del prestador logueado
 * @param {object} datos - Objeto con datos de la situación
 * @returns {Promise<object>} - Retorna la situación creada
 */
export const crearSituacion = async (prestadorId, datos) => {
  if (!prestadorId) throw new Error("Falta el prestadorId");

  // Validaciones mínimas
  if (!datos.afiliadoId && !datos.integranteId)
    throw new Error("Falta el afiliadoId o integranteId");
  if (!datos.fecha_inicio && !datos.fecha)
    throw new Error("Falta la fecha de inicio");

  console.log("EL PAYLOAD:", datos)
  try {
    const payload = {
      ...datos,
      estado: datos.estado || "alta",
    };

    // Enviar siempre con el prestadorId en la URL
    const res = await api.post(`/situaciones/${prestadorId}`, payload);

    return res.data;
  } catch (error) {
    console.error("Error en crearSituacion:", error.response || error);
    throw error;
  }
};

/**
 * Actualizar una situación existente
 * PUT /situaciones/:id
 */
export const actualizarSituacion = async (id, datos) => {
  try {
    const res = await api.put(`/situaciones/${id}`, datos);
    return res.data || { success: true, id, ...datos };
  } catch (error) {
    console.error(
      `Error al actualizar situación ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Archivar (dar de baja) una situación terapéutica
 * PATCH /situaciones/:id
 * Solo acepta estado: "baja"
 */
export const archivarSituacion = async (id) => {
  try {
    //  el backend exige estado = "baja"
    const res = await api.patch(`/situaciones/${id}`, { estado: "baja" });
    return res.data;
  } catch (error) {
    console.error(
      `Error al archivar situación ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};