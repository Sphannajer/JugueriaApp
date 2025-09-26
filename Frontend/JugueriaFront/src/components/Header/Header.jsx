import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { FaShoppingCart } from "react-icons/fa";
import logo from "../../assets/LogoOfi.webp";
import "../Header/Header.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);
  const closeMenu = () => setOpen(false);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav_logo">
        <img src={logo} alt="Logo Tía Julia" className="logo_img" />
        <span>Tía Julia</span>
      </div>

      {/* Items */}
      <div
        className={`nav_items ${open ? "open" : ""}`}
        role="navigation"
        aria-hidden={!open}
      >
        <NavLink
          to="/inicio"
          onClick={closeMenu}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Inicio
        </NavLink>

        <NavLink
          to="/menu"
          onClick={closeMenu}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Menú
        </NavLink>

        <NavLink
          to="/nosotros"
          onClick={closeMenu}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Nosotros
        </NavLink>

        <NavLink
          to="/visitanos"
          onClick={closeMenu}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Visítanos
        </NavLink>

        <NavLink to="/login" className="nav_link">
          Iniciar Sesión
        </NavLink>

        <NavLink to="/carrito" className="nav_cart">
          <FaShoppingCart className="cart_icon" />
        </NavLink>
      </div>

      {/* Toggle (hamburguesa) */}
      <button
        className={`nav_toggle ${open ? "open" : ""}`}
        onClick={toggle}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
      >
        {open ? (
          <FiX className="toggle_icon" />
        ) : (
          <FiMenu className="toggle_icon" />
        )}
      </button>
    </nav>
  );
};

export default Navbar;
