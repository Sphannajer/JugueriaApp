import React, { createContext, useMemo, useState } from "react";
import "./toast.css";

// eslint-disable-next-line react-refresh/only-export-components
export const ToastContext = createContext(null);

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const api = useMemo(() => ({
    show(msg, type = "info", ttl = 3000) {
      const id = Math.random().toString(36).slice(2);
      setToasts(t => [...t, { id, msg, type }]);
      setTimeout(() => {
        setToasts(t => t.filter(x => x.id !== id));
      }, ttl);
    },
    success(m, ttl) { this.show(m, "success", ttl); },
    error(m, ttl) { this.show(m, "error", ttl); },
    info(m, ttl) { this.show(m, "info", ttl); },
  }), []);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast--${t.type}`}>
            <span className="toast-dot" />
            <div className="toast-text">{t.msg}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
