import React from "react";
import { FaTimes } from "react-icons/fa";
import { useCart } from "./CartContext";
import "../Slide-Cart/Slide-Cart.css";

const SlideCart = () => {
  const { isCartOpen, cartItems, closeCart, removeFromCart, clearCart, cartTotal, updateQuantity } = useCart();
  console.log("SlideCart render:", { isCartOpen, cartItems });

  if (!isCartOpen) return null;

  return (
    <>
      <div className="slide-cart-overlay" onClick={closeCart} />
      <aside className="slide-cart">
        <div className="slide-cart-header">
          <h3>Tu carrito ({cartItems.length})</h3>
          <button className="close-btn" onClick={closeCart}><FaTimes /></button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="empty">Tu carrito está vacío</p>
          ) : (
            cartItems.map(item => (
              <div className="cart-item" key={item.id}>
                <img src={item.imageUrl} alt={item.name} className="cart-item-img" />
                <div className="cart-item-body">
                  <h4>{item.name}</h4>
                  <div className="cart-item-controls">
                    <button onClick={() => updateQuantity(item.id, -1)} className="qty-btn">-</button>
                    <span className="qty">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, +1)} className="qty-btn">+</button>
                    <button className="remove" onClick={() => removeFromCart(item.id)}>Eliminar</button>
                  </div>
                </div>
                <div className="cart-item-price">S/{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">Total: <strong>S/{cartTotal.toFixed(2)}</strong></div>
          <div className="cart-buttons">
            <button className="pay-btn">Procesar Pago</button>
            <button className="continue-btn" onClick={closeCart}>Continuar comprando</button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SlideCart;