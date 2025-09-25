import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { FaShoppingCart } from "react-icons/fa";
import logo from "../assets/LogoOfi.webp";
import "./Header.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav_logo">
        <img src={logo} alt="Logo" className="logo_img" />
        Tía Julia
      </div>

      {/* Menú */}
      <div className={`nav_items ${open ? "open" : ""}`}>
        <a href="#inicio">Inicio</a>
        <a href="#nosotros">Menú</a>
        <a href="#productos">Contacto</a>
        <a href="#contacto">Nosotros</a>
        <Link to="/">Iniciar Sesión</Link>
        <a href="#carrito" className="nav_cart">
          <FaShoppingCart className="cart_icon" />
        </a>
      </div>

      {/* Botón hamburguesa */}
      <div
        className={`nav_toggle ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <FiX className="toggle_icon" />
        ) : (
          <FiMenu className="toggle_icon" />
        )}
      </div>
    </nav>
  );
};
export default Navbar;