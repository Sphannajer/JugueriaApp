import { Routes, Route } from "react-router-dom"
import Login from './pages/Login.jsx'
import Register from "./pages/Register.jsx"
import Visitanos from "./pages/Visitanos.jsx";
import Contactanos from "./pages/Contactanos.jsx";
import './App.css'
import Menu from "./pages/Menu.jsx";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/visitanos" element={<Visitanos />}/>
    </Routes>
    
  );
}

export default App
