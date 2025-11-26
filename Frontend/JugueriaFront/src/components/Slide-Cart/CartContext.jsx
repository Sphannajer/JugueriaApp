import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify"; // Librería para mostrar notificaciones
// Asegúrate que esta sea la ruta correcta
import { procesarFinalizarCompra } from "../../features/products/services/ordenService"; // Importa la función API de checkout

const CartContext = createContext(); // Crea el contexto para el carrito

// Hook personalizado para consumir el contexto (simplifica el uso en componentes)
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart debe ser usado dentro de un CartProvider"); // Obliga el uso dentro del Provider
    }
    return context;
};

// Componente Provider que envuelve la aplicación y gestiona el estado
export const CartProvider = ({ children }) => {
    // Estado para controlar la visibilidad del sidebar del carrito
    const [isCartOpen, setIsCartOpen] = useState(false);
    
    // Inicialización con localStorage (carga el carrito guardado al iniciar)
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cartItems");
        // Parsea el JSON si existe, o inicializa como un array vacío
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Persistencia en localStorage (Guarda el carrito cada vez que cartItems cambia)
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]); // Dependencia del estado cartItems

    // Funciones para abrir y cerrar el carrito
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    // Función para añadir un ítem al carrito o incrementar su cantidad
    const addToCart = (item) => {
        // 1. Verificamos si el producto ya existe en el carrito
        const existing = cartItems.find((p) => p.id === item.id);

        if (existing) {
            // Si existe, muestra notificación de actualización
            toast.info(`${item.nombre || item.name} cantidad actualizada`, { autoClose: 1500 });
            
            // 3. Actualiza el estado: mapea y aumenta la cantidad en 1
            setCartItems((prev) => 
                prev.map((p) =>
                    p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
                )
            );
        } else {
            // Si es nuevo, muestra notificación de éxito
            toast.success(`${item.nombre || item.name} agregado al carrito`, { autoClose: 1500 });
            
            // 3. Actualiza el estado: añade el nuevo ítem con cantidad 1
            setCartItems((prev) => [...prev, { ...item, quantity: 1 }]);
        }
    };


    // Función para eliminar un ítem del carrito (independientemente de la cantidad)
    const removeFromCart = (id) => {
        let removedItem = null; 
        // Usa la forma funcional de `setCartItems` para acceder al estado anterior
        setCartItems((prev) => {
            removedItem = prev.find((p) => p.id === id); 
            return prev.filter((p) => p.id !== id); // Filtra para eliminar el ítem
        });
        
        if (removedItem) {
            toast.warn(`${removedItem.nombre || removedItem.name || "Producto"} eliminado`);
        }
    };

    // Función para vaciar completamente el carrito
    const clearCart = () => {
        setCartItems([]);
        toast.error("Carrito vaciado");
    };


    // Función para incrementar/decrementar la cantidad de un ítem
    const updateQuantity = (id, delta) => {
        setCartItems((prev) =>
            prev.map((p) =>
                p.id === id
                    // Asegura que la cantidad mínima sea 1
                    ? { ...p, quantity: Math.max(1, p.quantity + delta) }
                    : p
            )
            // Filtra los ítems que tengan cantidad mayor a 0 (aunque Math.max lo evita, esto es una capa de seguridad)
            .filter(p => p.quantity > 0) 
        );
    };


    // Calcula el total acumulado del carrito
    const cartTotal = cartItems.reduce(
        // Acumula la suma del precio * cantidad de cada ítem
        (total, item) => total + (item.precio || item.price || 0) * item.quantity,
        0
    );
    
    // NUEVA FUNCIÓN: FINALIZAR COMPRA (Integra el frontend con el servicio de órdenes)
    const finalizePurchase = async (orderData) => { // Recibe el DTO de la orden a enviar
        try {
            // Llama a la API para guardar la orden y descontar el stock
            const response = await procesarFinalizarCompra(orderData);
            
            // Si tiene éxito, vacía el carrito
            clearCart();
            toast.success("¡Compra finalizada y orden enviada con éxito!");
            return { success: true, message: response.message };

        } catch (error) {
            console.error("Error al finalizar compra:", error);
            // Mostrar error del servicio (ej: "Stock insuficiente")
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
                finalizePurchase, // Exportar la nueva función para que esté disponible globalmente
            }}
        >
            {children}
        </CartContext.Provider>
    );
};