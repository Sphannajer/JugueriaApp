import { useState } from "react";
import axios from "axios";
import { Input } from "../../../components/Login/Input";
import { Button } from "../../../components/Login/Button";
import "../../../styles/Login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const res = await axios.post("http://localhost:8080/auth/request-reset", { email });
      setMensaje(res.data.mensaje || "Correo enviado correctamente. Revisa tu bandeja de entrada.");
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al enviar el correo.");
    }
  };

  return (
    <div className="body">
      <div className="fm-ContenedorDelTodoLogin">
        <div className="fm-Formulario">
          <h1 className="fm-Formulario-h1">Recuperar contraseña</h1>
          <form className="fm-Formulario-inputs" onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Ingresa tu correo"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button text="Enviar enlace de recuperación" type="submit" />
          </form>
          {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
}