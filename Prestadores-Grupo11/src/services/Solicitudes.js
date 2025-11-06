import api from "./Api";


// Trae todas las autorizaciones en estado "recibido", y las autorizaciones en estado "en análisis", que esten
// vinculadas al prestadorId

export const getAutorizacionesPropias = async (prestadorId) => {
  try {
    const autorizacionesRecibidas = await api.get('/autorizaciones/bandeja?estado=recibido')
    const autorizacionesEnAnalisis = await api.get(`/pendientes/${prestadorId}`)

    // Unifica los arrays
    const unificado = [
      ...autorizacionesRecibidas.data,
      ...(autorizacionesEnAnalisis.data?.autorizaciones ?? [])
    ];

    return unificado;
  } catch (error) {
    console.error("Error al traerse las autorizaciones", error);
    throw error;
  }
}

// Trae todos los reintegros en estado "recibido", y los reintegros en estado "en análisis", que esten
// vinculadas al prestadorId

export const getReintegrosPropias = async (prestadorId) => {
  try {
    const reintegrosRecibidos = await api.get('/reintegros/estado?estado=recibido')
    const reintegrosEnAnalisis = await api.get(`/pendientes/${prestadorId}`)

    // Unifica los arrays
    const unificado = [
      ...reintegrosRecibidos.data,
      ...(reintegrosEnAnalisis.data?.reintegros ?? [])
    ];

    return unificado;
  } catch (error) {
    console.error("Error al traerse los reintegros", error);
    throw error;
  }
}

// Trae todas las recetas en estado "recibido", y las recetas en estado "en análisis", que esten
// vinculadas al prestadorId

export const getRecetasPropias = async (prestadorId) => {
  try {
    const recetasRecibidas = await api.get('/recetas/estado?estado=recibido')
    const recetasEnAnalisis = await api.get(`/pendientes/${prestadorId}`)

    // Unifica los arrays
    const unificado = [
      ...recetasRecibidas.data,
      ...(recetasEnAnalisis.data?.recetas ?? [])
    ];

    return unificado;
  } catch (error) {
    console.error("Error al traerse las recetas", error);
    throw error;
  }
}

// Devuelve todas las autorizaciones del prestador **prestadorId** en analisis

export const getAutorizacionesPropiasAnalisis = async (prestadorId) => {
  try {
    const autorizacionesEnAnalisis = await api.get(`/pendientes/${prestadorId}`)
    return autorizacionesEnAnalisis.data.autorizaciones;
  } catch (error) {
    console.error("Error al traerse las autorizaciones", error);
    throw error;
  }
}

// Devuelve todas las recetas del prestador **prestadorId** en analisis

export const getRecetasPropiasAnalisis = async (prestadorId) => {
  try {
    const recetasEnAnalisis = await api.get(`/pendientes/${prestadorId}`)
    return recetasEnAnalisis.data.recetas;
  } catch (error) {
    console.error("Error al traerse las recetas", error);
    throw error;
  }
}

export const getReintegrosPropiasAnalisis = async (prestadorId) => {
  try {
    const reintegrosEnAnalisis = await api.get(`/pendientes/${prestadorId}`)
    return reintegrosEnAnalisis.data.reintegros;
  } catch (error) {
    console.error("Error al traerse los reintegros", error);
    throw error;
  }
}


// Modificar el estado de una autorizacion

export const cambiarEstadoAutorizacion = async (autorizacionId, body) => {
  try {
    const res = await api.put(`/autorizaciones/estado/${autorizacionId}`, body);
    return res.data;
  } catch (error) {
    console.error("Error al cambiar el estado de la solicitud", error);
    throw error;
  }
};


// Modificar el estado de una receta

export const cambiarEstadoReceta = async (recetaId, body) => {
  try {
    const res = await api.put(`/recetas/${recetaId}/estado`, body);
    return res.data;
  } catch (error) {
    console.error("Error al cambiar el estado de la solicitud", error);
    throw error;
  }
};


// Modificar el estado de una reintegro

export const cambiarEstadoReintegro = async (reintegroId, body) => {
  try {
    const res = await api.put(`/reintegros/${reintegroId}/estado`, body);
    return res.data;
  } catch (error) {
    console.error("Error al cambiar el estado de la solicitud", error);
    throw error;
  }
};


//BORRAR

export const modificarEstado = () => {return hola}

// Obtiene la cantidad de solicitudes en estado "En analisis", del prestador **idPrestador**

export const cantSolicitudesAnalisisApi = async (prestadorId) => {
  try {
    const res = await api.get(`/pendientes/${prestadorId}`)
    const cant =  res.data.autorizaciones.length +
                  res.data.recetas.length +
                  res.data.reintegros.length;
    return cant;
  } catch (error) {
    console.log("Error al traerse la cantida de solicitudes en analisis", error)
    throw error
  }
}


// Obtiene la cantidad de solicitudes resueltas en el dia

export const cantSolicitudesDiaApi = async () => {
  try {
    const resAutor = await api.get("/autorizaciones/dashboard")
    const resRecet = await api.get("/recetas/dashboard/")
    const resReint = await api.get("/reintegros/dashboard")

    const cantAutor = resAutor.data.diario.length
    const cantRecet = resRecet.data.diario.length
    const cantReint = resReint.data.diario.length

    const total = cantAutor + cantRecet + cantReint

    return total

  } catch (error) {
    console.log("Error al traerse la cantida de solicitudes resueltas en el dia", error)
    throw error
  }
}


// Obtiene la cantidad de solicitudes resueltas en la semana

export const cantSolicitudesSemanaApi = async () => {
  try {
    const resAutor = await api.get("/autorizaciones/dashboard")
    const resRecet = await api.get("/recetas/dashboard/")
    const resReint = await api.get("/reintegros/dashboard")

    const cantAutor = resAutor.data.semanal.length
    const cantRecet = resRecet.data.semanal.length
    const cantReint = resReint.data.semanal.length

    const total = cantAutor + cantRecet + cantReint

    return total

  } catch (error) {
    console.log("Error al traerse la cantida de solicitudes resueltas en la semana", error)
    throw error
  }
}

//Trae todas las solicitudes del tipo **tipoSolicitud**
export const getSolicitudesByTipo = async (tipoSolicitud, prestadorId) => {
  try {

    let res;
    switch (tipoSolicitud) {
      case "autorizaciones":
        res = await getAutorizacionesPropias(prestadorId);
        break;
      case "recetas":
        res = await getRecetasPropias(prestadorId);
        break;
      case "reintegros":
        res = await getReintegrosPropias(prestadorId);
        break;
      default:
        throw new Error(`Tipo de solicitud no válido: ${tipoSolicitud}`);
    }

    return Array.isArray(res) ? res : [];
  } catch (error) {
    console.error(`Error al obtener ${tipoSolicitud}:`, error);
    return [];
  }
};