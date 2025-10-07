import React from "react";
import Layout from "../components/Layout";
import HeaderHome from "../components/HeaderHome";
import "../styles/Home.css";

import appImg from "../assets/imgCarousel.jpg";
import phone from "../assets/phone.png";
import hospital from "../assets/hospitalMasGrande.png";
import doctor from "../assets/doctor.png";
import user from "../assets/usuario.png";
import pill from "../assets/medicamento.png";

export default function Home() {
  return (
    <Layout header={<HeaderHome/>}>
      {/* Carousel de imágenes */}
      <div id="carouselExampleIndicators" className="carousel slide">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={appImg} className="d-block w-100" alt="Descarga la nueva app de Medicina Integral" />
          </div>
          <div className="carousel-item">
            <img src={appImg} className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item">
            <img src={appImg} className="d-block w-100" alt="..." />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Números telefónicos */}
      <div className="numeroTelefono">
        <img src={phone} alt="Telefono" />
        <h1>Numeros telefónicos</h1>
        <div>
          <strong>Atención al cliente</strong>
          <p>5563-0121</p>
        </div>
        <div>
          <strong>Emergencias</strong>
          <p>1122-0911</p>
        </div>
        <div>
          <strong>Turnos</strong>
          <p>4522-1234</p>
        </div>
      </div>

      {/* Sobre nosotros */}
      <div className="aboutUs">
        <h1>Centros médicos de alta calidad.</h1>
        <p>Más de 20 años de experiencia cuidando de nuestros pacientes.</p>
        <div className="infoContainer">
          <div className="cardInfo">
            <img src={hospital} alt="Icono hospital" />
            <strong>100</strong>
            <p>Centros médicos en el país</p>
          </div>
          <div className="cardInfo">
            <img src={doctor} alt="Icono profesional" />
            <strong>10.000</strong>
            <p>Profesionales médicos</p>
          </div>
          <div className="cardInfo">
            <img src={user} alt="Icono paciente" />
            <strong>150.000+</strong>
            <p>Pacientes satisfechos</p>
          </div>
          <div className="cardInfo">
            <img src={pill} alt="Icono farmacia" />
            <strong>200+</strong>
            <p>Farmacias en el país</p>
          </div>
        </div>
        <button className="buttonAboutUs">Aprende más sobre nosotros</button>
      </div>
    </Layout>
  );
}
