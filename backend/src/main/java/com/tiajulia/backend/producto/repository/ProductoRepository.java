package com.tiajulia.backend.producto.repository;

import com.tiajulia.backend.producto.model.Producto;
import com.tiajulia.backend.producto.model.RecetaProducto;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    
    java.util.List<Producto> findByNombreContainingIgnoreCase(String nombre);
    
   
    List<Producto> findByCategoriaNombre(String nombreCategoria); 
    
    List<Producto> findBySubcategoria(String subcategoria);

    List<Producto> findByCategoriaNombreAndSubcategoria(String nombreCategoria, String subcategoria);
    
}