package com.tiajulia.backend.inventario.service;

import com.tiajulia.backend.inventario.model.Insumo;

import java.util.List;

public interface InsumoService {
    List<Insumo> listarTodos();
    Insumo guardar(Insumo insumo);
    Insumo actualizar(Integer id, Insumo insumo);
    void eliminar(Integer id);
    List<Object[]> obtenerStockPorInsumo();
    Double obtenerValorTotalInventario();
}
