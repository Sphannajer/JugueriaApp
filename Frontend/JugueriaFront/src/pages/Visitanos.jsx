import React from "react";
import "./Visitanos.css";

function Visitanos() {
  return (
    <div className="visitanos-container">
      {/* Barra Superior */}
      <header className="navbar">
        <div className="navbar-left">
          <img src="/assets/LogoOfi.webp" alt="Tía Julia" className="logo" />

          <nav className="nav-links">
            <a href="/">Inicio</a>
            <a href="/menu">Menú</a>
            <a href="/nosotros">Nosotros</a>
            <a href="/visitanos" className="active">Visítanos</a>
          </nav>
        </div>

        <div className="nav-actions">
          <a href="/login">Login/Register</a>
          <img src="/assets/Carrito.webp" alt="Carrito" className="cart-icon" />
        </div>
      </header>

      {/* Foto grande de jugos */}
      <section className="hero-section">
        <img src="/assets/Jugos.webp" alt="Jugos naturales" className="hero-img" />
        <div className="hero-text">
          <h1>¿Dónde nos encuentras?</h1>
        </div>
      </section>

      {/* Dirección + mapa */}
      <section className="map-section">
        <div className="address">
          <h2>Av. Perú...</h2>
          <p>
            Frente al banco de la Municipalidad, al lado de una tienda de abarrotes,
            dentro del Mercado Las Dalias
          </p>
        </div>
        <img src="/assets/Mapa.webp" alt="Mapa ubicación" className="map-img" />
      </section>

      {/* Foto del interior de la tienda */}
      <section className="store-section">
        <h2>Como referencia:</h2>
        <img src="/assets/Interior.webp" alt="Interior de la tienda" className="store-img" />
      </section>

      {/* Barra inferior */}
      <footer className="footer">
        <div className="footer-left">
          <img src="/assets/LogoOfi.webp" alt="Tía Julia" className="footer-logo" />

          <div className="footer-links">
            <a href="/">Inicio</a>
            <a href="/menu">Menú</a>
            <a href="/nosotros">Nosotros</a>
            <a href="/visitanos">Visítanos</a>
          </div>
        </div>

        <div className="footer-social">
          <img src="/assets/Face.webp" alt="Facebook" />
          <img src="/assets/Insta.webp" alt="Instagram" />
          <img src="/assets/Wasap.webp" alt="Whatsapp" />
        </div>

        <div className="footer-contact">
          <p>📞 +51 991-188-332</p>
          <p>📍 Jr. Huanuco Mercado</p>
        </div>
      </footer>
    </div>
  );
}

export default Visitanos;
