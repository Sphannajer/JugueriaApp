package com.jugueria.api.jugueria.repository;

import com.jugueria.api.jugueria.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    // Spring Data JPA ya proporciona métodos como: findAll(), findById(), save(), deleteById()
    
    // Ejemplo de método de búsqueda personalizado (busca por parte del nombre, ignorando mayúsculas/minúsculas)
    java.util.List<Producto> findByNombreContainingIgnoreCase(String nombre);
}