import { Routes, Route } from "react-router-dom";
import Header from "../src/components/Header/Header.jsx";
import Banner from "../src/components/Banner/Banner.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Inicio from "./pages/Home.jsx";
import Visitanos from "./pages/Visitanos.jsx";
import Contactanos from "./pages/Contactanos.jsx";
import "./App.css";
import Menu from "./pages/Menu.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Inicio />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/visitanos" element={<Visitanos />} />
      <Route path="/contactanos" element={<Contactanos />} />
    </Routes>
  );
}

export default App;
