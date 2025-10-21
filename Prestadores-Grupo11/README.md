# 🩺 Frontend - Aplicación 3: Prestadores  
Desarrollo de Aplicaciones - UNaHur  

## 📋 Descripción del Proyecto
Este repositorio contiene el **frontend** de la **Aplicación 3 – Prestadores**, parte del sistema **Medicina Integral**.

La aplicación está destinada a los **prestadores médicos y centros de salud**, permitiendo gestionar solicitudes y acceder a la información de los **afiliados** de Medicina Integral.

###  Alcance funcional
Desde esta aplicación, los prestadores podrán:
- Visualizar y procesar **solicitudes de reintegros, autorizaciones y recetas**.  
- Gestionar **situaciones terapéuticas** de afiliados y su grupo familiar.  
- Consultar **turnos asignados** y registrar **notas clínicas**.  
- Acceder y consultar la **historia clínica** de afiliados o miembros del grupo familiar.  

> ⚠️ Los datos de afiliados, prestadores, solicitudes y turnos se cargan directamente en la base de datos (Aplicaciones 1 y 2).

---

##  Workflow de solicitudes

Cada solicitud pasa por los siguientes estados:
| Estado | Descripción |
|---------|--------------|
| **Recibido** | Solicitud registrada y pendiente de análisis. |
| **En análisis** | El prestador comenzó la evaluación. |
| **Observado** | Se requiere información adicional del afiliado. |
| **Aprobado** | Solicitud aceptada. |
| **Rechazado** | Solicitud denegada, con motivo documentado. |

---

## ⚙️ Tecnologías utilizadas
- [React](https://react.dev/)  
- [Vite](https://vitejs.dev/)  
- [Bootstrap 5](https://getbootstrap.com/)  
- [Node.js](https://nodejs.org/) (entorno de ejecución)  
- [React Router DOM](https://reactrouter.com/)  
- [React Icons](https://react-icons.github.io/react-icons/)  
- [SweetAlert2](https://sweetalert2.github.io/)  

---

## 🧱 Estructura del proyecto
