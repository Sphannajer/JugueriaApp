import React from "react";
import Header from "../../../components/Header/Header";
import "../../../styles/Contactanos.css";
import Jugos from "../../../assets/Jugos.webp";
import Face from "../../../assets/Face.webp";
import Insta from "../../../assets/Insta.webp";
import Wasap from "../../../assets/Wasap.webp";

export default function Contactanos() {
  return (
    <div className="contactanos-container">
      {/* Barra Superior */}
      <Header />

      {/* 1er Banner */}
      <section className="hero-section">
        <img src={Jugos} alt="Imagen de contacto" className="hero-img" />
        <div className="hero-text">
          <h1>¡Contáctanos!</h1>
        </div>
      </section>

      {/* Formulario y Contacto */}
      <section className="contact-info-section">
        <div className="contact-details">
          <h2>Estamos para ayudarte</h2>
          <p>
            Si tienes alguna pregunta, comentario o sugerencia, no dudes en
            escribirnos. Rellena el formulario o contáctanos directamente a
            través de nuestras redes sociales.
          </p>
          <div className="social-links">
            <a href="URL/FACEBOOK" target="_blank" rel="noopener noreferrer">
              <img src={Face} alt="Facebook" />
            </a>
            <a href="URL/IG" target="_blank" rel="noopener noreferrer">
              <img src={Insta} alt="Instagram" />
            </a>
            <a href="URL/WHATSAPP" target="_blank" rel="noopener noreferrer">
              <img src={Wasap} alt="Whatsapp" />
            </a>
          </div>
          <p>
            <strong>Teléfono:</strong> +51 991-188-332
          </p>
          <p>
            <strong>Email:</strong> contacto@jugos.com
          </p>
        </div>

        {/* Formulario de contacto*/}
        <div className="contact-form-container">
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Nombre:</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Mensaje:</label>
              <textarea id="message" name="message" required></textarea>
            </div>
            <button type="submit">Enviar Mensaje</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
