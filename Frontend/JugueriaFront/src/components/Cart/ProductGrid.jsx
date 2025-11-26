import React from 'react';
import ProductCard from './ProductCard'; // Importa el componente para renderizar un producto individual
import './ProductGrid.css'; // Estilos específicos para la cuadrícula

// Componente funcional que recibe la lista de productos a mostrar
function ProductGrid({ products }) {
    return (
        // Contenedor principal de la cuadrícula
        <section className="product-grid-container">
            {/* Mapea el array de productos y renderiza un ProductCard por cada elemento */}
            {products.map(product => (
                <ProductCard 
                    key={product.id} // Clave única requerida por React para las listas
                    product={product} // Pasa el objeto producto como prop
                />
            ))}
        </section>
    );
}

export default ProductGrid;