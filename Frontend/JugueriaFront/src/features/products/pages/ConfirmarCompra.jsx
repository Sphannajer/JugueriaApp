// Archivo: src/pages/ConfirmarCompra.jsx (o donde pongas tus páginas)

import React from 'react';
import { useCart } from '../../../components/Slide-Cart/CartContext';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';

const ConfirmarCompra = () => {
    const { cartItems, cartTotal, finalizePurchase, clearCart } = useCart();
    const navigate = useNavigate();

    // Redirigir si el carrito está vacío (seguridad)
    if (cartItems.length === 0) {
        navigate('/menu');
        return null;
    }

    const handleFinalizarCompra = async () => {
        // CORRECCIÓN: 1. Construir el payload completo para OrdenRequestDTO
        const orderData = {
            total: cartTotal, 
            detalles: cartItems.map(item => ({
                idProducto: item.id,
                cantidad: item.quantity,
                precioUnitario: item.precio || item.price, 
            }))
        };
        
        // CORRECCIÓN: 2. Ejecutar la venta pasando el orderData
        const result = await finalizePurchase(orderData);
        
        // 3. Si la venta fue exitosa, navegamos
        if (result.success) {
            navigate('/gracias-por-su-compra'); 
        }
    };

    return (
        <>
            <Header />
            <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <h2>🛒 Resumen y Confirmación de Compra</h2>
                <p>Verifica los detalles de tu pedido antes de finalizar.</p>

                <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    {cartItems.map((item) => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                            <span>{item.nombre || item.name} (x{item.quantity})</span>
                            <span>S/{(item.precio * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div style={{ borderTop: '1px solid #eee', marginTop: '1rem', paddingTop: '1rem', textAlign: 'right', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        Total Final: S/{cartTotal.toFixed(2)}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button 
                        onClick={() => navigate('/menu')} 
                        style={{ padding: '0.8rem 1.5rem', background: '#ccc', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                        ⬅️ Modificar Pedido
                    </button>
                    <button 
                        onClick={handleFinalizarCompra} 
                        style={{ padding: '0.8rem 1.5rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                        ✅ Finalizar Compra
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ConfirmarCompra;