package com.tiajulia.backend.orden.repository;

import com.tiajulia.backend.orden.model.Orden;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdenRepository extends JpaRepository<Orden, Long> {}