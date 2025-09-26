import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/LogoOfi.webp";
import telefono from "../../assets/Telefono.webp";
import ubicacion from "../../assets/Ubicacion.webp";
import facebook from "../../assets/Face.webp";
import instagram from "../../assets/Insta.webp";
import wsp from "../../assets/Wasap.webp";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-section logo-footer">
        <img src={logo} alt="Jugo Julia Logo" />
      </div>

      {/* Navegación interna */}
      <div className="footer-section footer-nav">
        <ul>
          <li>
            <NavLink to="/inicio">Inicio</NavLink>
          </li>
          <li>
            <NavLink to="/menu">Menú</NavLink>
          </li>
          <li>
            <NavLink to="/nosotros">Nosotros</NavLink>
          </li>
          <li>
            <NavLink to="/visitanos">Visítanos</NavLink>
          </li>
        </ul>
      </div>

      {/* Contacto */}
      <div className="footer-section contact-info">
        <div className="contact-group">
          <h4>Contacto</h4>
          <p>
            <img src={telefono} alt="Teléfono" /> +51 991-188-332
          </p>
        </div>
        <div className="contact-group">
          <h4>Ubícanos</h4>
          <p>
            <img src={ubicacion} alt="Ubicación" /> Jr. Huanuco Mercado
          </p>
        </div>
      </div>

      {/* Redes sociales externas */}
      <div className="footer-section social-media">
        <h4>Redes</h4>
        <div className="social-icons">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={facebook} alt="Facebook" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={instagram} alt="Instagram" />
          </a>
          <a
            href="https://wa.me/987654321"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={wsp} alt="WhatsApp" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
