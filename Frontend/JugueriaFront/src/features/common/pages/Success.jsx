import { useEffect } from "react";
import { useCart } from "../../components/Slide-Cart/CartContext";
export default function Success() {
  const { clearCart } = useCart();
  useEffect(() => {
    clearCart();
  }, []);
  return <div style={{ padding: 24 }}> Pago procesado papii¡Gracias!</div>;
}
