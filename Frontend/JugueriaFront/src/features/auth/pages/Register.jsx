// src/features/auth/pages/Register.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createNuevoUsuario } from '../models/auth.models';
import { registerUser, getToken } from '../../../api/authService'; // Servicio
import { Input } from '../../../components/Login/Input';
import { Button } from '../../../components/Login/Button';
import logoJugueria from "../../../assets/logoOfi.webp";
import "../../../styles/Register.css";

const Register = () => {
    // === 1. HOOKS DE ESTADO (CINCO CAMPOS) ===
    const [nombre, setNombre] = useState(''); //Mapea el nombre del usuario
    const [nombreUsuario, setNombreUsuario] = useState(''); // Mapea a 'user'
    const [email, setEmail] = useState('');                 // Mapea a 'correo'
    const [password, setPassword] = useState('');           // Mapea a 'contrasenia'
    const [telefono, setTelefono] = useState('');           // NUEVO CAMPO
    const [direccion, setDireccion] = useState('');         // NUEVO CAMPO
    const [errMsj, setErrMsj] = useState('');

    const navigate = useNavigate();

    // === 2. useEffect (Comprobar si ya está logueado) ===
    useEffect(() => {
        if (getToken()) {
            navigate('/');
        }
    }, [navigate]);

    // === 3. handleSubmit ===
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrMsj('');

        try {
            // Crea el DTO con los 6 campos
            const nuevoUsuarioDTO = createNuevoUsuario(
                nombre,
                nombreUsuario,
                email,
                password,
                telefono,
                direccion
            );
            console.log("1. DTO de Registro creado:", nuevoUsuarioDTO);

            await registerUser(nuevoUsuarioDTO);

            console.log("2. Registro exitoso.");
            alert('Cuenta Creada Correctamente. Por favor, inicia sesión.');

            navigate('/login');

        } catch (error) {
            console.error("3. Error en el registro:", error.message, error);
            const message = error.message || 'Error desconocido al registrar.';
            setErrMsj(message);
            alert('Fallo en el registro: ' + message);
        }
    };

    return (
        <body className='body'>
            <div className="fm-ContenedorDelTodo">
                <img src={logoJugueria} alt="logoJugueria" className="fm-LogoJugueria" />
                <div className="fm-FormularioRegistro">
                    <h1 className="fm-FormularioRegistro-h1">REGISTRO</h1>


                    <form className="fm-FormularioRegistro-Inputs" onSubmit={handleSubmit}>

                        {/* Campo Nombre Real del Usuario (user) */}
                        <Input
                            type="text"
                            name="nombre"
                            placeholder="Nombre"
                            required
                            onChange={(e) => setNombre(e.target.value)}
                        />

                        {/* Campo Nombre de Usuario (user) */}
                        <Input
                            type="text"
                            name="user"
                            placeholder="Usuario"
                            required
                            onChange={(e) => setNombreUsuario(e.target.value)}
                        />

                        {/* Campo Email (correo) */}
                        <Input
                            type="email"
                            name="correo"
                            placeholder="Correo"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {/* Campo Contraseña (contrasenia) */}
                        <Input
                            type="password"
                            name="contrasena"
                            placeholder="Contraseña"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {/* Campo Teléfono (telefono) */}
                        <Input
                            type="number"
                            name="celular"
                            placeholder="Celular"
                            required
                            onChange={(e) => setTelefono(e.target.value)}
                        />

                        {/* Campo Dirección (direccion) */}
                        <Input
                            type="text"
                            name="direccion"
                            placeholder="Direccion"
                            required
                            onChange={(e) => setDireccion(e.target.value)}
                        />

                        <Button text="Registrar" type="submit" />
                    </form>
                    <Link to="/login" className="fm-Formulario-LinkLogin">
                        ¿Ya tienes cuenta? Inicia Sesión
                    </Link>
                    {/* Visualización del error de registro */}
                    {errMsj && <p className="error-message">{errMsj}</p>}
                </div>
            </div>
        </body>
    );
};

export default Register;