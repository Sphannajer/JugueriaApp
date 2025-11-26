package com.tiajulia.backend.producto.model;

import jakarta.persistence.*; // Importa anotaciones JPA (Java Persistence API)
import lombok.Data; // Importa Lombok

// Marca esta clase como una entidad JPA que representa una tabla en la BD
@Entity
// Especifica el nombre de la tabla en la base de datos
@Table(name = "productos")
// Genera automáticamente Getters, Setters, etc.
@Data 
public class Producto {

    // Marca este campo como la clave primaria (Primary Key)
    @Id
    // Configura la generación automática de la clave (autoincremental de la BD)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // Especifica el nombre de la columna en la BD
    @Column(name = "id_producto") 
    private Integer id; // ID del producto

    // Mapea a la columna 'nombre', no puede ser nulo
    @Column(name = "nombre", nullable = false)
    private String nombre;

    // Mapea a la columna 'descripcion'
    @Column(name = "descripcion")
    private String descripcion;

    // Mapea a la columna 'subcategoria'
    @Column(name = "subcategoria")
    private String subcategoria; 

    // Mapea a la columna 'precio', no puede ser nulo
    @Column(name = "precio", nullable = false)
    private Double precio; 

    // Mapea a la columna 'stock', no puede ser nulo
    @Column(name = "stock", nullable = false)
    private Integer stock; // Cantidad disponible en inventario

    // Mapea a la columna 'url_imagen'
    @Column(name = "url_imagen")
    private String urlImagen; // Ruta o URL de la imagen del producto
 
    // Define la relación de muchos productos a una categoría (Many-to-One)
    @ManyToOne 
    // Define la columna de la clave foránea en la tabla 'productos'
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria; // Objeto que representa la categoría relacionada
    
}