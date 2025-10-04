
import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import SideBar from "../components/SideBar";
import { Users, Search, ArrowLeft } from "lucide-react";
import familiasData from "../data/familias.json";
import "./SituacionesTerapeuticas.css";

const SituacionesTerapeuticas = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("query")?.toLowerCase() || "";

  // Buscar familia por apellido, nombre o DNI
  const familiaEncontrada = familiasData.find(
    (f) =>
      f.apellido.toLowerCase().includes(query) ||
      f.integrantes.some(
        (i) =>
          i.nombre.toLowerCase().includes(query) ||
          i.dni.includes(query)
      )
  );

  if (!familiaEncontrada) {
    return (
      <Layout header={HeaderPrestadores}>
        <div className="d-flex">
          <SideBar />
          <div className="flex-grow-1 p-4 text-center">
            <button className="btn-volver mb-3" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} className="me-2" /> Volver
            </button>
            <h4>No se encontró ninguna familia con ese criterio de búsqueda.</h4>
          </div>
        </div>
      </Layout>
    );
  }

  const totalSituaciones = familiaEncontrada.integrantes.reduce(
    (acc, i) => acc + i.situaciones.length,
    0
  );
  const totalTerminadas = familiaEncontrada.integrantes.reduce(
    (acc, i) => acc + i.situaciones.filter((s) => s.estado === "Terminada").length,
    0
  );

  return (
    <Layout header={HeaderPrestadores}>
      <div className="d-flex">
        <SideBar />
        <div className="flex-grow-1 p-4">
          <button className="btn-volver mb-3" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} className="me-2" /> Volver
          </button>

          <div className="familia-card p-3 mb-4">
            <div className="d-flex align-items-center gap-3">
              <Users size={40} />
              <div>
                <h4>Familia {familiaEncontrada.apellido}</h4>
                <p>
                  Integrantes: <strong>{familiaEncontrada.integrantes.length}</strong> | Situaciones totales:{" "}
                  <strong>{totalSituaciones}</strong> | Terminadas:{" "}
                  <strong>{totalTerminadas}</strong>
                </p>
              </div>
            </div>
          </div>

          <h5 className="mb-3">Integrantes de la familia {familiaEncontrada.apellido}</h5>
          <div className="table-responsive">
            <table className="table tabla-integrantes">
              <thead>
                <tr>
                  <th>Nombre completo</th>
                  <th>Edad</th>
                  <th>DNI</th>
                  <th>Situaciones</th>
                  <th>Terminadas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {familiaEncontrada.integrantes.map((p, i) => (
                  <tr key={i}>
                    <td>
                      <Users size={18} className="me-2" />
                      {p.nombre}
                    </td>
                    <td>{p.edad}</td>
                    <td>{p.dni}</td>
                    <td>{p.situaciones.length}</td>
                    <td>{p.situaciones.filter((s) => s.estado === "Terminada").length}</td>
                    <td>
                      <button
                        className="btn-accion"
                        title="Ver detalle"
                        onClick={() => navigate(`/prestadores/detalle-situaciones/${p.dni}`)}
                      >
                        <Search size={18} />
                      </button>
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

export default SituacionesTerapeuticas;
