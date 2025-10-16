package com.jugueria.api.jugueria.controller;

import com.jugueria.api.jugueria.dto.ProductoResponseDTO;
import com.jugueria.api.jugueria.model.Producto;
import com.jugueria.api.jugueria.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductoController {

    // Inyección de dependencia del repositorio para acceder a la BD
    @Autowired
    private ProductoRepository productoRepository;

    /**
     * GET /api/productos
     * Obtiene todos los productos.
     */
    @GetMapping
    public List<ProductoResponseDTO> getAllProductos() {
        return productoRepository.findAll().stream()
                // Convierte CADA Producto (entidad) en un ProductoResponseDTO
                .map(ProductoResponseDTO::new) 
                .collect(Collectors.toList());
    }

    /**
     * GET /api/productos/{id}
     * Obtiene un producto por su ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponseDTO> getProductoById(@PathVariable Integer id) {
        return productoRepository.findById(id)
                // Si lo encuentra, lo convierte a DTO
                .map(ProductoResponseDTO::new) 
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/productos
     * Crea un nuevo producto.
     */
    @PostMapping
    public Producto createProducto(@RequestBody Producto producto) {
        return productoRepository.save(producto);
    }

    /**
     * PUT /api/productos/{id}
     * Actualiza un producto existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Producto> updateProducto(@PathVariable Integer id, @RequestBody Producto productoDetails) {
        return productoRepository.findById(id)
                .map(producto -> {
                    producto.setNombre(productoDetails.getNombre());
                    producto.setDescripcion(productoDetails.getDescripcion());
                    producto.setPrecio(productoDetails.getPrecio());
                    producto.setStock(productoDetails.getStock());
                    producto.setSubcategoria(productoDetails.getSubcategoria());
                    producto.setUrlImagen(productoDetails.getUrlImagen()); 
                    producto.setCategoria(productoDetails.getCategoria()); // Requiere que la categoría exista
                    
                    Producto updatedProducto = productoRepository.save(producto);
                    return ResponseEntity.ok(updatedProducto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/productos/{id}
     * Elimina un producto.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Integer id) {
        if (productoRepository.existsById(id)) {
            productoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}