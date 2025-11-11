package com.tiajulia.backend.inventario.service;

import com.tiajulia.backend.inventario.model.Insumo;
import com.tiajulia.backend.inventario.repository.InsumoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InsumoServiceImpl implements InsumoService {

    private final InsumoRepository insumoRepository;

    public InsumoServiceImpl(InsumoRepository insumoRepository) {
        this.insumoRepository = insumoRepository;
    }

    @Override
    public List<Insumo> listarTodos() {
        return insumoRepository.findAll();
    }

    @Override
    public Insumo guardar(Insumo insumo) {
        return insumoRepository.save(insumo);
    }

    @Override
    public Insumo actualizar(Integer id, Insumo insumo) {
        Insumo existente = insumoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Insumo no encontrado"));
        existente.setNombre(insumo.getNombre());
        existente.setStock(insumo.getStock());
        existente.setStockMin(insumo.getStockMin());
        existente.setCosto(insumo.getCosto());
        return insumoRepository.save(existente);
    }

    @Override
    public void eliminar(Integer id) {
        insumoRepository.deleteById(id);
    }

    @Override
    public List<Object[]> obtenerStockPorInsumo() {
        return insumoRepository.obtenerStockPorInsumo();
    }

    @Override
    public Double obtenerValorTotalInventario() {
        return insumoRepository.obtenerValorTotalInventario();
    }
}
