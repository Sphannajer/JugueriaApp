import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useCart } from "../Slide-Cart/CartContext";
import "../Slide-Cart/Slide-Cart.css";
import naranjaImg from "../../assets/naranja.jpg"
import fresaImg from "../../assets/fresa.jpg"


const SlideCart = () => {
  const { isCartOpen, closeCart } = useCart();

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Jugo de Fresa",
      description: "Fresa natural, fría y refrescante",
      price: 7.0,
      quantity: 1,
      image: fresaImg,
    },
    {
      id: 2,
      name: "Jugo de Naranja",
      description: "Naranja dulce y refrescante",
      price: 7.0,
      quantity: 1,
      image: naranjaImg,
    },
  ]);

  const handleQuantityChange = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
    );
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  return (
    <>
      <div
        className={`overlay ${isCartOpen ? "show" : ""}`}
        onClick={closeCart}
      ></div>

      <div className={`slide-cart ${isCartOpen ? "open" : ""}`}>
        <div className="cart-header">
            
          <h3>Carrito de Compras</h3>
          <button className="close-btn" onClick={closeCart}>
            ✕
          </button>
        </div>
        <p className="cart-subtitle">
          Revise y administre cuidadosamente los productos del carrito
        </p>

        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="item-info">
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <span className="price">S/ {item.price.toFixed(2)}</span>
              </div>
              <div className="quantity-controls">
                <button onClick={() => handleQuantityChange(item.id, -1)}>
                  −
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.id, 1)}>
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>S/ {subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>IGV (18%)</span>
            <span>S/ {igv.toFixed(2)}</span>
          </div>
          <hr />
          <div className="summary-row total">
            <strong>Total</strong>
            <strong>S/ {total.toFixed(2)}</strong>
          </div>
        </div>

        <div className="cart-buttons">
          <button className="pay-btn">Procesar Pago</button>
          <button className="continue-btn" onClick={closeCart}>
            Continuar Comprando
          </button>
        </div>
      </div>
    </>
  );
};

export default SlideCart;

