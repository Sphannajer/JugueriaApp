import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, ShoppingBag, LogOut, Camera, Mail, Phone } from "lucide-react";
import { getUserName, logOut } from "../../../api/authService";
import "../../../styles/UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  // Estado inicial
  const [user, setUser] = useState({
    username: "",
    email: "cargando...",
    telefono: "cargando...",
  });

  useEffect(() => {
    const currentUsername = getUserName();

    if (!currentUsername) {
      navigate("/login");
      return;
    }

    setUser({
      username: currentUsername,
      email: `${currentUsername.toLowerCase()}@gmail.com`,
      telefono: "999-999-999",
    });
  }, [navigate]);

  const handleLogout = () => {
    logOut();
  };

  return (
    // CAMBIO IMPORTANTE: Usamos 'user-profile-page' en lugar de 'profile-container'
    <div className="user-profile-page">
      <div className="profile-layout">
        {/* --- BARRA LATERAL (SIDEBAR) --- */}
        <aside className="profile-sidebar">
          <div className="sidebar-header">
            <div className="avatar-circle large">
              <User size={40} color="#666" />
            </div>
            <div className="user-summary">
              <h3>{user.username}</h3>
              <p>Cliente Frecuente</p>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <User size={20} />
              <span>Mi Perfil</span>
            </button>
            <button
              className={`nav-item ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <ShoppingBag size={20} />
              <span>Mis Pedidos</span>
            </button>
            <button className="nav-item logout" onClick={handleLogout}>
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </nav>
        </aside>

        {/* --- CONTENIDO PRINCIPAL --- */}
        <main className="profile-content">
          {/* VISTA: MI PERFIL */}
          {activeTab === "profile" && (
            <div className="content-card">
              <div className="card-header">
                <h2>Mi Perfil</h2>
                <p>Administra la información de tu cuenta</p>
              </div>

              <div className="profile-form-container">
                <div className="avatar-section">
                  <div className="avatar-circle icon-avatar">
                    <User size={60} color="#fff" />
                  </div>
                  <button className="camera-btn" title="Cambiar foto">
                    <Camera size={16} />
                  </button>
                </div>

                <form className="user-form">
                  <div className="form-group">
                    <label>Usuario</label>
                    <div className="input-wrapper">
                      <User size={18} className="input-icon" />
                      <input type="text" value={user.username} disabled />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Correo Electrónico</label>
                    <div className="input-wrapper">
                      <Mail size={18} className="input-icon" />
                      <input type="email" value={user.email} disabled />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Teléfono</label>
                    <div className="input-wrapper">
                      <Phone size={18} className="input-icon" />
                      <input type="tel" value={user.telefono} disabled />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* VISTA: MIS PEDIDOS */}
          {activeTab === "orders" && (
            <div className="content-card">
              <div className="card-header">
                <h2>Mis Pedidos</h2>
                <p>Historial de tus compras recientes</p>
              </div>
              <div className="empty-state">
                <ShoppingBag size={48} color="#ccc" />
                <p>Aún no has realizado pedidos.</p>
                <button
                  onClick={() => navigate("/menu")}
                  className="go-shop-btn"
                >
                  Ir al Menú
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
