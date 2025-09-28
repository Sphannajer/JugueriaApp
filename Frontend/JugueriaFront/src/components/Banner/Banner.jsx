import React from "react";
import "../Banner/Banner.css";
import banner from "../../assets/banner.png";

const Banner = () => {
  return (
    <div className="banner">
      <img src={banner} alt="" className="banner_img" />
      <div className="banner_content">
        <h1>Bienvenido a Tía Julia Juguería</h1>
        <p>Desde 1974, en cada vaso hay amor, historia y sabor auténtico.</p>
        <a href="/menu" className="banner_btn">
          Ver nuestro menú
        </a>
      </div>
    </div>
  );
};

export default Banner;
