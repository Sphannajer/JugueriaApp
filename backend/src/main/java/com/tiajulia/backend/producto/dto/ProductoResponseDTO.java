package com.tiajulia.backend.producto.dto;

import com.tiajulia.backend.producto.model.Producto;
import com.tiajulia.backend.producto.model.Categoria;
import lombok.Data; // Anotación de Lombok que genera automáticamente getters, setters, equals, hashCode y toString

// DTO: Objeto de Transferencia de Datos. Contiene solo los campos que se enviarán al cliente.
@Data
public class ProductoResponseDTO {

    // Campos a exponer en la respuesta HTTP
    private Integer id; 
    private String nombre; 
    private String descripcion;
    private Double precio;
    private String urlImagen; 
    private String subcategoria;
    // Se incluye la entidad Categoria completa
    private Categoria categoria; 
    // Campo clave: Indica si el producto está disponible (calculado en el Service)
    private Boolean disponible;

    // CONSTRUCTOR 1: Usado típicamente en el Service al obtener listas
    public ProductoResponseDTO(Producto producto, Boolean disponible) {
        this.id = producto.getId(); // Mapea el ID
        this.nombre = producto.getNombre(); // Mapea el nombre
        this.descripcion = producto.getDescripcion();
        this.precio = producto.getPrecio();
        this.urlImagen = producto.getUrlImagen();
        this.subcategoria = producto.getSubcategoria();
        this.categoria = producto.getCategoria();
        // Asigna el estado de disponibilidad calculado
        this.disponible = disponible;
    }

    // CONSTRUCTOR 2: Usado por el Controlador en create/update (recibe solo producto)
    // Este constructor arregla el error rojo que tienes.
    public ProductoResponseDTO(Producto producto) {
        this.id = producto.getId();
        this.nombre = producto.getNombre();
        this.descripcion = producto.getDescripcion();
        this.subcategoria = producto.getSubcategoria();
        this.precio = producto.getPrecio();
        this.urlImagen = producto.getUrlImagen();
        this.categoria = producto.getCategoria();
        // Asignamos 'true' por defecto al crear o actualizar
        this.disponible = true; 
    }
}