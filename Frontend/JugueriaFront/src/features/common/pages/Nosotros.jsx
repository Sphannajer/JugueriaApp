import React from "react";
import Header from "../../../components/Header/Header.jsx";
import Footer from "../../../components/Footer/Footer.jsx";
import "../../../styles/Nosotros.css"; 
import ImgTiaJulia from '../../../assets/tiajulia.webp'; 
import ImgFrescura from '../../../assets/frescura.png'; 
import ImgCalidad from '../../../assets/calidad.png';
import ImgTradicion from '../../../assets/tradicion.webp';
import ImgComunidad from '../../../assets/comunidad.png';
import ImgMision from '../../../assets/mision.png';
import ImgVision from '../../../assets/vision.png';

const NosotrosPage = () => {
    return (
        <>
            <Header /> 
            <div className="nosotros-page">
                
                {/* 1. SECCIÓN "CONOCE A LA TÍA JULIA" (HERO) */}
                <section className="hero-about-section">
                    <div className="hero-content">
                        <h1 className="hero-title">Conoce a la tía Julia</h1>
                        <p className="hero-description">
                            En 1974, Julia Chauca la querida Tía Julia comenzó a vender jugos naturales 
                            en el Mercado Virgen del Rosario. Con esfuerzo, productos hechos en casa y 
                            un trato lleno de cariño, conquistó a su comunidad. Más que una juguera, 
                            fue un refugio de salud y confianza; preparaba sus jugos, postres y platos fríos
                            con amor, y hasta invitaba a los niños a comer gratis. 
                            Hoy, su hija lleva adelante este legado familiar, manteniendo la tradición, 
                            la calidad natural y el servicio personalizado que los ha hecho únicos 
                            por más de 50 años.
                        </p>
                    </div>
                    <div className="hero-image">
                        <img src={ImgTiaJulia} alt="Ilustración de la Tía Julia" className="tia-julia-illustration" />
                    </div>
                </section>

                {/* 2. SECCIÓN "VALORES DE LA MARCA" */}
                <section className="values-section">
                    <h2>Valores de la Marca</h2>
                    <div className="card_container">
                        <div className="value-item">
                            <img src={ImgFrescura} alt="Ícono Frescura" className="value-icon" /> 
                            <h3>Frescura</h3>
                        </div>
                        <div className="value-item">
                            <img src={ImgCalidad} alt="Ícono Calidad" className="value-icon" /> 
                            <h3>Calidad</h3>
                        </div>
                        <div className="value-item">
                            <img src={ImgTradicion} alt="Ícono Tradición" className="value-icon" /> 
                            <h3>Tradición</h3>
                        </div>
                        <div className="value-item">
                            <img src={ImgComunidad} alt="Ícono Comunidad" className="value-icon" /> 
                            <h3>Comunidad</h3>
                        </div>
                    </div>
                </section>

                {/* 3. SECCIÓN "MISIÓN Y VISIÓN" */}
                <section className="mission-vision-section">
                    <div className="mission-card">
                        <h2>Misión</h2>
                        <div className="card-content">
                            <img src={ImgMision} alt="Ícono Misión" className="mission-icon" />
                            <p>Ofrecer productos naturales y artesanales con calidad, sabor y trato humano...</p>
                        </div>
                    </div>
                    <div className="vision-card">
                        <h2>Visión</h2>
                        <div className="card-content">
                            <img src={ImgVision} alt="Ícono Visión" className="vision-icon" />
                            <p>Seguir siendo un referente de autenticidad y confianza...</p>
                        </div>
                    </div>
                </section>
                
            </div>
            <Footer />
        </>
    );
};

export default NosotrosPage;