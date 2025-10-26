import React, { useEffect, useState } from "react";
import "./ProductCard.css";
import { getProductImageUrl } from "../../features/products/services/productoApi";
import { useCart } from "../Slide-Cart/CartContext"; // Ajusta la ruta si es diferente

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (!product?.urlImagen) {
      setImageSrc("https://placehold.co/600x400/ff9900/ffffff?text=No+Imagen");
      return;
    }

    const imageUrl = getProductImageUrl(product.urlImagen);

    // Si tu API usa JWT, aquí podrías obtenerlo desde localStorage
    const token = localStorage.getItem("token");

    fetch(imageUrl, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "include", // Por si usa cookies
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar imagen");
        return res.blob();
      })
      .then((blob) => {
        setImageSrc(URL.createObjectURL(blob));
      })
      .catch(() => {
        setImageSrc("https://placehold.co/600x400/ff9900/ffffff?text=No+Imagen");
      });
  }, [product?.urlImagen]);

  if (!product) return null;

  return (
    <div className="product-card">
      <img
        src={imageSrc || "https://placehold.co/600x400/ff9900/ffffff?text=Cargando..."}
        alt={product.nombre}
        className="product-image"
      />
      <div className="product-content">
        <h3 className="product-title">{product.nombre}</h3>
        <p className="product-description">{product.descripcion}</p>
        <div className="product-price">
          S/{!isNaN(parseFloat(product.precio)) ? parseFloat(product.precio).toFixed(2) : "0.00"}
        </div>
        <button className="add-to-cart-button" onClick={() => addToCart(product)}>
          Agregar
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
