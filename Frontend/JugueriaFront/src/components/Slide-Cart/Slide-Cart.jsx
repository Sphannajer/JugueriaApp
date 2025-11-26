import React from "react";
import { FaTimes } from "react-icons/fa"; // Icono para el botón de cerrar
import { useCart } from "./CartContext"; // Hook para acceder al estado global del carrito
import { getProductImageUrl } from "../../features/products/services/productoApi"; // Utilidad para construir la URL de la imagen
import { useNavigate } from 'react-router-dom'; // Hook de React Router para la navegación
import "../Slide-Cart/Slide-Cart.css"; // Archivo de estilos

const SlideCart = () => {
    // Desestructura las funciones y estados necesarios del CartContext
    const { isCartOpen, cartItems, closeCart, removeFromCart, cartTotal, updateQuantity } = useCart();
    const navigate = useNavigate(); // Inicializa el hook de navegación de React Router
    
    console.log("SlideCart render:", { isCartOpen, cartItems });

    // Si el carrito no debe estar abierto, no renderiza nada (optimización)
    if (!isCartOpen) return null;

    // Función que se ejecuta al hacer clic en "Procesar Pago"
    const handleProcesarPago = () => {
        if (cartItems.length === 0) {
            closeCart();
            return; // No hace nada si el carrito está vacío
        }
        // Cierra el carrito
        closeCart(); 
        // Redirige al usuario a la página de confirmación de compra
        navigate('/confirmar-compra'); 
    };
    
    return ( 
        <>
            {/* Overlay oscuro que cubre el fondo y cierra el carrito al hacer clic */}
            <div className="slide-cart-overlay" onClick={closeCart} />
            {/* Contenedor principal del carrito lateral */}
            <aside className="slide-cart">
                <div className="slide-cart-header">
                    <h3>Tu carrito ({cartItems.length})</h3> {/* Muestra el número total de ítems */}
                    <button className="close-btn" onClick={closeCart}><FaTimes /></button> {/* Botón de cerrar */}
                </div>

                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <p className="empty">Tu carrito está vacío</p>
                    ) : ( 
                        cartItems.map((item) => (
                            <div className="cart-item" key={item.id}>
                                <img
                                    src={
                                        item.urlImagen
                                            // Usa la utilidad para obtener la URL correcta de la imagen
                                            ? getProductImageUrl(item.urlImagen)
                                            : "https://placehold.co/100x100/ff9900/ffffff?text=Sin+Imagen" // Imagen placeholder
                                    }
                                    alt={item.nombre || item.name}
                                    className="cart-item-img"
                                />
                                <div className="cart-item-body">
                                    <h4>{item.nombre || item.name}</h4>

                                    <div className="cart-item-controls">
                                        {/* Botón para decrementar la cantidad (-1) */}
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="qty-btn"
                                        >
                                            -
                                        </button>
                                        <span className="qty">{item.quantity}</span> {/* Muestra la cantidad actual */}
                                        {/* Botón para incrementar la cantidad (+1) */}
                                        <button
                                            onClick={() => updateQuantity(item.id, +1)}
                                            className="qty-btn"
                                        >
                                            +
                                        </button>
                                        {/* Botón para eliminar completamente el ítem */}
                                        <button className="remove" onClick={() => removeFromCart(item.id)}>
                                            Eliminar
                                        </button>
                                    </div>
                                </div>

                                <div className="cart-item-price">
                                    S/
                                    {/* Calcula y muestra el subtotal de la línea */}
                                    {((item.precio || item.price || 0) * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-footer">
                    <div className="cart-total">Total: <strong>S/{cartTotal.toFixed(2)}</strong></div> {/* Muestra el total global */}
                    <div className="cart-buttons">
                        <button 
                            className="pay-btn" 
                            onClick={handleProcesarPago} // Navega a la página de checkout
                        >
                            Procesar Pago
                        </button> 
                        <button className="continue-btn" onClick={closeCart}>Continuar comprando</button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default SlideCart;