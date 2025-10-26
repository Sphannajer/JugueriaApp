
import React from 'react';
import './ProductAdminTable.css';

function ProductAdminTable({ products, onEdit, onDelete, getImageUrl }) {
    if (products.length === 0) {
        return <p>No hay productos registrados. Utiliza el botón "Crear Nuevo Producto" para empezar.</p>;
    }

    return (
        <div className="table-responsive">
            <table className="admin-product-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Imagen</th> 
                        <th>Nombre</th> 
                    
                        <th>Descripción</th> 
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Categoría</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>
                           
                                <img 
                                    src={getImageUrl(product.urlImagen)} 
                                    alt={product.nombre} 
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                                />
                            </td>
                            <td>{product.nombre}</td>
                            
                        
                            <td>{product.descripcion}</td>
                            
                            <td>S/ {product.precio.toFixed(2)}</td>
                            <td>{product.stock}</td>
                           
                            <td>{product.categoria.nombre}</td> 
                            <td className="actions">
                                <button className="btn-edit" onClick={() => onEdit(product)}>
                                    Editar
                                </button>
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