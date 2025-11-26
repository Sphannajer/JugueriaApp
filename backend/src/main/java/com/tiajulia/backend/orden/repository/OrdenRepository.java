package com.tiajulia.backend.orden.repository;

import com.tiajulia.backend.orden.model.Orden; // Importa la entidad Orden
import org.springframework.data.jpa.repository.JpaRepository; // Interfaz base de Spring Data JPA

// Define la interfaz como un repositorio de Spring Data JPA
// Extiende JpaRepository para obtener automáticamente métodos CRUD para la entidad Orden
// Parámetros: <Entidad que maneja, Tipo de la Clave Primaria de la entidad>
public interface OrdenRepository extends JpaRepository<Orden, Long> {}
