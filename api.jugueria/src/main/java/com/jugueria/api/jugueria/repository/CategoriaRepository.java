package com.jugueria.api.jugueria.repository;

import com.jugueria.api.jugueria.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
    // Métodos estándar ya disponibles
}