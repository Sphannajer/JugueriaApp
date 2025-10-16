package com.jugueria.api.jugueria.model;

import jakarta.persistence.*;
import lombok.Data; // Si usaste Lombok

@Entity
@Table(name = "categorias")
@Data // Genera getters, setters, toString, etc.
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCategoria; // Mapea a id_categoria

    @Column(name = "nombre", nullable = false, unique = true)
    private String nombre;

    // Opcional: Relación OneToMany con Productos
    // @OneToMany(mappedBy = "categoria")
    // private List<Producto> productos;
}