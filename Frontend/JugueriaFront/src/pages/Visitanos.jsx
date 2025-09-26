import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header/Header";
import "../styles/Visitanos.css";
import Logo from "../assets/LogoOfi.webp";
import Carrito from "../assets/Carrito.webp";
import Jugos from "../assets/Jugos.webp";
import Mapa from "../assets/Mapa.webp";
import Interior from "../assets/Interior.webp";
import Face from "../assets/Face.webp";
import Insta from "../assets/Insta.webp";
import Wasap from "../assets/Wasap.webp";
import Footer from "../components/Footer/Footer";

export default function Visitanos() {
  return (
    <div className="visitanos-container">
      {/* Barra Superior */}
      <Header />

      {/* 1er Banner */}
      <section className="hero-section">
        <img src={Jugos} alt="Jugos naturales" className="hero-img" />
        <div className="hero-text">
          <h1>¿Dónde nos encuentras?</h1>
        </div>
      </section>

      {/* Mapa */}
      <section className="map-section">
        <div className="address">
          <h2>Av. Perú...</h2>
          <p>
            Frente al banco de la Municipalidad, al lado de una tienda de
            abarrotes, dentro del Mercado Las Dalias
          </p>
        </div>
        <img src={Mapa} alt="Mapa ubicación" className="map-img" />
      </section>

      {/* Referencia */}
      <section className="store-section">
        <h2>Como referencia:</h2>
        <img src={Interior} alt="Interior de la tienda" className="store-img" />
      </section>

      <Footer />
    </div>
  );
}
