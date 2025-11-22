package com.tiajulia.backend.producto.dto;

import com.tiajulia.backend.producto.model.Producto;
import com.tiajulia.backend.producto.model.Categoria;
import lombok.Data; 

@Data
public class ProductoResponseDTO {

    private Integer id; 
    private String nombre; 
    private String descripcion;
    private Double precio;
    private String urlImagen; 
    private String subcategoria;
    private Categoria categoria; 
    private Boolean disponible;

    public ProductoResponseDTO(Producto producto, Boolean disponible) {
        this.id = producto.getId(); 
        this.nombre = producto.getNombre();
        this.descripcion = producto.getDescripcion();
        this.precio = producto.getPrecio();
        this.urlImagen = producto.getUrlImagen();
        this.subcategoria = producto.getSubcategoria();
        this.categoria = producto.getCategoria();
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
