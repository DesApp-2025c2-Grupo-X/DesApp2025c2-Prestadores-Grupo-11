import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import SideBar from "../components/SideBar";
import { ArrowLeft, ClipboardList } from "lucide-react";
import "./DetalleSituacionesTerapeuticas.css";

const DetalleSituacionesTerapeuticas = () => {
  const { dni } = useParams();
  const navigate = useNavigate();

  // 🔹 Datos de ejemplo (esto luego se puede traer de un backend)
  const pacientes = [
    {
      nombre: "Juancito Perez",
      edad: 35,
      dni: "25097345",
      situaciones: [
        { id: 1, titulo: "Terapia Cognitiva", estado: "En proceso" },
        { id: 2, titulo: "Sesiones Familiares", estado: "Terminada" },
        { id: 3, titulo: "Apoyo Escolar", estado: "Terminada" },
      ],
    },
    {
      nombre: "Maria Perez",
      edad: 33,
      dni: "23001224",
      situaciones: [
        { id: 1, titulo: "Tratamiento Ansiedad", estado: "Terminada" },
        { id: 2, titulo: "Terapia de Pareja", estado: "Terminada" },
      ],
    },
  ];

  const paciente = pacientes.find((p) => p.dni === dni);

  if (!paciente) {
    return (
      <Layout header={HeaderPrestadores}>
        <div className="d-flex">
          <SideBar />
          <div className="flex-grow-1 p-4">
            <p>No se encontraron datos del paciente con DNI {dni}</p>
            <button className="btn-volver" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} className="me-2" /> Volver
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout header={HeaderPrestadores}>
      <div className="d-flex">
        <SideBar />

        <div className="flex-grow-1 p-4">
          {/* Botón volver */}
          <button className="btn-volver mb-3" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} className="me-2" /> Volver
          </button>

          {/* Datos del paciente */}
          <div className="paciente-card p-3 mb-4">
            <h4>{paciente.nombre}</h4>
            <p>
              Edad: <strong>{paciente.edad}</strong> | DNI:{" "}
              <strong>{paciente.dni}</strong>
            </p>
          </div>

          {/* Lista de situaciones */}
          <h5 className="mb-3">Situaciones Terapéuticas</h5>
          <div className="table-responsive">
            <table className="table tabla-situaciones">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Situación</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {paciente.situaciones.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>
                      <ClipboardList size={18} className="me-2" />
                      {s.titulo}
                    </td>
                    <td
                      className={
                        s.estado === "Terminada" ? "estado-terminada" : "estado-proceso"
                      }
                    >
                      {s.estado}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DetalleSituacionesTerapeuticas;
