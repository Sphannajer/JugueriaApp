import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { createLoginUsuario } from '../models/auth.models';
import { loginUser, verifyCode } from '../../../api/authService';
import { Input } from "../../../components/Login/Input";
import { Button } from "../../../components/Login/Button";
import "../../../styles/Login.css";

const Login = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [mostrarVerificacion, setMostrarVerificacion] = useState(false);
  const [errMsj, setErrMsj] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsj('');

    try {
      const loginDTO = createLoginUsuario(nombreUsuario, contrasena);
      const data = await loginUser(loginDTO);

      if (data.mensaje === "Código enviado al correo registrado.") {
        setEmail(data.email);
        setMostrarVerificacion(true);
      }
    } catch (error) {
      console.error("Error login:", error);
      setErrMsj(error.message || 'Error en login');
    }
  };

  const handleVerificarCodigo = async () => {
    setErrMsj('');
    try {
      if (!codigo) {
        setErrMsj("Ingresa el código de verificación");
        return;
      }

      // llamar al backend
      const data = await verifyCode(email, codigo);
      console.log("Respuesta verifyCode:", data);

      // ⚠️ El backend devuelve { token: "..." }
      if (!data || !data.token) {
        setErrMsj("Token no recibido del backend");
        return;
      }

      // Guardar token manualmente
      localStorage.setItem("AuthToken", data.token);

      alert("Inicio de sesión exitoso ✅");
      setMostrarVerificacion(false);

      navigate("/"); // redirigir
    } catch (error) {
      console.error("Error verificación:", error);
      setErrMsj(error.message || "Código incorrecto o expirado");
    }
  };

  return (
    <div className="body">
      <div className="fm-ContenedorDelTodoLogin">
        <img src="../../../../images/logo.png" alt="logoJugueria" className="fm-LogoJugueria" />
        <div className="fm-Formulario">
          <h1 className="fm-Formulario-h1">LOGIN</h1>
          <strong className="fm-Formulario-Strong">
            ¿Eres nuevo?{" "}
            <Link to="/register" className="fm-Formulario-LinkRegistro">
              Regístrate aquí para empezar a pedir
            </Link>{" "}
          </strong>

          <form className="fm-Formulario-inputs" onSubmit={handleSubmit}>
            <Input type="text" placeholder="Usuario" required onChange={(e) => setNombreUsuario(e.target.value)} />
            <Input type="password" placeholder="Contraseña" required onChange={(e) => setContrasena(e.target.value)} />
            <Button text="Empezar a Pedir" type="submit" />
            <Link to="/forgot-password" className="fm-Formulario-LinkOlvido">
              ¿Olvidaste la contraseña?
            </Link>
          </form>

          {errMsj && <p className="error-message">{errMsj}</p>}
        </div>
      </div>

      {/* Modal de verificación */}
      {mostrarVerificacion && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Verificación de código</h3>
            <p>Se envió un código a tu correo registrado.</p>
            <Input
              type="text"
              placeholder="Código de verificación"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              {/* 🔹 Botón Verificar */}
              <button
                style={{ cursor: 'pointer' }}
                onClick={(e) => { e.preventDefault(); handleVerificarCodigo(); }}
              >
                Verificar
              </button>

              {/* 🔹 Botón Cancelar */}
              <button
                style={{ cursor: 'pointer' }}
                onClick={(e) => { e.preventDefault(); setMostrarVerificacion(false); }}
              >
                Cancelar
              </button>
            </div>
            {errMsj && <p className="error-message">{errMsj}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;