// Archivo: com.tiajulia.backend.producto.model.RecetaProductoId.java

package com.tiajulia.backend.producto.model;

import java.io.Serializable;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data // Genera getters, setters, hashCode, equals, y toString
public class RecetaProductoId implements Serializable {

    @Column(name = "id_producto_integer")
    private Integer idProducto;

    @Column(name = "id_insumo_integer")
    private Integer idInsumo;

    // Asegúrate de que los nombres de columna coincidan con tu base de datos
}