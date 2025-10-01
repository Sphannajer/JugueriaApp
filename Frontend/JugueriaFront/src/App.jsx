import { Routes, Route } from "react-router-dom";
import Login from "./features/auth/pages/Login.jsx";
import Register from "./features/auth/pages/Register.jsx";
import Inicio from "./features/products/pages/Home.jsx";
import Visitanos from "./features/common/pages/Visitanos.jsx";
import Contactanos from "./features/common/pages/Contactanos.jsx";
import Nosotros from './features/common/pages/Nosotros.jsx';
import "./styles/App.css";
import Menu from "./features/products/pages/Menu.jsx";
import LoginGuard from "./features/guards/loginGuard.jsx";
import PantallaVerificacionCorreo from "./features/auth/pages/PantallaVerificacionCorreo.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginGuard><Login /></LoginGuard>} />
      <Route path="/register" element={<LoginGuard><Register /></LoginGuard>} />
      <Route path="/" element={<Inicio />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/visitanos" element={<Visitanos />} />
      <Route path="/contactanos" element={<Contactanos />} />
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/pantalla" element={<PantallaVerificacionCorreo />} />    
    </Routes>
  );
}

export default App;
