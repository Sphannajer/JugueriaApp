import React from "react";
import { Link } from "react-router-dom";
import "../styles/Visitanos.css";
import Logo from "../assets/LogoOfi.webp";
import Carrito from "../assets/Carrito.webp";
import Jugos from "../assets/Jugos.webp";
import Mapa from "../assets/Mapa.webp";
import Interior from "../assets/Interior.webp";
import Face from "../assets/Face.webp";
import Insta from "../assets/Insta.webp";
import Wasap from "../assets/Wasap.webp";


export default function Visitanos() {
  return (
    <div className="visitanos-container">
      {/* Barra Superior */}
      <header className="navbar">
        <div className="navbar-left">
          <img src={Logo} alt="Tía Julia" className="logo" />

          <nav className="nav-links">
            <a href="/">Inicio</a>
            <a href="/menu">Menú</a>
            <a href="/nosotros">Nosotros</a>
            <a href="/visitanos" className="active">Visítanos</a>
          </nav>
        </div>

        <div className="nav-actions">
          <a href="/login">Login/Register</a>
          <img src={Carrito} alt="Carrito" className="cart-icon" />
        </div>
      </header>


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
            Frente al banco de la Municipalidad, al lado de una tienda de abarrotes, 
            dentro del Mercado Las Dalias
          </p>
        </div>
        <img src={Mapa} alt="Mapa ubicación" className="map-img" />
      </section>


      {/* Referencia */}
      <section className="store-section">
        <h2>Como referencia:</h2>
        <img src={Interior} alt="Interior de la tienda" className="store-img" />
      </section>


      {/* Referencia */}
      <footer className="footer">
        <div className="footer-left">
          <img src={Logo} alt="Tía Julia" className="footer-logo" />
          <div className="footer-links">
            <a href="/">Inicio</a>
            <a href="/menu">Menú</a>
            <a href="/nosotros">Nosotros</a>
            <a href="/visitanos">Visítanos</a>
          </div>
        </div>

        <div className="footer-social">
          <img src={Face} alt="Facebook" />
          <img src={Insta} alt="Instagram" />
          <img src={Wasap} alt="Whatsapp" />
        </div>

        <div className="footer-contact">
          <p>📞 +51 991-188-332</p>
          <p>📍 Jr. Huanuco Mercado</p>
        </div>
      </footer>
    </div>
  );
}
