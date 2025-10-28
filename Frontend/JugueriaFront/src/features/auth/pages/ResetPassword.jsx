import { useState } from "react";
import axios from "axios";
import { Input } from "../../../components/Login/Input";
import { Button } from "../../../components/Login/Button";
import { useNavigate } from "react-router-dom";
import "../../../styles/VerificacionContraseña.css";

export default function ResetPassword() {
  const [contrasena, setContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (contrasena !== confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      await axios.post("http://localhost:8080/auth/reset-password", {
        token,
        contrasena,
      });
      setMensaje("Contraseña actualizada correctamente");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al restablecer la contraseña.");
    }
  };

  return (
    <div className="body">
    <div className="rcs-container">
      <div className="rcs-form">
        <h1>Restablecer Contraseña</h1>
        <form className="rcs-form-inputs" onSubmit={handleSubmit}>
          <Input
            type="password"
            placeholder="Nueva contraseña"
            required
            onChange={(e) => setContrasena(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirmar contraseña"
            required
            onChange={(e) => setConfirmar(e.target.value)}
          />
          <Button text="Cambiar contraseña" type="submit" />
        </form>
        {mensaje && <p className="rcs-success-message">{mensaje}</p>}
        {error && <p className="rcs-error-message">{error}</p>}
      </div>
    </div>
  </div>
  );
}
