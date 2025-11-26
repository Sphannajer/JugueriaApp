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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;
import java.util.Optional;

// Define esta clase como un controlador REST que maneja peticiones HTTP
@RestController
// Mapea todas las peticiones a la ruta base /api/productos
@RequestMapping("/api/productos")
// Permite peticiones de origen cruzado desde el frontend de React
@CrossOrigin(origins = "http://localhost:5173")
public class ProductoController {

    // Inicializa el logger para registrar eventos y errores en la consola/logs
    private static final Logger log = LoggerFactory.getLogger(ProductoController.class);

    // Declaración de las dependencias inyectadas por Spring
    private final IProductoService productoService;
    private final IUploadFileService uploadFileService;
    private final ObjectMapper objectMapper;

    // Constructor para la inyección de dependencias (alternativa a inyección por campo)
    @Autowired
    public ProductoController(IProductoService productoService, IUploadFileService uploadFileService, ObjectMapper objectMapper) {
        this.productoService = productoService;
        this.uploadFileService = uploadFileService;
        this.objectMapper = objectMapper;
    }

    // Endpoint para obtener todos los productos (GET /api/productos)
    @GetMapping
    public ResponseEntity<List<ProductoResponseDTO>> findAll() {
        // Llama al servicio que ya calcula el stock y devuelve una lista de DTOs
        List<ProductoResponseDTO> productos = productoService.findAll();
        return ResponseEntity.ok(productos); // Devuelve la lista con código 200 OK
    }

    
    // Endpoint para obtener productos filtrados por categoría y/o subcategoría (GET /api/productos/filtrar?...)
    @GetMapping("/filtrar")
    public ResponseEntity<List<ProductoResponseDTO>> findByFilter(
            @RequestParam(required = false) String categoria, // Obtiene el parámetro de consulta 'categoria' (opcional)
            @RequestParam(required = false) String subcategoria) { // Obtiene el parámetro de consulta 'subcategoria' (opcional)

        if (categoria == null && subcategoria == null) {
            return findAll(); // Si no hay filtros, devuelve todos los productos
        }

        List<ProductoResponseDTO> productos = List.of();

        // Ejecuta la lógica de filtrado apropiada basada en los parámetros
        if (categoria != null && !categoria.isEmpty() && subcategoria != null && !subcategoria.isEmpty()) {
            productos = productoService.findByCategoriaNombreAndSubcategoria(categoria, subcategoria);
        } else if (categoria != null && !categoria.isEmpty()) {
            productos = productoService.findByCategoriaNombre(categoria);
        } else if (subcategoria != null && !subcategoria.isEmpty()) {
            productos = productoService.findBySubcategoria(subcategoria);
        }

        return ResponseEntity.ok(productos);
    }
    
    // Endpoint para obtener un producto por su ID (GET /api/productos/{id})
    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponseDTO> findById(@PathVariable Integer id) { // Captura el ID de la URL
          Optional<Producto> optionalProducto = productoService.findById(id); // Busca el producto
          if (optionalProducto.isEmpty()) return ResponseEntity.notFound().build(); // Devuelve 404 Not Found si no existe
          
          // Convierte la entidad a DTO y la devuelve con 200 OK
          return ResponseEntity.ok(new ProductoResponseDTO(optionalProducto.get()));
    }

    // Endpoint para crear un nuevo producto (POST /api/productos)
    // Espera datos multipart (JSON del producto y archivo de imagen)
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ProductoResponseDTO> createProducto(
            @RequestPart("producto") String productoJson, // JSON del producto como parte de la petición
            @RequestPart(value = "file", required = false) MultipartFile file) { // Archivo de imagen (opcional)
        try {

            log.info("Iniciando creación de un nuevo producto. JSON recibido: {}", productoJson);
            Producto producto = objectMapper.readValue(productoJson, Producto.class); // Convierte el JSON a objeto Java
            Producto savedProducto = productoService.saveWithImage(producto, file); // Guarda el producto y su imagen

            log.info("Producto creado exitosamente con ID: {}", savedProducto.getId());

            return ResponseEntity.status(HttpStatus.CREATED).body(new ProductoResponseDTO(savedProducto)); // Devuelve 201 CREATED
        } catch (JsonProcessingException e) {
            log.error("Error al parsear el JSON del producto", e);
            return ResponseEntity.badRequest().body(null); // Manejo de error de formato JSON (400 Bad Request)
        } catch (IOException e) {
            log.error("Error de IO al guardar el producto o la imagen", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // Manejo de error de archivo (500 Internal Error)
        }
    }

    // Endpoint para actualizar un producto existente (PUT /api/productos/{id})
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<ProductoResponseDTO> updateProducto(
            @PathVariable Integer id,
            @RequestPart("producto") String productoJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        log.info("Iniciando actualización del producto con ID: {}", id);
        Optional<Producto> optionalProducto = productoService.findById(id);

        if (optionalProducto.isEmpty()) {
            log.warn("Intento de actualización fallido: Producto con ID {} no encontrado.", id);
            return ResponseEntity.notFound().build(); // Devuelve 404 si el producto no existe
        }

        try {
            Producto productoDetails = objectMapper.readValue(productoJson, Producto.class);
            productoDetails.setId(id); // **Importante:** Asegura que el ID de la URL se use para la actualización

            Producto updatedProducto = productoService.saveWithImage(productoDetails, file); // Guarda los datos actualizados
            log.info("Producto con ID {} actualizado exitosamente.", id);
            return ResponseEntity.ok(new ProductoResponseDTO(updatedProducto)); // Devuelve 200 OK con el producto actualizado

        } catch (JsonProcessingException e) {
            log.error("Error al parsear el JSON para actualizar el producto con ID: {}", id, e);
            return ResponseEntity.badRequest().body(null);
        } catch (IOException e) {
            log.error("Error de IO al actualizar el producto o la imagen con ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Endpoint para eliminar un producto por ID (DELETE /api/productos/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Integer id) {
        log.info("Solicitud para eliminar producto con ID: {}", id);
        if (productoService.existsById(id)) { // Verifica si el producto existe
            productoService.delete(id); // Llama al servicio para eliminarlo
            log.info("Producto con ID {} eliminado exitosamente.", id);
            return ResponseEntity.noContent().build(); // Devuelve 204 No Content (eliminación exitosa)
        } else {
            log.warn("Intento de eliminación fallido: Producto con ID {} no encontrado.", id);
            return ResponseEntity.notFound().build(); // Devuelve 404 Not Found
        }
    }

    // Endpoint para servir las imágenes de los productos (GET /api/productos/uploads/{filename})
    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> showPhoto(@PathVariable String filename) { // El '.+' permite que el nombre tenga extensión

        try {
            Resource resource = uploadFileService.load(filename); // Carga el archivo como un Spring Resource

            HttpHeaders headers = new HttpHeaders();
            // Configura el encabezado para que el navegador muestre la imagen en línea
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(resource); // Devuelve el recurso de la imagen
        } catch (MalformedURLException e) {
            log.error("Error al cargar la imagen {} por URL mal formada", filename, e);
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            log.error("Error interno al servir el archivo {}", filename, e);
            return ResponseEntity.internalServerError().build();
        }
    }


    // Endpoint para generar y descargar un reporte de productos en Excel (GET /api/productos/reporte/excel)
    @GetMapping("/reporte/excel")
    public ResponseEntity<Resource> exportToExcel() {
        try {

            log.debug("Solicitud de reporte Excel recibida.");
            byte[] excelBytes = productoService.exportToExcel(); // Llama al servicio para generar el Excel en bytes

            ByteArrayResource resource = new ByteArrayResource(excelBytes); // Envuelve los bytes para ser devueltos como recurso

            HttpHeaders headers = new HttpHeaders();
            // Configura el encabezado para forzar la descarga del archivo (attachment)
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"productos_reporte.xlsx\"");
            // Establece el Content-Type correcto para archivos XLSX
            headers.add(HttpHeaders.CONTENT_TYPE, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            log.info("Reporte Excel generado y enviado. Tamaño: {} bytes", excelBytes.length);

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(excelBytes.length) // Define la longitud del contenido
                    .body(resource); // Devuelve el archivo Excel

        } catch (IOException e) {
            log.error("Error al generar o leer el reporte Excel", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500 Internal Server Error
        }
    }
}