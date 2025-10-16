package com.jugueria.api.jugueria.dto;

import com.jugueria.api.jugueria.model.Producto; 
import lombok.Data; 

@Data
public class ProductoResponseDTO {

    private Integer id;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String imageUrl;
    private String category;
    private String subcategory;

    public ProductoResponseDTO(Producto producto) {
        this.id = producto.getIdProducto();
        this.name = producto.getNombre();
        this.description = producto.getDescripcion();
        this.price = producto.getPrecio();
        this.stock = producto.getStock();
        this.imageUrl = producto.getUrlImagen();
        
        this.category = producto.getCategoria().getNombre(); 
        
        this.subcategory = producto.getSubcategoria();
    }
}