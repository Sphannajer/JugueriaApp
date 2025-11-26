package com.tiajulia.backend.producto.service;

import com.tiajulia.backend.producto.dto.ProductoResponseDTO; // DTO usado para enviar datos al frontend
import com.tiajulia.backend.producto.model.Producto; // Entidad principal de la lógica de negocio
import org.springframework.web.multipart.MultipartFile; // Para manejar archivos subidos (imágenes)
import java.io.IOException; // Para manejar excepciones de entrada/salida (archivos)
import java.util.List;
import java.util.Optional;

// Interfaz que define los métodos disponibles en la lógica de negocio (capa Service)
public interface IProductoService {

    // Contrato para obtener todos los productos, devolviendo DTOs con disponibilidad
    List<ProductoResponseDTO> findAll();
    
    // Contrato para buscar productos por nombre de categoría
    List<ProductoResponseDTO> findByCategoriaNombre(String nombreCategoria);
    
    // Contrato para buscar productos por subcategoría
    List<ProductoResponseDTO> findBySubcategoria(String subcategoria);
    
    // Contrato para buscar un producto por ID, devuelve Optional para manejo de nulos
    Optional<Producto> findById(Integer id);
    
    // Contrato base para guardar o actualizar un producto (sin archivo)
    Producto save(Producto producto); 
    
    // Contrato para guardar o actualizar un producto, manejando la subida de imagen
    Producto saveWithImage(Producto producto, MultipartFile file) throws IOException;

    // Contrato para eliminar un producto por ID
    void delete(Integer id);
    
    // Contrato para verificar la existencia de un producto por ID
    boolean existsById(Integer id);
    
    // Contrato para buscar productos por nombre
    List<Producto> findByNombre(String nombre);

    // Contrato para buscar productos por combinación de categoría y subcategoría
    List<ProductoResponseDTO> findByCategoriaNombreAndSubcategoria(String nombreCategoria, String subcategoria);

    // Contrato para generar el reporte de productos en formato Excel (devuelve un array de bytes)
    public byte[] exportToExcel() throws IOException;
}