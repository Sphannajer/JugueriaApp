import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/LogoOfi.webp";
import Face from "../assets/Face.webp";
import Insta from "../assets/Insta.webp";
import Wasap from "../assets/Wasap.webp";
import "../styles/Visitanos.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <img src={Logo} alt="Tía Julia" className="footer-logo" />
        <div className="footer-links">
          <Link to="/">Inicio</Link>
          <Link to="/menu">Menú</Link>
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/visitanos">Visítanos</Link>
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
  );
}