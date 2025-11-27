package com.tiajulia.backend.inventario.controller;

import com.tiajulia.backend.inventario.model.Insumo;
import com.tiajulia.backend.inventario.service.InsumoService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventario")
@CrossOrigin(origins = "http://localhost:5173")
public class InsumoController {

    private final InsumoService insumoService;

    public InsumoController(InsumoService insumoService) {
        this.insumoService = insumoService;
    }

    // Listar todos
    @GetMapping
    public List<Insumo> listarTodos() {
        return insumoService.listarTodos();
    }

    // Agregar
    @PostMapping
    public Insumo guardar(@RequestBody Insumo insumo) {
        return insumoService.guardar(insumo);
    }

    // Modificar
    @PutMapping("/{id}")
    public Insumo actualizar(@PathVariable Integer id, @RequestBody Insumo insumo) {
        return insumoService.actualizar(id, insumo);
    }

    // Eliminar
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        insumoService.eliminar(id);
    }

    @GetMapping("/stock")
    public List<Map<String, Object>> obtenerStockPorInsumo() {
        List<Object[]> resultados = insumoService.obtenerStockPorInsumo();
        List<Map<String, Object>> respuesta = new ArrayList<>();

        for (Object[] fila : resultados) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", fila[0]);
            item.put("nombre", fila[1]);
            item.put("stock", fila[2]);
            item.put("stockMin", fila[3]);
            item.put("costo", fila[4]);
            respuesta.add(item);
        }
        return respuesta;
    }

    // Valor total del inventario
    @GetMapping("/valor-total")
    public Map<String, Object> obtenerValorTotalInventario() {
        Double total = insumoService.obtenerValorTotalInventario();
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("valorTotalInventario", total != null ? total : 0.0);
        return respuesta;
    }
}
