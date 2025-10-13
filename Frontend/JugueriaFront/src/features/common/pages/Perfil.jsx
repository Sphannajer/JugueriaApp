import React, { useState } from "react";
import Header from "../../../components/Header/Header.jsx";
import Footer from "../../../components/Footer/Footer.jsx";
import { FaUserCircle } from "react-icons/fa";
import "../../../styles/Perfil.css";

const Perfil = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [userData, setUserData] = useState({
    username: "ChesterSinester",
    telefono: "987654123",
    correo: "julia1987@gmail.com",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Perfil actualizado correctamente ✅");
  };

  return (
    <>
      <Header />
      <div className="perfil_container">
        <h2>Mi perfil</h2>

        <div className="perfil_image_section">
          <div className="perfil_image">
            {profileImage ? (
              <img src={profileImage} alt="Foto de perfil" />
            ) : (
              <FaUserCircle className="default_icon" />
            )}
          </div>

          <label htmlFor="imageUpload" className="btn_upload">
            Actualizar imagen
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
        </div>

        <form className="perfil_form" onSubmit={handleSubmit}>
          <div className="form_group">
            <label>USUARIO</label>
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
            />
          </div>

          <div className="form_group">
            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={userData.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="form_group">
            <label>Correo</label>
            <input
              type="email"
              name="correo"
              value={userData.correo}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn_update">
            Actualizar perfil
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Perfil;
