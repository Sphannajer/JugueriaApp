import React from 'react';
import './ConfirmModal.css'; 

function ConfirmModal({ itemName, onConfirm, onCancel }) {
    
    const handleModalClick = (e) => {
        e.stopPropagation(); 
    };

    return (
        <div className="form-modal-overlay" onClick={onCancel}>
            <div className="confirm-modal-content" onClick={handleModalClick}>
                <h2>Confirmar Eliminación</h2>
                <p>
                    ¿Estás seguro de que quieres eliminar {itemName}? 
                    Esta acción no se puede revertir.
                </p>
                <div className="confirm-modal-actions">
                    <button 
                        className="btn-cancel" 
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
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