package com.tiajulia.backend.producto.model;
import jakarta.persistence.*; // Importa las anotaciones de persistencia de JPA (Java Persistence API)
import lombok.Data; // Importa la anotación Data de Lombok

// Anotación que marca esta clase como una entidad de base de datos JPA
@Entity
// Especifica el nombre de la tabla en la base de datos a la que se mapea esta entidad
@Table(name = "categorias")
// Anotación de Lombok que genera automáticamente Getters, Setters, toString, equals y hashCode
@Data 
public class Categoria {

    // Marca este campo como la clave primaria (Primary Key) de la entidad
    @Id
    // Configura cómo se genera el valor de la clave primaria (IDENTITY indica autoincremental de la BD)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCategoria; // Clave primaria

    // Define el mapeo de la columna en la base de datos
    @Column(name = "nombre", nullable = false, unique = true)
    private String nombre; // Nombre de la categoría (no puede ser nulo y debe ser único)

    
}