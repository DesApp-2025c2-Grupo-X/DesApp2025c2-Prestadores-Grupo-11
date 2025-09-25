import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer text-white">
      <div className="container py-5">
        <div className="row">
          {/* Logo */}
          <div className="col-md-3 mb-4 text-center text-md-start">
            <img
              src="/Medicina_Integral_Logo.png" // logo en /public
              alt="Medicina Integral"
              className="footer-logo mb-3"
            />
          </div>

          {/* Secciones */}
          <div className="col-md-9">
            <div className="row">
              <div className="col-6 col-md-3 mb-3">
                <h6 className="fw-bold">Quiénes Somos</h6>
                <ul className="list-unstyled">
                  <li><a href="#historia">Nuestra Historia</a></li>
                  <li><a href="#equipo">Equipo Médico</a></li>
                  <li><a href="#staff">Staff</a></li>
                </ul>
              </div>

              <div className="col-6 col-md-3 mb-3">
                <h6 className="fw-bold">Sanatorios</h6>
                <ul className="list-unstyled">
                  <li><a href="#propios">Sanatorios Propios</a></li>
                  <li><a href="#medicos">Centros Médicos</a></li>
                  <li><a href="#vacunacion">Centros de Vacunación</a></li>
                </ul>
              </div>

              <div className="col-6 col-md-3 mb-3">
                <h6 className="fw-bold">Planes de Salud</h6>
                <ul className="list-unstyled">
                  <li><a href="#planes200">Plan 200 - 220</a></li>
                  <li><a href="#planes300">Plan 300 - 330</a></li>
                  <li><a href="#planes400">Plan 400 - 440</a></li>
                  <li><a href="#plan550">Plan 550</a></li>
                </ul>
              </div>

              <div className="col-6 col-md-3 mb-3">
                <h6 className="fw-bold">Servicios</h6>
                <ul className="list-unstyled">
                  <li><a href="#beneficios">Club de Beneficios</a></li>
                  <li><a href="#saludmental">Salud Mental</a></li>
                  <li><a href="#digitales">Servicios Digitales</a></li>
                  <li><a href="#cobertura">Cobertura Médica</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <hr className="mt-4 mb-3" />

        {/* Links legales */}
        <div className="row">
          <div className="col-md-8 text-center text-md-start mb-3 mb-md-0">
            <ul className="list-inline small mb-0">
              <li className="list-inline-item"><a href="#baja">Solicitud de Baja</a></li>
              <li className="list-inline-item">|</li>
              <li className="list-inline-item"><a href="#arrepentimiento">Solicitud de Arrepentimiento</a></li>
              <li className="list-inline-item">|</li>
              <li className="list-inline-item"><a href="#contrato">Contrato de Adhesión</a></li>
              <li className="list-inline-item">|</li>
              <li className="list-inline-item"><a href="#libro">Libro de Quejas</a></li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div className="col-md-4 text-center text-md-end">
            <a href="#instagram" className="me-3 social-link">📷</a>
            <a href="#facebook" className="me-3 social-link">👍</a>
            <a href="#linkedin" className="social-link">💼</a>
          </div>
        </div>

        {/* Datos legales */}
        <div className="row mt-3">
          <div className="col text-center small">
            Medicina Integral S.A. | Dirección: Av. Salud 123, CABA | CUIT 30-12345678-9 <br />
            Superintendencia de Servicios de Salud - Teléfono gratuito: 0800-222-SALUD (72583) <br />
            Ley 26.682 - Derechos Reservados
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
