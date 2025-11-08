import { useState } from "react";
import axios from "axios";
import { Input } from "../../../components/Login/Input";
import { Button } from "../../../components/Login/Button";
import "../../../styles/Recuperacion.css";

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
      <div className="rc-container">
        <div className="rc-form">
          <h1>Recuperar contraseña</h1>
          <form className="rc-form-inputs" onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Ingresa tu correo"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button text="Enviar enlace de recuperación" type="submit" />
          </form>
          {mensaje && <p className="rc-success-message">{mensaje}</p>}
          {error && <p className="rc-error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
}