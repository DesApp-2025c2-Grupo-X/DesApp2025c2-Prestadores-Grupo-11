import React from "react";
import Footer from "./Footer";

const Layout = ({ header: HeaderComponent, children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header dinámico */}
      {HeaderComponent && <HeaderComponent />}

      {/* Contenido de la página */}
      <main className="flex-grow-1 container my-4">
        {children}
      </main>

      {/* Footer fijo */}
      <Footer />
    </div>
  );
};

export default Layout;
