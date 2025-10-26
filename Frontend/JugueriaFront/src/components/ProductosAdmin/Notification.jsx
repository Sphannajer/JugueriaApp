

import React from 'react';
import './Notification.css'; 

function Notification({ message, type }) {
    const className = `notification-toast notification-${type}`;

    return (
        
        <div className={className}>
            <p>{message}</p>
        </div>
    );
}

export default Notification;