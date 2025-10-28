package com.tiajulia.backend.inventario.service;

import com.tiajulia.backend.inventario.dto.InventarioDTO;
import com.tiajulia.backend.inventario.model.InventarioMovimiento;
import com.tiajulia.backend.inventario.model.InventarioTotal;
import com.tiajulia.backend.inventario.repository.InventarioMovimientoRepository;
import com.tiajulia.backend.inventario.repository.InventarioTotalRepository;
import com.tiajulia.backend.producto.model.Producto;
import com.tiajulia.backend.producto.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class InventarioService {

    @Autowired
    private ProductoRepository productoRepo;

    @Autowired
    private InventarioMovimientoRepository movimientoRepo;

    @Autowired
    private InventarioTotalRepository inventarioRepo;

    // ✅ Registrar entrada o salida
    @Transactional
    public void registrarMovimiento(Integer idProducto, String tipo, Integer cantidad, String descripcion) {
        Producto producto = productoRepo.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        InventarioMovimiento movimiento = new InventarioMovimiento();
        movimiento.setProducto(producto);
        movimiento.setTipoMovimiento(tipo);
        movimiento.setCantidad(cantidad);
        movimiento.setDescripcion(descripcion);
        movimiento.setFechaMovimiento(LocalDateTime.now());
        movimientoRepo.save(movimiento);

        InventarioTotal inventario = inventarioRepo.findByProducto_Id(idProducto)
                .orElseGet(() -> {
                    InventarioTotal nuevo = new InventarioTotal();
                    nuevo.setProducto(producto);
                    nuevo.setStockActual(0);
                    return nuevo;
                });

        int nuevoStock = tipo.equalsIgnoreCase("ENTRADA")
                ? inventario.getStockActual() + cantidad
                : inventario.getStockActual() - cantidad;

        inventario.setStockActual(Math.max(nuevoStock, 0));
        inventario.setUltimaActualizacion(LocalDateTime.now());
        inventarioRepo.save(inventario);

        producto.setStock(inventario.getStockActual());
        productoRepo.save(producto);
    }

    // ✅ Listar inventario total
    public List<InventarioTotal> listarInventario() {
        return inventarioRepo.findAll();
    }

    public List<InventarioDTO> listarInventarioDTO() {
        List<InventarioTotal> inventarios = inventarioRepo.findAll();
        List<InventarioDTO> lista = new ArrayList<>();

        for (InventarioTotal inv : inventarios) {
            Producto producto = inv.getProducto();
            if (producto != null) {
                lista.add(new InventarioDTO(
                        producto.getNombre(),
                        inv.getStockActual()
                ));
            }
        }

        return lista;
    }

    // ✅ Listar movimientos
    public List<InventarioMovimiento> listarMovimientos() {
        return movimientoRepo.findAll();
    }

    // ✅ Agregar producto nuevo
    public Producto agregarProducto(Producto producto) {
        producto.setStock(0);
        Producto nuevo = productoRepo.save(producto);

        InventarioTotal inventario = new InventarioTotal();
        inventario.setProducto(nuevo);
        inventario.setStockActual(0);
        inventario.setUltimaActualizacion(LocalDateTime.now());
        inventarioRepo.save(inventario);

        return nuevo;
    }

    // ✅ Modificar stock directamente
    public void modificarStock(Integer idProducto, Integer nuevoStock) {
        Producto producto = productoRepo.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        producto.setStock(nuevoStock);
        productoRepo.save(producto);

        InventarioTotal inventario = inventarioRepo.findByProducto_Id(idProducto)
                .orElseThrow(() -> new RuntimeException("Inventario no encontrado"));
        inventario.setStockActual(nuevoStock);
        inventario.setUltimaActualizacion(LocalDateTime.now());
        inventarioRepo.save(inventario);
    }

    // ✅ Eliminar producto
    @Transactional
    public void eliminarProducto(Integer idProducto) {
        movimientoRepo.deleteByProducto_Id(idProducto);
        inventarioRepo.deleteByProducto_Id(idProducto);
        productoRepo.deleteById(idProducto);
    }
}
