
import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer text-white py-5">
      <div className="container">
        <div className="row align-items-start">
          {/* Logo */}
          <div className="col-md-2 mb-4 mb-md-0 text-center text-md-start">
            <img
              src="/Medicina_integralLogo.jpg"
              alt="Medicina Integral"
              className="footer-logo img-fluid"
            />
          </div>

          {/* Quiénes Somos */}
          <div className="col-md-2 mb-4 mb-md-0">
            <h6>Quiénes Somos</h6>
            <ul className="list-unstyled">
              <li><a href="#">Nuestra Historia</a></li>
              <li><a href="#">Equipo Médico</a></li>
              <li><a href="#">Staff</a></li>
            </ul>
          </div>

          {/* Sanatorios */}
          <div className="col-md-2 mb-4 mb-md-0">
            <h6>Sanatorios</h6>
            <ul className="list-unstyled">
              <li><a href="#">Sanatorios Propios</a></li>
              <li><a href="#">Centros Médicos</a></li>
              <li><a href="#">Centros de Vacunación</a></li>
            </ul>
          </div>

          {/* Planes de Salud */}
          <div className="col-md-2 mb-4 mb-md-0">
            <h6>Planes de Salud</h6>
            <ul className="list-unstyled">
              <li><a href="#">Plan 200 - 220</a></li>
              <li><a href="#">Plan 300 - 330</a></li>
              <li><a href="#">Plan 400 - 440</a></li>
              <li><a href="#">Plan 550</a></li>
            </ul>
          </div>

          {/* Servicios */}
          <div className="col-md-2 mb-4 mb-md-0">
            <h6>Servicios</h6>
            <ul className="list-unstyled">
              <li><a href="#">Club de Beneficios</a></li>
              <li><a href="#">Salud Mental</a></li>
              <li><a href="#">Servicios Digitales</a></li>
              <li><a href="#">Cobertura Médica</a></li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div className="col-md-2 mb-4 mb-md-0">
            <h6>Seguinos</h6>
            <div className="d-flex d-md-block justify-content-center">
              <a href="#" className="social-link me-3">
                <FaInstagram />
              </a>
              <a href="#" className="social-link me-3">
                <FaFacebook />
              </a>
              <a href="#" className="social-link">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        {/* Línea inferior */}
        <hr className="my-4" />

        <div className="text-center small">
          <p>
            Solicitud de Baja | Solicitud de Arrepentimiento | Contrato de
            Adhesión | Libro de Quejas
          </p>
          <p className="mb-0">
            Medicina Integral S.A. | Dirección: Av. Salud 123, CABA | CUIT
            30-12345678-9 <br />
            Superintendencia de Servicios de Salud – Teléfono gratuito:
            0800-222-SALUD (72583) <br />
            Ley 26.682 – Derechos Reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
