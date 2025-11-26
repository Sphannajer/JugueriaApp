package com.tiajulia.backend.producto.repository;

import com.tiajulia.backend.producto.model.RecetaProducto; // Importa la entidad que manejaremos
import com.tiajulia.backend.producto.model.RecetaProductoId; // Importa la clave compuesta de la entidad
import org.springframework.data.jpa.repository.JpaRepository; // La interfaz base de Spring Data JPA
import java.util.List;

// Define la interfaz como un repositorio de Spring Data JPA
// <Entidad, Tipo_de_la_Clave_Primaria>
public interface RecetaProductoRepository extends JpaRepository<RecetaProducto, RecetaProductoId> {
    
    // Método para buscar todas las recetas de un producto
    // Spring Data JPA crea la implementación de este método automáticamente
    // La convención es: findBy + CampoDeLaClaveCompuesta + CampoDentroDeLaClaveCompuesta
    List<RecetaProducto> findByIdIdProducto(Integer idProducto);
}