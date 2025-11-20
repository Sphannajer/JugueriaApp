import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useCart } from "./CartContext";
import { getProductImageUrl } from "../../features/products/services/productoApi";
import "../Slide-Cart/Slide-Cart.css";

const SlideCart = () => {
  const {
    isCartOpen,
    cartItems,
    closeCart,
    removeFromCart,
    cartTotal,
    updateQuantity,
  } = useCart();

  // Estado para deshabilitar el botón mientras carga
  const [loading, setLoading] = useState(false);

  // Función para procesar el pago
  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Limpiamos los datos para enviar SOLO lo que el backend necesita (id y cantidad)
      const itemsLimpios = cartItems.map((item) => ({
        id: Number(item.id),
        quantity: Number(item.quantity),
      }));

      console.log("Enviando items al backend:", itemsLimpios);

      const response = await fetch(
        "http://localhost:8080/api/checkout/preference",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Enviamos la lista limpia
          body: JSON.stringify({ items: itemsLimpios }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Si existe el link de pago, redirigimos
        if (data.init_point) {
          window.location.href = data.init_point;
        } else {
          console.error("La respuesta no tiene init_point", data);
          alert("Error: No se recibió el link de pago.");
        }
      } else {
        // Intentamos leer el error del backend si es posible
        const errorData = await response.json().catch(() => ({}));
        console.error("Error del servidor:", response.status, errorData);
        alert(
          `Hubo un error al procesar el pago: ${
            errorData.message || "Intente nuevamente"
          }`
        );
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("No se pudo conectar con el Backend.");
    } finally {
      setLoading(false);
    }
  };

  console.log("SlideCart render:", { isCartOpen, cartItems });

  if (!isCartOpen) return null;

  return (
    <>
      <div className="slide-cart-overlay" onClick={closeCart} />
      <aside className="slide-cart">
        <div className="slide-cart-header">
          <h3>Tu carrito ({cartItems.length})</h3>
          <button className="close-btn" onClick={closeCart}>
            <FaTimes />
          </button>
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
                      ? getProductImageUrl(item.urlImagen)
                      : "https://placehold.co/100x100/ff9900/ffffff?text=Sin+Imagen"
                  }
                  alt={item.nombre || item.name}
                  className="cart-item-img"
                />
                <div className="cart-item-body">
                  <h4>{item.nombre || item.name}</h4>

                  <div className="cart-item-controls">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="qty-btn"
                    >
                      -
                    </button>
                    <span className="qty">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, +1)}
                      className="qty-btn"
                    >
                      +
                    </button>
                    <button
                      className="remove"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                <div className="cart-item-price">
                  S/
                  {((item.precio || item.price || 0) * item.quantity).toFixed(
                    2
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            Total: <strong>S/{cartTotal.toFixed(2)}</strong>
          </div>
          <div className="cart-buttons">
            {/* AQUÍ ESTABA EL ERROR: Se cambió handlePay por handlePayment */}
            <button
              className="pay-btn"
              onClick={handlePayment}
              disabled={loading || cartItems.length === 0}
            >
              {loading ? "Redirigiendo…" : "Procesar Pago"}
            </button>
            <button
              className="continue-btn"
              onClick={closeCart}
              disabled={loading}
            >
              Continuar comprando
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SlideCart;
