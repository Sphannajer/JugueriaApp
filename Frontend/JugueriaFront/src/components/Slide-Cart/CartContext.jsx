import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
// Asegúrate que esta sea la ruta correcta
import { procesarFinalizarCompra } from "../../features/products/services/ordenService"; 

const CartContext = /*#__PURE__*/ createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart debe ser usado dentro de un CartProvider");
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    
    // Inicialización con localStorage
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cartItems");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Persistencia en localStorage
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    // --- CORRECCIÓN AQUÍ ---
    const addToCart = (item) => {
        // 1. Verificamos si existe usando la variable de estado actual (fuera del setter)
        const existing = cartItems.find((p) => p.id === item.id);

        if (existing) {
            // 2. Lanzamos el toast UNA SOLA VEZ
            toast.info(`${item.nombre || item.name} cantidad actualizada`, { autoClose: 1500 });
            
            // 3. Actualizamos el estado
            setCartItems((prev) => 
                prev.map((p) =>
                    p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
                )
            );
        } else {
            // 2. Lanzamos el toast UNA SOLA VEZ
            toast.success(`${item.nombre || item.name} agregado al carrito`, { autoClose: 1500 });
            
            // 3. Actualizamos el estado
            setCartItems((prev) => [...prev, { ...item, quantity: 1 }]);
        }
    };


    const removeFromCart = (id) => {
        let removedItem = null; 
        setCartItems((prev) => {
            removedItem = prev.find((p) => p.id === id); 
            return prev.filter((p) => p.id !== id);     
        });
        
        if (removedItem) {
            toast.warn(`${removedItem.nombre || removedItem.name || "Producto"} eliminado`);
        }
    };

    const clearCart = () => {
        setCartItems([]);
        toast.error("Carrito vaciado");
    };


    const updateQuantity = (id, delta) => {
        setCartItems((prev) =>
            prev.map((p) =>
                p.id === id
                    ? { ...p, quantity: Math.max(1, p.quantity + delta) }
                    : p
            ).filter(p => p.quantity > 0) // Aseguramos que se elimina si llega a 0
        );
    };


    const cartTotal = cartItems.reduce(
        (total, item) => total + (item.precio || item.price || 0) * item.quantity,
        0
    );
    
    // NUEVA FUNCIÓN: FINALIZAR COMPRA
    const finalizePurchase = async (orderData) => {
        try {
            // Llama a la API para guardar la orden y descontar el stock
            const response = await procesarFinalizarCompra(orderData);
            
            // Si tiene éxito, vacía el carrito
            clearCart();
            toast.success("¡Compra finalizada y orden enviada con éxito!");
            return { success: true, message: response.message };

        } catch (error) {
            console.error("Error al finalizar compra:", error);
            // Mostrar error del servicio
            toast.error(error.message || "Error al procesar la compra. Inténtalo de nuevo.");
            return { success: false, message: error.message || "Error desconocido." };
        }
    };


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
                finalizePurchase, // Exportar la nueva función
            }}
        >
            {children}
        </CartContext.Provider>
    );
};