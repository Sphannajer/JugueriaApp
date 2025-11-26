package com.tiajulia.backend.orden.repository;

import com.tiajulia.backend.orden.model.OrdenDetalle; // Importa la entidad que este repositorio manejará
import org.springframework.data.jpa.repository.JpaRepository; // Interfaz base de Spring Data JPA

// Define la interfaz como un repositorio
// Extiende JpaRepository, lo que le otorga métodos CRUD automáticos (save, findById, findAll, delete, etc.)
// Parámetros: <Entidad que maneja, Tipo de la Clave Primaria de la entidad>
public interface OrdenDetalleRepository extends JpaRepository<OrdenDetalle, Long> {}
