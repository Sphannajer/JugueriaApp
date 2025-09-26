import React from "react";
import Header from "../../../components/Header/Header.jsx";
import Banner from "../../../components/Banner/Banner.jsx";
import "../../../styles/Home.css";
import jugoPapaya from "../../../assets/papaya.jpg";
import jugoFresa from "../../../assets/fresa.jpg";
import jugoNaranja from "../../../assets/naranja.jpg";
import jugoMango from "../../../assets/mango.jpg";
import jugoEspecial from "../../../assets/especial.webp";
import sandwich from "../../../assets/sandwich.jpg";
import Footer from "../../../components/Footer/Footer.jsx";

const Inicio = () => {
  return (
    <>
      <Header />
      <Banner />
      <div className="home">
        {/* Parte de favs*/}
        <section className="favorites">
          <h2>Los Favoritos de la Casa</h2>
          <div className="card_container">
            <div className="card">
              <div className="card-body">
                <img src={jugoPapaya} alt="Jugo de Papaya" />
                <h3>Jugo de Papaya</h3>
                <p>Papaya, azúcar o miel, algarrobina y toque especial</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <img src={jugoFresa} alt="Jugo de Fresa" />
                <h3>Jugo de Fresa</h3>
                <p>
                  Fresa, veterraga, azúcar o miel, algarrobina y toque especial
                </p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <img src={jugoNaranja} alt="Jugo de Naranja" />
                <h3>Jugo de Naranja</h3>
                <p>Naranja y toque especial de la casa</p>
              </div>
            </div>
          </div>
        </section>

        {/* Parte de promos */}
        <section className="promotions">
          <h2>Promociones del día</h2>
          <div className="card_container">
            <div className="card">
              <div className="card-body">
                <img src={jugoMango} alt="Jugo de Mango" />
                <h3>Jugo de Mango</h3>
                <p>Mango, azúcar o miel, algarrobina y toque especial</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <img src={jugoEspecial} alt="Jugo Especial" />
                <h3>Jugo Especial</h3>
                <p>Papaya, leche, huevo, algarrobina y toque especial</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <img src={sandwich} alt="Sandwiches" />
                <h3>Sandwiches</h3>
                <p>
                  Pan con tu acompañante favorito, ya sea pollo, lomo, huevo,
                  palta, pavo, etc.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Parte de Visítanos */}
        <section className="visit">
          <h2>Visítanos</h2>
          <div className="visit_container">
            <div className="map_wrapper">
              <iframe
                title="Mapa Tía Julia"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243.87459060934688!2d-77.10284703949294!3d-12.043971352426441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105cd6d392cc10d%3A0xa1f59cdea8ab8178!2sMercado%20Manuel%20C.%20Dulanto!5e0!3m2!1ses-419!2spe!4v1758778249725!5m2!1ses-419!2spe"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="visit_info">
              <h3>Callao</h3>
              <p>📍 Jr. Huanuco Mz 32 Mercado</p>
              <p>📞 +51 991-188-332</p>
              <p>🕒 Lunes a Domingo: 8 A.M. a 3 P.M.</p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Inicio;
