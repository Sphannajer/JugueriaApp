package com.tiajulia.backend.producto.model;

import jakarta.persistence.*; // Importa anotaciones JPA
import lombok.Data; // Importa Lombok
import java.math.BigDecimal; // Para manejar números decimales con precisión
import com.tiajulia.backend.inventario.model.Insumo; // Importamos el modelo de Insumo

// Marca esta clase como una entidad de base de datos
@Entity
// Especifica el nombre de la tabla de unión en la BD
@Table(name = "recetas_productos")
// Genera automáticamente Getters, Setters, etc.
@Data
public class RecetaProducto {

    // Usa una clase embebida para representar la clave primaria compuesta (IDs de Producto e Insumo)
    @EmbeddedId
    private RecetaProductoId id;

    // Mapea la columna que indica la cantidad del insumo requerida para el producto
    @Column(name = "cantidad_requerida", precision = 10, scale = 2)
    private BigDecimal cantidadRequerida;

    // Define la relación Muchos a Uno (Muchos RecetasProducto a un solo Insumo)
    @ManyToOne(fetch = FetchType.LAZY) // Carga el insumo solo cuando se accede a él (carga perezosa)
    // Indica que este campo usa la parte 'idInsumo' de la clave compuesta (@EmbeddedId)
    @MapsId("idInsumo")
    // Define la columna de clave foránea a la tabla de Insumos
    @JoinColumn(name = "id_insumo") 
    private Insumo insumo;
    
    // Define la relación Muchos a Uno (Muchos RecetasProducto a un solo Producto)
    @ManyToOne(fetch = FetchType.LAZY) // Carga el producto solo cuando se accede a él
    // Indica que este campo usa la parte 'idProducto' de la clave compuesta (@EmbeddedId)
    @MapsId("idProducto")
    // Define la columna de clave foránea a la tabla de Productos
    @JoinColumn(name = "id_producto")
    private Producto producto;
}