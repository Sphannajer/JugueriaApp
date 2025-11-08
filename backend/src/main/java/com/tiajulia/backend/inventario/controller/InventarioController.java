package com.tiajulia.backend.inventario.controller;

import com.tiajulia.backend.inventario.dto.InventarioDTO;
import com.tiajulia.backend.inventario.model.InventarioMovimiento;
import com.tiajulia.backend.inventario.model.InventarioTotal;
import com.tiajulia.backend.inventario.service.InventarioService;
import com.tiajulia.backend.producto.model.Producto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventario")
@CrossOrigin("*")
public class InventarioController {

    @Autowired
    private InventarioService inventarioService;

    // 🔹 1. Obtener stock actual
    @GetMapping("/stock")
    public List<InventarioDTO> obtenerStockActual() {
        return inventarioService.listarInventarioDTO();
    }

    // 🔹 2. Resumen general
    @GetMapping("/total")
    public List<InventarioTotal> obtenerInventarioTotal() {
        return inventarioService.listarInventario();
    }

    // 🔹 3. Registrar movimiento (entrada o salida)
    @PostMapping("/movimiento")
    public String registrarMovimiento(
            @RequestParam Integer idProducto,
            @RequestParam String tipoMovimiento,
            @RequestParam Integer cantidad,
            @RequestParam(required = false) String descripcion
    ) {
        inventarioService.registrarMovimiento(idProducto, tipoMovimiento, cantidad, descripcion);
        return "Movimiento registrado correctamente.";
    }

    // 🔹 4. Agregar nuevo producto o insumo
    @PostMapping("/agregar")
    public Producto agregarProducto(@RequestBody Producto producto) {
        return inventarioService.agregarProducto(producto);
    }

    // 🔹 5. Modificar stock manualmente
    @PutMapping("/modificar-stock/{id}")
    public String modificarStock(
            @PathVariable Integer id,
            @RequestParam Integer nuevoStock
    ) {
        inventarioService.modificarStock(id, nuevoStock);
        return "Stock actualizado correctamente.";
    }

    // 🔹 6. Eliminar producto o insumo
    @DeleteMapping("/eliminar/{id}")
    public String eliminarProducto(@PathVariable Integer id) {
        inventarioService.eliminarProducto(id);
        return "Producto eliminado correctamente.";
    }

    // 🔹 7. Historial de movimientos
    @GetMapping("/movimientos")
    public List<InventarioMovimiento> listarMovimientos() {
        return inventarioService.listarMovimientos();
    }
}
