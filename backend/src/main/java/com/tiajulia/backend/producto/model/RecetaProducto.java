package com.tiajulia.backend.producto.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import com.tiajulia.backend.inventario.model.Insumo; // Importamos tu modelo de Insumo

@Entity
@Table(name = "recetas_productos")
@Data
public class RecetaProducto {

    @EmbeddedId
    private RecetaProductoId id;

    // CORRECCIÓN 1: Cambiado de "cantidad_requerida_numeric" a "cantidad_requerida"
    // (Este es el nombre que aparece en tu diagrama de base de datos)
    @Column(name = "cantidad_requerida", precision = 10, scale = 2)
    private BigDecimal cantidadRequerida;

    // CORRECCIÓN 2: Cambiado de "id_insumo_integer" a "id_insumo"
    // Esto soluciona el error de "column does not exist"
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idInsumo")
    @JoinColumn(name = "id_insumo") 
    private Insumo insumo;
    
    // CORRECCIÓN 3: Cambiado de "id_producto_integer" a "id_producto"
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idProducto")
    @JoinColumn(name = "id_producto")
    private Producto producto;
}