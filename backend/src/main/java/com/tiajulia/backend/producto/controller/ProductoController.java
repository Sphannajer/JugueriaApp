package com.tiajulia.backend.producto.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tiajulia.backend.producto.dto.ProductoResponseDTO;
import com.tiajulia.backend.producto.model.Producto;
import com.tiajulia.backend.producto.service.IProductoService;
import com.tiajulia.backend.producto.service.IUploadFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:5173") 
public class ProductoController {

    private final IProductoService productoService;
    private final IUploadFileService uploadFileService;
    private final ObjectMapper objectMapper; 

    @Autowired
    public ProductoController(IProductoService productoService, IUploadFileService uploadFileService, ObjectMapper objectMapper) {
        this.productoService = productoService;
        this.uploadFileService = uploadFileService;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    public ResponseEntity<List<ProductoResponseDTO>> findAll() {
        List<ProductoResponseDTO> dtoList = productoService.findAll().stream()
                .map(ProductoResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }

@GetMapping("/filtrar")
public ResponseEntity<List<ProductoResponseDTO>> findByFilter(
        @RequestParam(required = false) String categoria,
        @RequestParam(required = false) String subcategoria) {
    
    List<Producto> productos = List.of(); 
    
    if (categoria != null && !categoria.isEmpty() && subcategoria != null && !subcategoria.isEmpty()) {
        productos = productoService.findByCategoriaNombreAndSubcategoria(categoria, subcategoria);
        
    } 
    else if (categoria != null && !categoria.isEmpty()) {
        productos = productoService.findByCategoriaNombre(categoria);
    }
    else if (subcategoria != null && !subcategoria.isEmpty()) {
        productos = productoService.findBySubcategoria(subcategoria);
        
    } 
    else {
        productos = productoService.findAll();
    }
    List<ProductoResponseDTO> dtoList = productos.stream()
            .map(ProductoResponseDTO::new)
            .collect(Collectors.toList());
            
    return ResponseEntity.ok(dtoList);
}
    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponseDTO> findById(@PathVariable Integer id) {
        return productoService.findById(id)
                .map(producto -> ResponseEntity.ok(new ProductoResponseDTO(producto)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ProductoResponseDTO> createProducto(
            @RequestPart("producto") String productoJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            Producto producto = objectMapper.readValue(productoJson, Producto.class);
            Producto savedProducto = productoService.saveWithImage(producto, file);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(new ProductoResponseDTO(savedProducto));

        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null); 
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<ProductoResponseDTO> updateProducto(
            @PathVariable Integer id,
            @RequestPart("producto") String productoJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        
        Optional<Producto> optionalProducto = productoService.findById(id);

        if (optionalProducto.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            Producto productoDetails = objectMapper.readValue(productoJson, Producto.class);
            productoDetails.setId(id);

            Producto updatedProducto = productoService.saveWithImage(productoDetails, file);
            
            return ResponseEntity.ok(new ProductoResponseDTO(updatedProducto));
            
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); 
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Integer id) {
        if (productoService.existsById(id)) {
            productoService.delete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> showPhoto(@PathVariable String filename) {
        
        try {
            Resource resource = uploadFileService.load(filename);

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().build();
        }
    }


    @GetMapping("/reporte/excel")
    public ResponseEntity<Resource> exportToExcel() {
        try {
            byte[] excelBytes = productoService.exportToExcel();
            
            ByteArrayResource resource = new ByteArrayResource(excelBytes);

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"productos_reporte.xlsx\"");
            headers.add(HttpHeaders.CONTENT_TYPE, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(excelBytes.length)
                    .body(resource);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}