import React from 'react';
import './ProductAdminTable.css'; // Estilos específicos para la tabla de administración

// Componente funcional que recibe la lista de productos y las funciones de acción
function ProductAdminTable({ products, onEdit, onDelete, getImageUrl }) {
    // Renderizado condicional: Muestra un mensaje si no hay productos
    if (products.length === 0) {
        return <p>No hay productos registrados. Utiliza el botón "Crear Nuevo Producto" para empezar.</p>;
    }

    return (
        <div className="table-responsive"> {/* Contenedor para manejar el scroll horizontal en móvil */}
            <table className="admin-product-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Imagen</th> 
                        <th>Nombre</th> 
                        <th>Descripción</th> 
                        <th>Precio</th>
                        <th>Categoría</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Mapea la lista de productos para renderizar cada fila */}
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>
                                {/* Usa la función getImageUrl para obtener la ruta correcta de la imagen */}
                                <img 
                                    src={getImageUrl(product.urlImagen)} 
                                    alt={product.nombre} 
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                                />
                            </td>
                            <td>{product.nombre}</td>
                            <td>{product.descripcion}</td>
                            
                            <td>S/ {product.precio.toFixed(2)}</td> {/* Formatea el precio a dos decimales */}
                            
                            <td>{product.categoria.nombre}</td> 
                            <td className="actions">
                                {/* Botón que dispara la función de edición con el objeto producto */}
                                <button className="btn-edit" onClick={() => onEdit(product)}>
                                    Editar
                                </button>
                                {/* Botón que dispara la función de eliminación con el ID del producto */}
                                <button className="btn-delete" onClick={() => onDelete(product.id)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductAdminTable;