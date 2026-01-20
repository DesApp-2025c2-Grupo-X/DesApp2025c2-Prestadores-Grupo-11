# 🩺 Frontend - Aplicación 3: Prestadores  
Desarrollo de Aplicaciones - UNaHur  

##  Descripción del Proyecto
Este repositorio corresponde al **frontend de la Aplicación 3 - Prestadores**, parte del sistema **Medicina Integral**.
Para que la aplicacion funcione correctamente, es necesario tener ejecutando tambien el backend.

Link al repositorio del backend: https://github.com/DesApp-2025c2-Grupo-X/Prestadores-Backend-Grupo11


La aplicación permite que **los prestadores médicos y centros de salud** gestionen las solicitudes y la información asociada a los **afiliados** de la empresa **Medicina Integral**.

###  Alcance de la Aplicación 3
Mediante esta aplicación, los prestadores podrán:
- Procesar **solicitudes de reintegros, autorizaciones y recetas** registradas por los afiliados.  
- Gestionar **situaciones terapéuticas** de los afiliados y sus grupos familiares.  
- Consultar y administrar los **turnos reservados**.  
- Visualizar y actualizar la **historia clínica** de los afiliados o sus familiares.

---

## ⚙️ Tecnologías utilizadas
- [Node.js](https://nodejs.org/)  

---

## Como ejecutar la aplicacion
- Paso 1:
- Paso 2:
- Paso 3:

##  Contexto general del sistema

El sistema **Medicina Integral** está compuesto por tres aplicaciones interrelacionadas:

| Aplicación | Descripción |
|-------------|--------------|
| **App 1 - Administración** | Gestión de afiliados, grupos familiares, prestadores, situaciones terapéuticas, autorizaciones, recetas y reintegros. |
| **App 2 - Afiliados** | Portal donde los afiliados pueden visualizar su información, solicitar reintegros, autorizaciones y turnos. |
| **✅ App 3 - Prestadores** | (Este backend) Aplicación destinada a médicos y centros médicos para procesar solicitudes, gestionar situaciones terapéuticas, turnos e historias clínicas. |

> ⚠️ **Importante:**  
> Los datos de prestadores, afiliados, grupos familiares, solicitudes, recetas y turnos se cargan directamente en la base de datos (ya que su gestión pertenece a las Aplicaciones 1 y 2).

---

##  Workflow de solicitudes

Cada solicitud (reintegro, autorización o receta) tiene un flujo de estados:

| Estado        | Descripción |
|----------------|--------------|
| **Recibido**   | La solicitud llega al sistema y está pendiente de revisión. |
| **En análisis** | El prestador comienza a evaluar la solicitud. Solo él puede continuar el proceso. |
| **Observado**  | Se requiere información adicional por parte del afiliado. |
| **Aprobado**   | La solicitud fue aceptada. |
| **Rechazado**  | La solicitud fue denegada (con motivo registrado). |

- Cuando una solicitud pasa a **“en análisis”**, solo el usuario que realizó este cambio puede continuar el flujo.  
- Cuando pasa a **“observado”**, el afiliado puede agregar comentarios.  
- Al **rechazar u observar**, se debe registrar un **motivo**.

---

##  Gestión de solicitudes

El sistema debe proveer al prestador una **dashboard** con las solicitudes que puede procesar.

Cada prestador puede:
- Ver **sus solicitudes pendientes o en análisis**.
- Procesar **las solicitudes observadas**.
- Acceder a un **dashboard** con estadísticas de:
  - Cantidad de solicitudes pendientes, aprobadas y rechazadas.  
  - Evolución de solicitudes procesadas por día o semana.  

---

##  Gestión de situaciones terapéuticas

El prestador puede buscar un afiliado por **número, apellido o DNI**, y luego:
- Ver las situaciones terapéuticas del grupo familiar.  
- **Dar de alta**, **modificar fecha de finalización** o **dar de baja o archivar** una situación.  

---

## 📅 Consulta y gestión de turnos

- Los prestadores ven un **calendario de turnos** solicitados por los afiliados.  
- Los centros médicos pueden filtrar por especialidad.  
- El prestador puede agregar **notas** asociadas a un turno, las cuales se incorporan a la **historia clínica** del paciente.  

---

## 📖 Consulta de historias clínicas

- El prestador puede buscar un afiliado o integrante del grupo familiar y visualizar su **historia clínica**.  
- Se puede filtrar para mostrar solo las **notas tomadas por el prestador actual** o **todas** las registradas.
