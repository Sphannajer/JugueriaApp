import React from 'react'; 
import './ProductCard.css'; // Estilos para la tarjeta de producto
import { getProductImageUrl } from '../../features/products/services/productoApi'; // Utilidad para la URL de la imagen
import { useCart } from "../Slide-Cart/CartContext"; // Hook para acceder a las funciones del carrito

// Componente que muestra la información de un solo producto
function ProductCard({ product }) {
    // Extrae la función para añadir productos del contexto del carrito
    const { addToCart } = useCart();
    
    // Obtiene la URL de la imagen usando la utilidad
    const imageUrl = getProductImageUrl(product.urlImagen); 
    
    // Función para manejar errores de carga de la imagen (usa una imagen placeholder)
    const handleImageError = (e) => {
        e.target.onerror = null; // Evita bucles infinitos de error
        e.target.src = "https://placehold.co/600x400/ff9900/ffffff?text=No+Imagen";
    };

    // Lógica para determinar la disponibilidad basada en el DTO (calculado en el Backend)
    const isAvailable = product.disponible !== false;

    if (!product) return null;

    return (
        // Clase dinámica: agrega 'unavailable' si el producto no está disponible
        <div className={`product-card ${!isAvailable ? 'unavailable' : ''}`}>
            {/* Imagen del producto */}
            <img 
                src={imageUrl}
                alt={product.nombre} 
                className="product-image" 
                // Estilo condicional: escala de grises y opacidad si no está disponible
                style={!isAvailable ? { filter: 'grayscale(100%)', opacity: '0.7' } : {}}
                onError={handleImageError} // Llama al manejador de error de imagen
            />
            <div className="product-content">
                <h3 className="product-title">{product.nombre}</h3>
                <p className="product-description">{product.descripcion}</p>
                
                <div className="product-price">
                    {/* Muestra el precio formateado a dos decimales */}
                    S/{product.precio !== undefined && product.precio !== null 
                        ? product.precio.toFixed(2) 
                        : '0.00'} 
                </div>
                {/* Renderizado condicional del botón de acción */}
                {isAvailable ? (
                    // Botón para agregar al carrito (activo)
                    <button className="add-to-cart-button" onClick={() => addToCart(product)}>
                        Agregar
                    </button>
                ) : (
                    // Botón de "Agotado" (deshabilitado)
                    <button 
                        className="add-to-cart-button" 
                        disabled
                        style={{ 
                            backgroundColor: '#9ca3af',
                            cursor: 'not-allowed', 
                            borderColor: '#9ca3af',
                            opacity: 0.8
                        }}
                    >
                        Agotado
                    </button>
                )}
            </div>
        </div>
    );
}

export default ProductCard;