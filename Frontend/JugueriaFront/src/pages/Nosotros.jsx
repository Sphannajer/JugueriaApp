import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer"
import "../styles/Nosotros.css";
import ImgFrescura from '../assets/frescura.png'; 
import ImgCalidad from '../assets/calidad.png';
import ImgTradicion from '../assets/tradicion.webp';
import ImgComunidad from '../assets/comunidad.png';
import ImgMision from '../assets/mision.png';
import ImgVision from '../assets/vision.png';

export default function Nosotros(){
  return (
    <>
    <Header />
        <div className="about-page-container">

      {/* Sección "Conoce a la tía Julia" */}
      <section className="hero-about-section">
        <div className="hero-content">
          <h1 className="hero-title">Conoce a la tía Julia</h1>
          <p className="hero-description">
            En 1974, Julia Chauca la querida Tía Juliacomenzó a vender
            jugos naturales en el Mercado Virgen del Rosario. Con
            esfuerzo, productos hechos en casa y un trato lleno de cariño,
            conquistó a su comunidad. Más que una juguera, fue un
            refugio de salud y confianza; preparaba sus jugos, postres y
            platos fríos con amor, y hasta invitaba a los niños a comer
            gratis. Hoy, su hija lleva adelante este legado familiar,
            manteniendo la tradición, la calidad natural y el servicio
            personalizado que los ha hecho únicos por más de 50 años.
          </p>
        </div>
        <div className="hero-image">
          <div className="tia-julia-illustration"></div>
        </div>
      </section>


      {/* Sección "Valores de la Marca" */}
      <section className="values-section">
        <h2 className="section-title">Valores de la Marca</h2>
        <div className="values-grid">
          <div className="value-item">
            <img src={ImgFrescura} alt="Ícono de Frescura" className="value-icon" /> 
            <p>Frescura</p>
          </div>
          <div className="value-item">
            <img src={ImgCalidad} alt="Ícono de Calidad" className="value-icon" /> 
            <p>Calidad</p>
          </div>
          <div className="value-item">
            <img src={ImgTradicion} alt="Ícono de Tradición" className="value-icon" /> 
            <p>Tradición</p>
          </div>
          <div className="value-item">
            <img src={ImgComunidad} alt="Ícono de Comunidad" className="value-icon" /> 
            <p>Comunidad</p>
          </div>
        </div>
      </section>

      {/* Sección "Misión y Visión" */}
      <section className="mission-vision-section">
        <div className="mission-card">
          <h2 className="section-title">Misión</h2>
          <div className="card-content">
            <img src={ImgMision} alt="Ícono de Misión" className="mission-icon" />
            <p>
              Ofrecer productos naturales y
              artesanales con calidad, sabor y trato
              humano...
            </p>
          </div>
        </div>
        <div className="vision-card">
          <h2 className="section-title">Visión</h2>
          <div className="card-content">
            <img src={ImgVision} alt="Ícono de Visión" className="vision-icon" />
            <p>
              Seguir siendo un referente de
              autenticidad y confianza...
            </p>
          </div>
        </div>
      </section>
    </div>
  <Footer />
  </>
  );
};


