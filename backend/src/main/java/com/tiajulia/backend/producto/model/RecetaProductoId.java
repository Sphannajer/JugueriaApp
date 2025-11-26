package com.tiajulia.backend.producto.model;

import java.io.Serializable; // Necesaria para clases usadas como claves primarias de JPA
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable; // Importa la anotación para clases embebibles
import lombok.Data;

// Anotación que marca esta clase como embebible, es decir, parte de otra entidad
@Embeddable
// Genera automáticamente getters, setters, hashCode, equals, y toString (necesarios para claves compuestas)
@Data 
public class RecetaProductoId implements Serializable { // Debe implementar Serializable

    // Mapea la columna de la clave foránea a Producto
    @Column(name = "id_producto_integer")
    private Integer idProducto;

    // Mapea la columna de la clave foránea a Insumo
    @Column(name = "id_insumo_integer")
    private Integer idInsumo;
}