import React from 'react'; 
import './ProductCard.css';
import { getProductImageUrl } from '../../features/products/services/productoApi';
import { useCart } from "../Slide-Cart/CartContext";

function ProductCard({ product }) {
    const { addToCart } = useCart();
    
    const imageUrl = getProductImageUrl(product.urlImagen); 
    
    const handleImageError = (e) => {
        e.target.onerror = null; 
        e.target.src = "https://placehold.co/600x400/ff9900/ffffff?text=No+Imagen";
    };

    const isAvailable = product.disponible !== false;

    if (!product) return null;

    return (
        <div className={`product-card ${!isAvailable ? 'unavailable' : ''}`}>
            {/* Opcional: Si está agotado, puedes poner la imagen un poco transparente o en gris */}
            <img 
                src={imageUrl}
                alt={product.nombre} 
                className="product-image" 
                style={!isAvailable ? { filter: 'grayscale(100%)', opacity: '0.7' } : {}}
                onError={handleImageError} 
            />
            <div className="product-content">
                <h3 className="product-title">{product.nombre}</h3>
                <p className="product-description">{product.descripcion}</p>
                
                <div className="product-price">
                    S/{product.precio !== undefined && product.precio !== null 
                        ? product.precio.toFixed(2) 
                        : '0.00'} 
                </div>
                {isAvailable ? (
                    <button className="add-to-cart-button" onClick={() => addToCart(product)}>
                        Agregar
                    </button>
                ) : (
                    <button 
                        className="add-to-cart-button" 
                        disabled
                        style={{ 
                            backgroundColor: '#9ca3af', // Un gris para indicar deshabilitado
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