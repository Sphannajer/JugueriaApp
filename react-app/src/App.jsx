import React from "react";
import Header from "./components/Header/Header.jsx";
import Banner from "./components/Banner/Banner.jsx";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Inicio from "./pages/Home.jsx";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/inicio" element={<Inicio />} />
    </Routes>
  );
}

export default App;
