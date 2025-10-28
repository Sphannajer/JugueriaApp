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
    private Integer stock; 
    private String urlImagen; 
    private String subcategoria;
    private Categoria categoria; 

    public ProductoResponseDTO(Producto producto) {
        this.id = producto.getId(); 
        this.nombre = producto.getNombre();
        this.descripcion = producto.getDescripcion();
        this.precio = producto.getPrecio();
        this.stock = producto.getStock();
        this.urlImagen = producto.getUrlImagen();
        this.subcategoria = producto.getSubcategoria();
        this.categoria = producto.getCategoria();
    }
}
