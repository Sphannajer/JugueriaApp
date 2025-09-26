import { Button } from "../../../components/Login/Button";
import { Link } from "react-router-dom";
import "../../../styles/Login.css";
import logoJugueria from "../../../assets/logoOfi.webp";
import { Input } from "../../../components/Login/Input";

export default function Login() {
  return (
    <>
      <div className="fm-ContenedorDelTodoLogin">
        <img
          src={logoJugueria}
          alt="logoJugueria"
          className="fm-LogoJugueria"
        />
        <div className="fm-Formulario">
          <h1 className="fm-Formulario-h1">LOGIN</h1>
          <strong className="fm-Formulario-Strong">
            ¿Eres nuevo?{" "}
            <Link to="/register" className="fm-Formulario-LinkRegistro">
              Regístrate aquí para empezar a pedir
            </Link>{" "}
          </strong>
          <form className="fm-Formulario-inputs">
            <Input type="text" name="user" placeholder="User" required />
            <Input
              type="password"
              name="Contrasenia"
              placeholder="Contraseña"
              required
            />
            <Button text="Empezar a Pedir" type="submit" />
            <Link to="/register" className="fm-Formulario-LinkOlvido">
              ¿Olvidaste la contraseña?
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}
