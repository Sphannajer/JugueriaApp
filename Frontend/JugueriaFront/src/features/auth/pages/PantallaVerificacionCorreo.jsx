import React, { useState } from 'react';
import { Mail, RefreshCw, CheckCircle, Info, XCircle } from 'lucide-react'; 
// import axios from 'axios'; // 🚨 Eliminado para resolver el error de dependencia.
// Usaremos la función fetch nativa de JavaScript.

// 🚨 CONFIGURACIÓN: Reemplaza con la URL base de tu backend de Spring Boot
const API_BASE_URL = 'http://localhost:8080/auth'; 

const PantallaVerificacionCorreo = () => {
    const [correo, setCorreo] = useState('');
    const [codigoVerificacion, setCodigoVerificacion] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // Estado para mensajes de éxito/error. Type: 'success', 'error', 'info'
    const [message, setMessage] = useState({ text: '', type: '' }); 

    // El código de verificación debe ser de 6 caracteres alfanuméricos (como lo genera el backend)
    const isCodeValid = codigoVerificacion.length === 6;

    // --- MANEJADOR DE VERIFICACIÓN (Llama a /auth/verify usando fetch) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isCodeValid || !correo) {
            setMessage({ text: 'Por favor, ingresa un email y el código completo.', type: 'error' });
            return;
        }

        setIsLoading(true);
        setMessage({ text: '', type: '' });

        try {
            // Construye la URL con parámetros de consulta (query params)
            const url = new URL(`${API_BASE_URL}/verify`);
            url.searchParams.append('email', correo);
            url.searchParams.append('token', codigoVerificacion);

            const response = await fetch(url.toString(), {
                method: 'POST',
                // Spring espera los datos en query params, por lo que el cuerpo es null
                headers: { 'Content-Type': 'application/json' },
            });
            
            const data = await response.json();

            if (response.ok) {
                // Si es exitoso (HTTP 200 OK)
                setMessage({ 
                    text: data.mensaje || '✅ ¡Cuenta verificada! Redirigiendo al inicio de sesión...', 
                    type: 'success' 
                });
                // 🚨 Aquí podrías agregar una redirección: navigate('/login');
            } else {
                // Spring puede enviar un 400 Bad Request con un mensaje en el cuerpo (data.mensaje)
                const errorMsg = data.mensaje || 'Error desconocido de verificación.';
                setMessage({ 
                    text: errorMsg, 
                    type: 'error' 
                });
            }
        } catch (error) {
            // Maneja errores de red o errores al parsear el JSON
            setMessage({ 
                text: 'Error de red. Asegúrate de que el backend esté corriendo y sea accesible.', 
                type: 'error' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    // --- MANEJADOR DE REENVÍO (Llama a /auth/resend-code usando fetch) ---
    const handleReenviar = async () => {
        if (isLoading || !correo) return;

        setIsLoading(true);
        setMessage({ text: '', type: '' });

        try {
            // Construye la URL con parámetros de consulta (query params)
            const url = new URL(`${API_BASE_URL}/resend-code`);
            url.searchParams.append('email', correo);
            
            const response = await fetch(url.toString(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            
            const data = await response.json();

            if (response.ok) {
                // Si es exitoso (HTTP 200 OK)
                setMessage({ 
                    text: data.mensaje || '📩 Nuevo código enviado. Revisa tu correo.', 
                    type: 'info' 
                });
            } else {
                // Maneja errores si el correo no existe o la cuenta ya está verificada
                const errorMsg = data.mensaje || 'Error al reenviar el código. Revisa el email.';
                setMessage({ 
                    text: errorMsg, 
                    type: 'error' 
                });
            }
        } catch (error) {
            setMessage({ 
                text: 'Error de red al reenviar. Asegúrate de que el backend esté corriendo y sea accesible.', 
                type: 'error' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    // --- Renderizado de Mensajes ---
    const getMessageIcon = () => {
        switch (message.type) {
            case 'success':
                return <CheckCircle size={20} />;
            case 'error':
                return <XCircle size={20} />;
            case 'info':
                return <Info size={20} />;
            default:
                return null;
        }
    };
    
    const renderMessage = () => {
        if (!message.text) return null;

        // Clases CSS específicas para los mensajes (adaptadas para evitar colisión con Tailwind)
        const typeClass = `message-box-${message.type}`;
        
        return (
            <div className={`message-box ${typeClass}`}>
                <div className="message-icon-wrapper">{getMessageIcon()}</div>
                <p className="message-text">{message.text}</p>
            </div>
        );
    };

    // --- Componente principal ---
    return (
        <div className="centered-page"> 
            <style>
                {`
                .centered-page {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    margin: 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                }
                
                .verification-container {
                    background: rgba(255, 255, 255, 0.2); 
                    padding: 30px 30px; 
                    border-radius: 30px; 
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.603);
                    backdrop-filter: blur(10px); 
                    border: 1px solid rgba(255, 255, 255, 0.3); 
                    width: 100%;
                    max-width: 400px; 
                    text-align: center;
                    margin: 0 auto; 
                }
                
                .icon-circle {
                    width: 60px; 
                    height: 60px; 
                    background-color: #f5f8ff; 
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 0 auto 15px auto; 
                }
                
                .mail-icon {
                    color: #5b76b2; 
                }
                
                .title {
                    font-size: 1.6rem; 
                    color: #333;
                    margin-bottom: 5px; 
                    font-weight: 700;
                }
                
                .subtitle {
                    font-size: 0.95rem; 
                    color: #333;
                    margin-bottom: 15px; 
                }
                
                .verification-form {
                    width: 100%;
                    max-width: 100%; 
                    margin: 0 auto; 
                    text-align: left;
                    display: flex;
                    flex-direction: column;
                    gap: 10px; 
                }
                
                .label {
                    display: none; 
                }
                
                .label-code {
                    display: block; 
                    font-size: 1rem;
                    color: #333;
                    font-weight: 600;
                    margin-bottom: 5px; 
                    margin-top: 15px; 
                }
                
                .input {
                    padding: 18px 20px; 
                    border: none; 
                    border-radius: 25px; 
                    box-sizing: border-box; 
                    font-size: 1rem;
                    background-color: #e5e5e5; 
                    color: #333;
                    font-weight: 500;
                    transition: background-color 0.3s;
                }
                
                .input:focus {
                    background-color: #f0f0f0;
                    outline: 2px solid #ff8a00; 
                }
                
                .email-input {
                    background-color: #e5e5e5; 
                    color: #555;
                }
                
                .code-input {
                    text-align: center; 
                    letter-spacing: 5px; 
                }
                
                .code-hint {
                    font-size: 0.85rem;
                    color: #333;
                    text-align: center;
                    margin-top: 5px; 
                    margin-bottom: 15px;
                }
                
                .button {
                    width: 100%; 
                    padding: 16px; 
                    border: none;
                    border-radius: 25px; 
                    cursor: pointer;
                    font-size: 1.1rem; 
                    font-weight: 700;
                    transition: background-color 0.3s, box-shadow 0.3s;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    margin-top: 10px; 
                }
                
                .icon-text-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 8px; 
                }
                
                /* Estilos de botones (Reenviar y Verificar) */
                .resend-button:not([disabled]),
                .verify-button:not([disabled]) {
                    background-image: linear-gradient(to right, #ff8a00, #ff6e00); 
                    box-shadow: 0 4px 10px rgba(255, 138, 0, 0.4);
                }
                
                .resend-button:not([disabled]):hover,
                .verify-button:not([disabled]):hover {
                    background-image: linear-gradient(to right, #ff9a2e, #ff7b2e);
                    box-shadow: 0 6px 15px rgba(255, 138, 0, 0.5);
                }
                
                .verify-button:disabled,
                .resend-button:disabled { 
                    color: white; 
                    cursor: not-allowed;
                    background-image: linear-gradient(to right, #ffdaaf, #ffc785);
                    box-shadow: none;
                    border: none; 
                }
                
                /* Mensajes de feedback dinámicos */
                .message-box {
                    padding: 10px;
                    border-radius: 10px;
                    margin-bottom: 5px;
                    margin-top: 5px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 0.9rem;
                    font-weight: 500;
                }
                .message-box-error {
                    background-color: #ffe0e0; /* Rojo claro */
                    color: #cc0000; /* Rojo */
                }
                .message-box-success {
                    background-color: #e0ffe0; /* Verde claro */
                    color: #00cc00; /* Verde */
                }
                .message-box-info {
                    background-color: #e0f8ff; /* Azul claro */
                    color: #008cc0; /* Azul */
                }
                .message-icon-wrapper {
                    display: flex; /* Para centrar el ícono */
                }

                /* --- Troubleshooting Box --- */
                .troubleshooting-box {
                    background-color: #f0f4ff; 
                    border: 1px solid #d0d7e6; 
                    border-radius: 15px; 
                    padding: 15px;
                    margin-top: 20px; 
                    text-align: left;
                    display: flex;
                    gap: 10px;
                    max-width: 100%; 
                    margin: 20px auto 0 auto; 
                }
                
                .info-icon-wrapper {
                    color: #4c6298; 
                    padding-top: 2px;
                }
                
                .troubleshooting-content {
                    flex-grow: 1;
                }
                
                .troubleshooting-title {
                    font-weight: 700;
                    color: #4c6298;
                    margin: 0 0 5px 0;
                }
                
                .troubleshooting-content ul {
                    list-style: none;
                    padding-left: 0;
                    margin: 0;
                    font-size: 0.9rem;
                    color: #555;
                    line-height: 1.6;
                }
                
                .troubleshooting-content ul li::before {
                    content: "•";
                    color: #4c6298;
                    font-weight: bold;
                    display: inline-block;
                    width: 1em;
                    margin-left: -1em;
                } 
                `}
            </style>
            
            <div className="verification-container">
                
                <div className="icon-circle">
                    <Mail className="mail-icon" size={32} />
                </div>

                <h2 className="title">Verificar correo electrónico</h2>
                <p className="subtitle">Ingresa el código que enviamos a tu correo</p>

                <form onSubmit={handleSubmit} className="verification-form">
                    
                    <label htmlFor="email" className="label">Correo electrónico</label>
                    <input
                        id="email"
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        className="input email-input"
                        placeholder="Tu correo electrónico"
                        required
                        disabled={isLoading}
                    />

                    {renderMessage()} 
                    
                    <button
                        type="button"
                        onClick={handleReenviar}
                        className={`button resend-button ${!correo || isLoading ? 'disabled' : ''}`}
                        disabled={!correo || isLoading}
                    >
                        <span className="icon-text-wrapper">
                            <RefreshCw size={20} />
                            {isLoading ? 'Enviando...' : 'Reenviar código'}
                        </span>
                    </button>

                    <label htmlFor="code" className="label-code">Código de verificación</label>
                    <input
                        id="code"
                        type="text"
                        value={codigoVerificacion}
                        onChange={(e) => setCodigoVerificacion(e.target.value.replace(/[^0-9A-Z]/g, '').toUpperCase())}
                        className="input code-input"
                        maxLength={6}
                        placeholder="ABC123" 
                        required
                        disabled={isLoading}
                    />
                    <p className="code-hint">Ingresa el código alfanumérico de 6 dígitos</p>

                    <button
                        type="submit"
                        className={`button verify-button ${!isCodeValid || isLoading ? 'disabled' : ''}`}
                        disabled={!isCodeValid || isLoading} 
                    >
                        <span className="icon-text-wrapper">
                            <CheckCircle size={20} />
                            {isLoading ? 'Verificando...' : 'Verificar código'}
                        </span>
                    </button>
                </form>

                <div className="troubleshooting-box">
                    <div className="info-icon-wrapper">
                        <Info size={20} />
                    </div>
                    <div className="troubleshooting-content">
                        <p className="troubleshooting-title">¿No recibes el correo?</p>
                        <ul>
                            <li>Revisa tu carpeta de **spam** o correo no deseado</li>
                            <li>Asegúrate de haber ingresado el correo **correcto**</li>
                            <li>El código tiene una validez limitada (10 minutos)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PantallaVerificacionCorreo;
