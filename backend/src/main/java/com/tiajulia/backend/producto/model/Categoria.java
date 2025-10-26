package com.tiajulia.backend.producto.model;
import jakarta.persistence.*;
import lombok.Data; 

@Entity
@Table(name = "categorias")
@Data 
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCategoria; 

    @Column(name = "nombre", nullable = false, unique = true)
    private String nombre;

    
}