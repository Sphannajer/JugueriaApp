import { Button } from "../components/Login/Button";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import logoJugueria from "../assets/logoOfi.webp";
import { Input } from "../components/Login/Input";

export default function Login() {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const usuarioValido = true;
    if (usuarioValido) {
      navigate("/inicio");
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

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
            Eres nuevo ?{" "}
            <Link to="/register" className="fm-Formulario-LinkRegistro">
              Registrate aqui para emepezar a pedir
            </Link>{" "}
          </strong>
          <form className="fm-Formulario-inputs" onSubmit={handleSubmit}>
            <Input type="text" name="user" placeholder="User" required />
            <Input
              type="password"
              name="Contrasenia"
              placeholder="Contraseña"
              required
            />
            <Button text="Empezar a Pedir" type="submit" />
            <Link to="/register" className="fm-Formulario-LinkOlvido">
              Olvidaste la contraseña?
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}
