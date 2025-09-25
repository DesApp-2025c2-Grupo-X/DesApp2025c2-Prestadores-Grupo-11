
import React from "react";
import Layout from "../components/Layout";
import HeaderHome from "../components/HeaderHome";
import { Link } from "react-router-dom";
import "./Home.css"
import appImg from "../assets/imgCarousel.jpg"
import phone from "../assets/phone.png"
import hospital from "../assets/hospitalMasGrande.png"
import doctor from "../assets/doctor.png"
import user from "../assets/usuario.png"
import pill from "../assets/medicamento.png"

const Home = () => {
  return (
    <Layout header={HeaderHome}>
      {/*Carousel de imagenes*/}
      <div id="carouselExampleIndicators" class="carousel slide">
        <div class="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src={appImg} class="d-block w-100" alt="Descarga la nueva app de Medicina Integral" />
          </div>
          <div class="carousel-item">
            <img src={appImg} class="d-block w-100" alt="..." />
          </div>
          <div class="carousel-item">
            <img src={appImg} class="d-block w-100" alt="..." />
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
      {/*Numeros telefonicos*/}
      <div className="numeroTelefono" >
        <img src={phone} alt="Telefono" />
        <h1>Numeros telefonicos</h1>
        <div>
          <strong>Atencion al cliente</strong>
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
      {/*Sobre nosotros */}
      <div className="aboutUs">
        <h1>Centros medicos de alta calidad.</h1>
        <p>Mas de 20 años de experiencia cuidando de nuestros pacientes.</p>
        <div className="infoContainer">
          <div className="cardInfo">
            <img src={hospital} alt="Icono hospital" />
            <strong>100</strong>
            <p>Centros medicos en el pais</p>
          </div>
          <div className="cardInfo">
            <img src={doctor} alt="Icono profesional" />
            <strong>10.000</strong>
            <p>Profesionales medicos</p>
          </div>
          <div className="cardInfo">
            <img src={user} alt="Icono paciente" />
            <strong>150.000+</strong>
            <p>Pacientes satisfechos</p>
          </div>
          <div className="cardInfo">
            <img src={pill} alt="Icono farmacia" />
            <strong>200+</strong>
            <p>Farmacias en el pais</p>
          </div>
        </div>
        <button className="buttonAboutUs">Aprende mas sobre nosotros</button>
      </div>
    </Layout>
  );
};

export default Home;
