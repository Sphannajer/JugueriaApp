import React from 'react';
import './ProductCard.css';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.name} className="product-image" />
      <div className="product-content">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">S/{product.price.toFixed(2)}</div>
        <button className="add-to-cart-button">Agregar</button>
      </div>
    </div>
  );
}

export default ProductCard;