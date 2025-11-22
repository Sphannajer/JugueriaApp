package com.tiajulia.backend.producto.service;

import com.tiajulia.backend.producto.dto.ProductoResponseDTO;
import com.tiajulia.backend.producto.model.Producto;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface IProductoService {

    List<ProductoResponseDTO> findAll();
    List<ProductoResponseDTO> findByCategoriaNombre(String nombreCategoria);
    List<ProductoResponseDTO> findBySubcategoria(String subcategoria);
    Optional<Producto> findById(Integer id);
    
    Producto save(Producto producto); 
    
    Producto saveWithImage(Producto producto, MultipartFile file) throws IOException;

    void delete(Integer id);
    boolean existsById(Integer id);
    List<Producto> findByNombre(String nombre);

    List<ProductoResponseDTO> findByCategoriaNombreAndSubcategoria(String nombreCategoria, String subcategoria);

    public byte[] exportToExcel() throws IOException;
}