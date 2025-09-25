
import React from "react";
import Layout from "../components/Layout";
import HeaderHome from "../components/HeaderHome";

const Home = () => {
  return (
    <Layout header={HeaderHome}>
      <h1>Bienvenido a la página principal</h1>
      <p>Contenido de Home...</p>
      <Link to="/login" className="btn btn-primary mt-3">Ir Login</Link>
    </Layout>
  );
};

export default Home;
