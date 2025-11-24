import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { FaShoppingCart } from "react-icons/fa";
import { User, LogOut } from "lucide-react";
import { getToken, logOut, getUserName } from "../../api/authService";
import { useCart } from "../Slide-Cart/CartContext";
import logo from "../../assets/LogoOfi.webp";
import "./Header.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { openCart } = useCart();

  const toggle = () => setOpen((v) => !v);
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    setIsLogged(!!getToken());
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogOut = () => {
    logOut();
    setIsLogged(false);
    setShowDropdown(false);
    closeMenu();
    navigate("/inicio");
  };

  return (
    <nav className="navbar">
      {/* LOGO */}
      <div className="nav_logo" onClick={() => navigate("/")}>
        <img src={logo} alt="Logo Tía Julia" className="logo_img" />
        <span>Tía Julia</span>
      </div>

      {/* MENU ITEMS */}
      <div className={`nav_items ${open ? "open" : ""}`}>
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

        {/* CARRITO */}
        <button className="nav_cart_btn" onClick={openCart}>
          <FaShoppingCart />
        </button>

        {/* ZONA DE USUARIO */}
        <div className="user-section" ref={dropdownRef}>
          {isLogged ? (
            // CORRECCIÓN AQUÍ: Usamos 'header-user-wrapper' para evitar conflictos
            <div
              className="header-user-wrapper"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button
                className="profile-icon-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <User size={24} />
              </button>

              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-arrow"></div>
                  <div className="dropdown-welcome">Hola, {getUserName()}</div>

                  <button
                    onClick={() => {
                      navigate("/perfil");
                      setShowDropdown(false);
                      closeMenu();
                    }}
                  >
                    <User size={16} /> Mi Perfil
                  </button>

                  <div className="dropdown-divider"></div>

                  <button className="logout-text" onClick={handleLogOut}>
                    <LogOut size={16} /> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" onClick={closeMenu} className="login-btn">
              Iniciar Sesión
            </NavLink>
          )}
        </div>
      </div>

      <button className="nav_toggle" onClick={toggle}>
        {open ? <FiX /> : <FiMenu />}
      </button>
    </nav>
  );
};

export default Navbar;
