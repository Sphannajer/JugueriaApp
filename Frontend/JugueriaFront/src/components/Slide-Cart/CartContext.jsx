import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  let toastShown = false;

  useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  //Agregar producto al carrito
  //Agregar producto al carrito
const addToCart = (item) => {
  setCartItems((prev) => {
    const existing = prev.find((p) => p.id === item.id);

    if (existing) {
      // Si ya existe, solo aumenta cantidad
      if (!toastShown) {
        toast.info(`${item.name} cantidad actualizada`, { autoClose: 1500 });
        toastShown = true;
        setTimeout(() => (toastShown = false), 300);
      }

      return prev.map((p) =>
        p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
      );
    }

    // Si es nuevo, lo agrega
    if (!toastShown) {
      toast.success(`${item.name} agregado al carrito`, { autoClose: 1500 });
      toastShown = true;
      setTimeout(() => (toastShown = false), 300);
    }

    return [...prev, { ...item, quantity: 1 }];
  });
};


  //Eliminar un producto
  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const removed = prev.find((p) => p.id === id);
      toast.warn(`${removed?.name || "Producto"} eliminado`);
      return prev.filter((p) => p.id !== id);
    });
  };

  //Vaciar carrito
  const clearCart = () => {
    setCartItems([]);
    toast.error("Carrito vaciado");
  };

  //Actualizar cantidad
  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, quantity: Math.max(1, p.quantity + delta) }
          : p
      )
    );
  };

  //Calcular total
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        isCartOpen,
        openCart,
        closeCart,
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};