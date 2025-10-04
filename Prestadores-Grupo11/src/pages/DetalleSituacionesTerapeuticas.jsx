import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import SideBar from "../components/SideBar";
import { ArrowLeft, ClipboardList } from "lucide-react";
import familiasData from "../data/familias.json";
import "./DetalleSituacionesTerapeuticas.css";

const DetalleSituacionesTerapeuticas = () => {
  const { dni } = useParams();
  const navigate = useNavigate();

  // Buscar el paciente dentro del JSON
  const paciente = familiasData
    .flatMap((familia) => familia.integrantes)
    .find((p) => p.dni === dni);

  if (!paciente) {
    return (
      <Layout header={HeaderPrestadores}>
        <div className="d-flex">
          <SideBar />
          <div className="flex-grow-1 p-4 text-center">
            <p>No se encontraron datos del paciente con DNI {dni}</p>
            <button className="btn-volver mt-3" onClick={() => navigate(-1)}>
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
          <button className="btn-volver mb-3" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} className="me-2" /> Volver
          </button>

          {/* Datos del paciente */}
          <div className="paciente-card p-3 mb-4">
            <h4>{paciente.nombre}</h4>
            <p>
              Edad: <strong>{paciente.edad}</strong> | DNI: <strong>{paciente.dni}</strong>
            </p>
          </div>

          {/* Situaciones del paciente */}
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
                {paciente.situaciones.length > 0 ? (
                  paciente.situaciones.map((s) => (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No hay situaciones registradas para este paciente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DetalleSituacionesTerapeuticas;
