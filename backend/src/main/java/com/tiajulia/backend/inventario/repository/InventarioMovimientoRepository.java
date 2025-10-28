package com.tiajulia.backend.inventario.repository;

import com.tiajulia.backend.inventario.model.InventarioMovimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InventarioMovimientoRepository  extends JpaRepository<InventarioMovimiento, Long> {

    List<InventarioMovimiento> findByProducto_Id(Integer idProducto);

    void deleteByProducto_Id(Integer idProducto);
}
