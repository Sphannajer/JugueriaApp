import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createLoginUsuario } from '../models/auth.models'; // 
import { loginUser, getToken, getUserName } from '../../../api/authService';

import { Input } from "../../../components/Login/Input"; // Componente de UI
import { Button } from "../../../components/Login/Button"; // Componente de UI
import logoJugueria from "../../../../public/images/logo.png";
import "../../../styles/Login.css";

const Login = () => {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [errMsj, setErrMsj] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (getToken()) {
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        console.log("1. Función handleSubmit iniciada.");//depuracion
        e.preventDefault();
        setErrMsj('');

        try {
            const loginUsuarioDTO = createLoginUsuario(nombreUsuario, contrasena);
            console.log("2. DTO creado:", loginUsuarioDTO);//depuracion2

            const data = await loginUser(loginUsuarioDTO);

            console.log("3. Login exitoso. Data recibida:", data); //depuracion 3
            const user = getUserName();
            alert('Bienvenido ' + user);
            navigate('/');

        } catch (error) {
            console.error("4. Error en el login:", error.message, error); //error si en caso saldra en la consola
            const message = error.message || 'Error desconocido';
            setErrMsj(message);
        }
    };

    return (
        <body className='body'>


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


                    <form className="fm-Formulario-inputs" onSubmit={handleSubmit}>

                        <Input
                            type="text"
                            name="user"
                            placeholder="User"
                            required
                            onChange={(e) => setNombreUsuario(e.target.value)}
                        />
                        <Input
                            type="password"
                            name="Contrasenia"
                            placeholder="Contraseña"
                            required
                            onChange={(e) => setContrasena(e.target.value)}
                        />



                        <Button text="Empezar a Pedir" type="submit" />
                        <Link to="/register" className="fm-Formulario-LinkOlvido">
                            ¿Olvidaste la contraseña?
                        </Link>

                        {errMsj && <p className="error-message">{errMsj}</p>}
                    </form>
                </div>
            </div>
        </body>
    );
}

export default Login;