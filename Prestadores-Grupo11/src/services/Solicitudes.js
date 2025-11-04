import api from "./Api";


// Trae todas las autorizaciones en estado "recibido", y las autorizaciones en estado "en análisis", que esten
// vinculadas al prestadorId

export const getAutorizacionesPropias = async (prestadorId) => {
  try {
    const autorizacionesRecibidas = await api.get('/autorizaciones/bandeja?estado=recibido')
    //const autorizacionesEnProceso = await api.get
    return autorizacionesRecibidas.data;
  } catch (error) {
    console.error("Error al traerse las autorizaciones", error);
    throw error;
  }
}


// Modificar el estado de una autorizacion (Capaz se puede usar esta misma para los 3 tipos de solicitud)

export const modificarEstado = async (autorizacionId, body) => {
  try {
    const res = await api.put(`/autorizaciones/estado/${autorizacionId}`, body);
    return res.data;
  } catch (error) {
    console.error("Error al cambiar el estado de la solicitud", error);
    throw error;
  }
};