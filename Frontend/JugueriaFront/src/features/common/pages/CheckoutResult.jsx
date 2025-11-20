// src/pages/CheckoutResult.jsx
import React, { useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getDraft, clearDraft } from "../../products/services/productoApi";
import { useToast } from "../../../ui/toast";
import { useCart } from "../../../components/Slide-Cart/CartContext";
import "../../../styles/checkout-result.css";

export default function CheckoutResult({ forcedStatus }) {
  const [sp] = useSearchParams();
  const toast = useToast();
  const { clearCart } = useCart?.() || {};

  // status puede venir por query (auto_return) o forzado por ruta
  const status = forcedStatus || sp.get("status") || "success";
  const paymentId = sp.get("payment_id") || null;
  const draft = useMemo(() => getDraft(), []);

  useEffect(() => {
    // Limpia carrito local
    try {
      clearDraft();
      if (typeof clearCart === "function") clearCart();
      else localStorage.removeItem("cart");
    } catch {
      /* empty */
    }
    if (status === "success") toast.success("¡Pago recibido! 🎉");
    else if (status === "pending") toast.info("Tu pago está pendiente.");
    else toast.error("El pago no se completó.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const title = {
    success: "¡Gracias por tu compra!",
    pending: "Pago pendiente",
    failure: "No se pudo completar el pago",
  }[status];

  const lead = {
    success:
      "Hemos registrado tu orden. Te enviaremos novedades al confirmar el pago.",
    pending:
      "Mercado Pago está procesando tu pago. Te avisaremos apenas se acredite.",
    failure: "Algo salió mal. Puedes intentar nuevamente.",
  }[status];

  return (
    <main className="chk-main">
      <section className={`chk-card chk-${status}`}>
        <div className="chk-icon" aria-hidden />
        <h1>{title}</h1>
        <p className="chk-lead">{lead}</p>

        {paymentId && (
          <p className="chk-small">
            ID de pago: <strong>{paymentId}</strong>
          </p>
        )}

        {draft?.items?.length ? (
          <div className="chk-summary">
            <h2>Resumen</h2>
            <ul>
              {draft.items.map((it) => (
                <li key={it.id}>
                  <span>Producto #{it.id}</span>
                  <span>x{it.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="chk-actions">
          <Link className="chk-btn" to="/">
            Volver a la tienda
          </Link>
        </div>
      </section>
    </main>
  );
}
