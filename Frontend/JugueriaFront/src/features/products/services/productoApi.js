// src/features/products/services/productoApi.js

// --- URLs Base ---
const API_URL = "http://localhost:8080/api/productos";
const FILTER_BASE_URL = "http://localhost:8080/api/productos/filtrar";
const BASE_URL = "http://localhost:8080";
const FRONTEND_BASE_URL = "http://localhost:5173";
const CHECKOUT_API = `${BASE_URL}/api/checkout`; // URL para checkout

// --- Clave para LocalStorage ---
const DRAFT_KEY = "checkout:draft"; // Para guardar borrador del carrito

export const getAllProductos = async (
  categoryName = null,
  subcategoryName = null
) => {
  let url = categoryName && categoryName !== "all" ? FILTER_BASE_URL : API_URL;

  if (categoryName && categoryName !== "all") {
    const params = new URLSearchParams();
    params.append("categoria", categoryName);
    if (subcategoryName) {
      params.append("subcategoria", subcategoryName);
    }
    url = `${FILTER_BASE_URL}?${params.toString()}`;
  }

  console.log("Fetching Productos con URL:", url);

  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Fallo al obtener productos. URL: ${url}. Error: ${errorText}`
    );
  }
  return response.json();
};

export const getAllCategorias = async () => {
  const response = await fetch(`${BASE_URL}/api/categorias`); // Usar BASE_URL
  if (!response.ok) throw new Error("Fallo al obtener categorías.");
  return response.json();
};

export const createProducto = async (formData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Fallo al crear producto: ${response.status} - ${errorText}`
    );
  }
  return response.json();
};

export const updateProducto = async (id, formData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Fallo al actualizar producto: ${response.status} - ${errorText}`
    );
  }
  return response.json();
};

export const deleteProducto = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Fallo al eliminar producto.");
  return true;
};

export const getProductImageUrl = (filename) => {
  if (!filename) return "/default-product.png"; // Considera tener una imagen por defecto

  // Si ya tienes imágenes locales en /public/images/
  if (filename.startsWith("imagenes/")) {
    const correctedPath = filename.replace("imagenes/", "images/");
    return `/${correctedPath}`;
  }

  // Para imágenes subidas al backend
  return `${BASE_URL}/api/productos/uploads/${filename}`; // Ajusta la ruta base
};

// ==============================================
// === FUNCIONES NUEVAS PARA MERCADOPAGO PAGO ===
// ==============================================

// --- Funciones auxiliares para el borrador del carrito ---

function cleanItems(cartItems = []) {
  return (Array.isArray(cartItems) ? cartItems : [])
    .filter((it) => it && it.id != null)
    .map((it) => ({
      id: Number(it.id),
      // Asegúrate que el item tenga 'quantity', si no, usa 1
      quantity: Math.max(1, Number(it.quantity ?? 1)),
    }));
}

function saveDraft(items) {
  const payload = { items, ts: Date.now() };
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error("Error saving draft:", e);
  }
}

export function getDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.items?.length) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (e) {
    console.error("Error clearing draft:", e);
  }
}

// --- Función genérica para Fetch con Timeout ---

async function fetchJSON(url, opts = {}, timeoutMs = 12000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...opts, signal: ctrl.signal });
    const text = await res.text(); // Lee el texto SIEMPRE para logs o errores
    if (!res.ok) {
      // Intenta parsear el error si es JSON, si no, usa el texto
      let errorBody = text;
      try {
        errorBody = JSON.parse(text);
      } catch (e) {
        /* No era JSON, usa el texto crudo */
      }

      // Construye un mensaje de error más útil
      const errorMessage =
        errorBody?.message ||
        errorBody?.mensaje ||
        text ||
        `HTTP ${res.status}`;
      console.error("Fetch Error:", {
        status: res.status,
        url,
        options: opts,
        responseBody: errorBody,
      });
      throw new Error(errorMessage);
    }
    // Si la respuesta es OK, intenta parsear como JSON, si está vacío devuelve {}
    return text ? JSON.parse(text) : {};
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("La solicitud tardó demasiado tiempo (timeout)");
    }
    // Re-lanza el error (ya sea el original o el Error construido en el bloque !res.ok)
    throw err;
  } finally {
    clearTimeout(t);
  }
}

// --- Función para Crear la Preferencia en el Backend ---

export async function crearPreferencia(cartItems = []) {
  const items = cleanItems(cartItems);
  if (!items.length) throw new Error("Tu carrito está vacío");

  saveDraft(items); // Guarda borrador antes de redirigir

  console.log("Enviando items al backend:", items); // Log para depurar

  // Llama al endpoint correcto del backend
  const data = await fetchJSON(`${CHECKOUT_API}/preference`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }), // Asegúrate que el backend espera { "items": [...] }
  });

  // El backend debería devolver init_point o sandbox_init_point
  const url = data?.init_point || data?.sandbox_init_point;
  if (!url) {
    console.error("Respuesta del backend sin URL de checkout:", data);
    throw new Error("El backend no devolvió la URL de MercadoPago");
  }

  console.log("Preferencia creada:", data); // Log para depurar
  return { ...data, init_point: url }; // Devuelve la data + la URL confirmada
}

// --- Función para Iniciar el Pago (llamada desde el botón) ---

export async function pagar(cartItems = []) {
  try {
    console.log("Iniciando proceso de pago con items:", cartItems); // Log
    const pref = await crearPreferencia(cartItems);
    console.log("Redirigiendo a MercadoPago:", pref.init_point); // Log
    // replace evita volver al carrito con el botón “atrás” del navegador
    window.location.replace(pref.init_point);
  } catch (error) {
    console.error("Error en la función pagar:", error);
    // Muestra un error más descriptivo al usuario
    alert(`No se pudo iniciar el pago: ${error.message}`);
    // Considera usar un sistema de notificaciones (toast) en lugar de alert
    // import { toast } from 'react-toastify';
    // toast.error(`No se pudo iniciar el pago: ${error.message}`);
  }
}
