package com.tiajulia.backend.inventario.repository;

import com.tiajulia.backend.inventario.model.Insumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface InsumoRepository extends JpaRepository<Insumo, Integer> {
    // 🔹 Solo nombre y stock para el gráfico
    @Query("SELECT i.id, i.nombre, i.stock, i.stockMin, i.costo FROM Insumo i")
    List<Object[]> obtenerStockPorInsumo();


    // 🔹 Suma total del valor del inventario (stock * costo)
    @Query("SELECT SUM(i.stock * i.costo) FROM Insumo i")
    Double obtenerValorTotalInventario();
}
