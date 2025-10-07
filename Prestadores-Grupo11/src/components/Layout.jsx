import React from "react";
import Footer from "./Footer";

const Layout = ({ header, children }) => {
  return (
    <div className="d-flex flex-column min-vh-100 overflow-hidden">
      {/* Header */}
      {header && (
        <div className="container-fluid p-0">{header}</div>
      )}

      {/* Contenido principal */}
      <main className="flex-grow-1 container-fluid overflow-auto">
        {children}
      </main>

      {/* Footer */}
      <div className="container-fluid p-0">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;

