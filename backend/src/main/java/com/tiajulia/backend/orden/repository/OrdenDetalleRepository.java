package com.tiajulia.backend.orden.repository;

import com.tiajulia.backend.orden.model.OrdenDetalle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdenDetalleRepository extends JpaRepository<OrdenDetalle, Long> {}