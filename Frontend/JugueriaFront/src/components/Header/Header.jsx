import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { getToken, logOut } from "../../api/authService";
import logo from "../../assets/LogoOfi.webp";
import "../Header/Header.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate();
  const toggle = () => setOpen((v) => !v);
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    setIsLogged(getToken() ? true : false);
  }, [navigate]);

  // Funcion para cerrar sesion
  const handleLogOut = () => {
    logOut();
    setIsLogged(false); // Actualiza el estado local
    closeMenu(); // Cierra el menú móvil
    navigate("/inicio"); // Lo que va hacer este apartado es rdiriguir
  };

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
          to="/"
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

        <NavLink to="/carrito" className="nav_cart">
          <FaShoppingCart className="cart_icon" />
        </NavLink>

        <NavLink to="/perfil" className="icon">
          <FaUserCircle size={30} />
        </NavLink>

        {isLogged ? (
          // Si está logueado: Muestra el Boton de Cerrar Sesión
          <button onClick={handleLogOut} className="nav_link">
            Cerrar Sesión
          </button>
        ) : (
          // Si NO está logueado: Muestra lo que es el inicio de la pagina
          <NavLink to="/login" onClick={closeMenu} className="nav_link">
            Iniciar Sesión
          </NavLink>
        )}
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
