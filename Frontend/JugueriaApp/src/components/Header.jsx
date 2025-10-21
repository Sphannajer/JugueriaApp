import {assets} from "../assets/assets.js";
import {useContext} from "react";
import {AppContext} from "../context/AppContext.jsx";

const Header = () => {

    const {userData} = useContext(AppContext);

    return (
        <div className="text-center d-flex flex-column align-items-center justify-content-center py-5 px-3" style={{minHeight:"80hv"}}>
            <img src={assets.header} alt = "header" width={120} className="mb-4" />

            <h5 className="fw-semibold">
                Hola {userData ? userData.name : 'Usuario'} Bienvenido <span role="img" aria-label="smoothie">🥤</span>
            </h5>

            <h1 className="fw-bold display-5 mb-3"> Aplicación Web de la Juguería Tía Julia</h1>

            <p className="text-muted fs-5 mb-4" style={{maxWidth: "500px"}}>
                Un lugar realmente perfecto donde poder disfrutar de jugos de calidad
            </p>

                <button className="btn btn-outline-dark rounded-pill px-4 py-2">
                    Regístrese
                </button>

        </div>
    )
}

export default Header;