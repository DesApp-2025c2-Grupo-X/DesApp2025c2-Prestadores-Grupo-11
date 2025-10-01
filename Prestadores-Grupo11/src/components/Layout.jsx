import React from "react";
import Footer from "./Footer";

const Layout = ({ header: HeaderComponent, children }) => {
  return (
    <div className="d-flex flex-column min-vh-100 overflow-hidden">
      {HeaderComponent && (
        <div className="container-fluid p-0">
          <HeaderComponent />
        </div>
      )}
      {/* Contenido de la página */}
      <main className="flex-grow-1 container-fluid overflow-auto">
        {children}
      </main>

      {/* Footer fijo */}
      <div className="container-fluid p-0">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
