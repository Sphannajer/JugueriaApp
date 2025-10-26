import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import "../../styles/DashboardLayout.css";
import logo from "../../assets/LogoOfi.webp";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard-layout">
      {/* Botón hamburguesa visible solo en móviles */}
      <button className="hamburger-btn" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Logo" className="sidebar-logo" />
          <h2>Tía Julia</h2>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/admin" onClick={closeSidebar}>Dashboard</NavLink>
          <NavLink to="/admin/ventas" onClick={closeSidebar}>Ventas</NavLink>
          <NavLink to="/admin/inventario" onClick={closeSidebar}>Inventario</NavLink>
          <NavLink to="/admin/productos" onClick={closeSidebar}>Menú de Productos</NavLink>
          <NavLink to="/admin/clientes" onClick={closeSidebar}>Clientes</NavLink>
          <NavLink to="/admin/finanzas" onClick={closeSidebar}>Finanzas</NavLink>
          <NavLink to="/admin/promociones" onClick={closeSidebar}>Promociones</NavLink>
          <NavLink to="/admin/configuracion" onClick={closeSidebar}>Configuración</NavLink>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="dashboard-main">
        <Outlet />
      </main>

      {/* Capa para cerrar el sidebar al hacer clic fuera */}
      {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
    </div>
  );
};

export default DashboardLayout;