package com.jugueria.api.jugueria.model;

import jakarta.persistence.*;
import lombok.Data; 

@Entity
@Table(name = "productos")
@Data 
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto") 
    private Integer idProducto;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "subcategoria")
    private String subcategoria; 

    @Column(name = "precio", nullable = false)
    private Double precio; 

    @Column(name = "stock", nullable = false)
    private Integer stock; 

    @Column(name = "url_imagen")
    private String urlImagen; 
  
    @ManyToOne 
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;
    
}