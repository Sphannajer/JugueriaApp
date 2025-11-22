// Archivo: com.tiajulia.backend.producto.repository.RecetaProductoRepository.java

package com.tiajulia.backend.producto.repository;

import com.tiajulia.backend.producto.model.RecetaProducto;
import com.tiajulia.backend.producto.model.RecetaProductoId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecetaProductoRepository extends JpaRepository<RecetaProducto, RecetaProductoId> {
    
    // Método para buscar todas las recetas de un producto
    List<RecetaProducto> findByIdIdProducto(Integer idProducto);
}