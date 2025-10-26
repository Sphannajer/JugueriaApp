import React from 'react';
import './ProductCard.css';
import { getProductImageUrl } from '../../features/products/services/productoApi';
function ProductCard({ product }) {
    

    const imageUrl = getProductImageUrl(product.urlImagen);
    const handleImageError = (e) => {
        e.target.onerror = null; 
        e.target.src = "https://placehold.co/600x400/ff9900/ffffff?text=No+Imagen";
    };

    return (
        <div className="product-card">
            <img 
                src={imageUrl}
                alt={product.nombre} 
                className="product-image" 
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
                <button className="add-to-cart-button">Agregar</button>
            </div>
        </div>
    );
}

export default ProductCard;