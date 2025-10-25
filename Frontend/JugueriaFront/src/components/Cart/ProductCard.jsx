import React from 'react';
import { useCart } from '../Slide-Cart/CartContext';
import './ProductCard.css';

function ProductCard({ product }) {
const {addToCart} = useCart();


  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.name} className="product-image" />
      <div className="product-content">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">S/{product.price.toFixed(2)}</div>
        <button className="add-to-cart-button" onClick={() => addToCart(product)}>Agregar</button>
      </div>
    </div>
  );
}

export default ProductCard;