import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-section logo-footer">
        <img src="/images/logo.png" alt="Jugo Julia Logo" />
      </div>
      <div className="footer-section footer-nav">
        <ul>
          <li>
            <a href="#">Inicio</a>
          </li>
          <li>
            <a href="#">Menú</a>
          </li>
          <li>
            <a href="#">Nosotros</a>
          </li>
          <li>
            <a href="#">Visítanos</a>
          </li>
        </ul>
      </div>
      <div className="footer-section contact-info">
        <div className="contact-group">
          <h4>Contacto</h4>
          <p>
            <img src="/images/telefono.png" alt="Teléfono" /> +51 991-188-332
          </p>
        </div>
        <div className="contact-group">
          <h4>Ubícanos</h4>
          <p>
            <img src="/images/ubicacion.png" alt="Ubicación" /> Jr. Huanuco
            Mercado
          </p>
        </div>
      </div>
      <div className="footer-section social-media">
        <h4>Redes</h4>
        <div className="social-icons">
          <a href="#">
            <img src="/images/facebook.png" alt="Facebook" />
          </a>
          <a href="#">
            <img src="/images/instagram.png" alt="Instagram" />
          </a>
          <a href="#">
            <img src="/images/wsp.png" alt="WhatsApp" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
