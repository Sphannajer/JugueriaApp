import { Button } from "../../../components/Login/Button";
import { Link } from "react-router-dom";
import "../../../styles/Register.css";
import logoJugueria from "../../../assets/logoOfi.webp";
import { Input } from "../../../components/Login/Input";

export default function Register() {
  return (
    <>
      <div className="fm-ContenedorDelTodo">
        <img
          src={logoJugueria}
          alt="logoJugueria"
          className="fm-LogoJugueria"
        />
        <div className="fm-FormularioRegistro">
          <h1 className="fm-FormularioRegistro-h1">REGISTRO</h1>
          <form className="fm-FormularioRegistro-Inputs">
            <Input type="text" name="user" placeholder="User" />
            <Input type="email" name="correo" placeholder="Correo" />
            <Input
              type="password"
              name="contrasenia"
              placeholder="Contraseña"
            />
            <Input
              type="number"
              name="telefono"
              placeholder="Celular"
            />
            <Input type="text" name="direccion" placeholder="Direccion"/>
            <Button text="Registrar" type="submit" />
          </form>
        </div>
      </div>
    </>
  );
}
