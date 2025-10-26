package com.tiajulia.backend.producto.repository;

import com.tiajulia.backend.producto.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
   
}