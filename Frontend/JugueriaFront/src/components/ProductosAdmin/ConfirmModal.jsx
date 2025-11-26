import React from 'react';
import './ConfirmModal.css'; // Estilos específicos para el modal de confirmación

// Componente funcional que recibe el nombre del ítem y las funciones de confirmación/cancelación
function ConfirmModal({ itemName, onConfirm, onCancel }) {
    
    // Función que previene que los clics dentro del modal se propaguen al overlay
    const handleModalClick = (e) => {
        e.stopPropagation(); // Detiene el evento para que no se ejecute onCancel del overlay
    };

    return (
        // Overlay: Al hacer clic aquí (fuera del contenido), se llama a onCancel
        <div className="form-modal-overlay" onClick={onCancel}>
            {/* Contenido del modal: se detiene la propagación para no cerrarse */}
            <div className="confirm-modal-content" onClick={handleModalClick}>
                <h2>Confirmar Eliminación</h2>
                <p>
                    ¿Estás seguro de que quieres eliminar **{itemName}**? 
                    Esta acción no se puede revertir.
                </p>
                <div className="confirm-modal-actions">
                    {/* Botón que llama a la función de cancelación del componente padre */}
                    <button 
                        className="btn-cancel" 
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                    {/* Botón que llama a la función de confirmación de eliminación del componente padre */}
                    <button 
                        className="btn-delete-confirm" 
                        onClick={onConfirm}
                    >
                        Sí, Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;