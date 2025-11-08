package com.tiajulia.backend.inventario.repository;

import com.tiajulia.backend.inventario.model.InventarioTotal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventarioTotalRepository extends JpaRepository<InventarioTotal, Long> {
    Optional<InventarioTotal> findByProducto_Id(Integer idProducto);
    void deleteByProducto_Id(Integer idProducto);
}
