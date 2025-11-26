import React from 'react';
import './Notification.css'; // Importa los estilos CSS para las notificaciones

// Componente funcional que recibe el mensaje y el tipo de notificación (ej: 'success', 'error', 'info')
function Notification({ message, type }) {
    // Construye el nombre de la clase CSS dinámicamente: 
    // Siempre tendrá 'notification-toast' y luego 'notification-tipo' (ej: notification-success)
    const className = `notification-toast notification-${type}`;

    return (
        
        // Renderiza el div con la clase dinámica para aplicar los estilos correspondientes
        <div className={className}>
            <p>{message}</p> {/* Muestra el mensaje recibido */}
        </div>
    );
}

export default Notification;