import React, { useState } from 'react';
import { Mail, RefreshCw, CheckCircle, Info } from 'lucide-react'; 
import "../../../styles/PantallaVerificacionCorreo.css";


const PantallaVerificacionCorreo = () => {
    const [correo, setCorreo] = useState('');
    const [codigoVerificacion, setCodigoVerificacion] = useState('');

    const isCodeValid = codigoVerificacion.length === 6;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Verificando código:', codigoVerificacion);
    };

    const handleReenviar = () => {
        console.log('Reenviando código a:', correo);
    };

    return (
        <div className="centered-page"> 
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
                    />

                    <button
                        type="button"
                        onClick={handleReenviar}
                        className="button resend-button"
                        disabled={!correo}
                    >
                        <span className="icon-text-wrapper">
                            <RefreshCw size={20} />
                            Reenviar código
                        </span>
                    </button>

                    <label htmlFor="code" className="label-code">Código de verificación</label>
                    <input
                        id="code"
                        type="text"
                        value={codigoVerificacion}
                        onChange={(e) => setCodigoVerificacion(e.target.value.replace(/[^0-9]/g, ''))}
                        className="input code-input"
                        maxLength={6}
                        placeholder="123456"
                    />
                    <p className="code-hint">Ingresa el código de 6 dígitos</p>

                    <button
                        type="submit"
                        className={`button verify-button ${!isCodeValid ? 'disabled' : ''}`}
                        disabled={!isCodeValid} 
                    >
                        <span className="icon-text-wrapper">
                            <CheckCircle size={20} />
                            Verificar código
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
                            <li>Usa el botón **'Reenviar código'** para intentar nuevamente</li>
                            <li>El código tiene una validez limitada</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PantallaVerificacionCorreo;