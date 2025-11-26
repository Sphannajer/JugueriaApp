package com.tiajulia.backend.producto.service;

import com.tiajulia.backend.producto.model.Producto;
import com.tiajulia.backend.producto.repository.ProductoRepository;
import com.tiajulia.backend.producto.repository.RecetaProductoRepository;
import com.tiajulia.backend.producto.model.RecetaProducto;
import com.tiajulia.backend.producto.dto.ProductoResponseDTO; 

import org.apache.poi.ss.usermodel.Row; // Clase para filas de Excel
import org.apache.poi.ss.usermodel.Sheet; // Clase para hojas de Excel
import org.apache.poi.ss.usermodel.Workbook; // Interfaz base para libros de Excel
import org.apache.poi.xssf.usermodel.XSSFWorkbook; // Implementación para archivos .xlsx
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service; // Marca esta clase como un Service de Spring
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream; // Para escribir el Excel en memoria
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors; 

// Implementación de la interfaz IProductoService
@Service 
public class ProductoService implements IProductoService {
    
    // Inyección de dependencias de los repositorios y servicios necesarios
    private final ProductoRepository productoRepository;
    private final IUploadFileService uploadFileService; 
    private final RecetaProductoRepository recetaProductoRepository; 

    @Autowired
    // Inyección de dependencias a través del constructor (práctica recomendada)
    public ProductoService(
        ProductoRepository productoRepository, 
        IUploadFileService uploadFileService,
        RecetaProductoRepository recetaProductoRepository 
    ) {
        this.productoRepository = productoRepository;
        this.uploadFileService = uploadFileService;
        this.recetaProductoRepository = recetaProductoRepository;
    }

    // --- LÓGICA MATEMÁTICA DE STOCK ---
    // Método privado para calcular si un producto es 'disponible' en función de sus insumos
    private Boolean verificarDisponibilidad(Integer idProducto) {
        // Busca todos los insumos y cantidades requeridas para el producto (la "receta")
        List<RecetaProducto> receta = recetaProductoRepository.findByIdIdProducto(idProducto);

        // Si no tiene receta, asumimos que siempre hay stock (true)
        if (receta.isEmpty()) return true; 

        // Variable para almacenar el máximo de unidades producibles, limitado por el insumo más escaso
        int stockMaximoProducible = Integer.MAX_VALUE; 

        for (RecetaProducto item : receta) {
            // Obtiene el stock actual del insumo
            // NOTE: This getter assumes the Insumo model has a getStock() method.
            Integer stockActualInsumo = item.getInsumo().getStock(); 
            // Obtiene la cantidad del insumo que requiere el producto
            double cantidadRequerida = item.getCantidadRequerida().doubleValue();

            if (cantidadRequerida == 0) continue; // Evita división por cero
            
            // Fórmula: Stock Insumo / Cantidad Requerida = Unidades posibles
            int unidadesPosibles = (int) Math.floor(stockActualInsumo / cantidadRequerida);
            
            // Buscamos el "cuello de botella" (el insumo más escaso)
            if (unidadesPosibles < stockMaximoProducible) {
                stockMaximoProducible = unidadesPosibles; // El nuevo límite es el insumo más escaso
            }
        }
        // Si el stock máximo que se puede producir es mayor a 0, el producto está disponible
        return stockMaximoProducible > 0;
    }

    // --- HELPER PARA REUTILIZAR LÓGICA ---
    // Convierte la lista de Producto a ProductoResponseDTO aplicando el cálculo de disponibilidad
    private List<ProductoResponseDTO> convertirADTO(List<Producto> productos) {
        // Usa Stream API para transformar cada Producto en un DTO
        return productos.stream()
            .map(producto -> {
                // Llama a la lógica de negocio para determinar la disponibilidad
                Boolean disponible = verificarDisponibilidad(producto.getId());
                // Crea el DTO con la disponibilidad calculada
                return new ProductoResponseDTO(producto, disponible);
            })
            .collect(Collectors.toList()); // Recolecta los DTOs en una lista
    }

    // --- IMPLEMENTACIONES CORREGIDAS (Devuelven DTOs calculados) ---

    @Override
    // Obtiene todos los productos y los convierte a DTOs con stock real
    public List<ProductoResponseDTO> findAll() {
        return convertirADTO(productoRepository.findAll());
    }
    
    @Override
    // Busca por categoría y aplica la conversión a DTO
    public List<ProductoResponseDTO> findByCategoriaNombre(String nombreCategoria) {
        // Usa el helper para devolver DTOs con stock real
        return convertirADTO(productoRepository.findByCategoriaNombre(nombreCategoria));
    }
    
    @Override
    // Busca por subcategoría y aplica la conversión a DTO
    public List<ProductoResponseDTO> findBySubcategoria(String subcategoria) {
        // Usa el helper para devolver DTOs con stock real
        return convertirADTO(productoRepository.findBySubcategoria(subcategoria));
    }

    @Override
    // Busca por categoría y subcategoría y aplica la conversión a DTO
    public List<ProductoResponseDTO> findByCategoriaNombreAndSubcategoria(String nombreCategoria, String subcategoria) {
        // Usa el helper para devolver DTOs con stock real
        return convertirADTO(productoRepository.findByCategoriaNombreAndSubcategoria(nombreCategoria, subcategoria));
    }

    @Override
    // Busca por ID (devuelve la entidad Producto, no el DTO)
    public Optional<Producto> findById(Integer id) {
        return productoRepository.findById(id);
    }
    
    @Override
    // Guarda o actualiza un producto (sin lógica de imagen)
    public Producto save(Producto producto) {
        return productoRepository.save(producto);
    }

    @Override
    // Guarda o actualiza un producto manejando la subida de imagen
    public Producto saveWithImage(Producto producto, MultipartFile file) throws IOException {
        String oldUrlImagen = null;
        boolean isUpdate = producto.getId() != null; // Determina si es una creación o actualización

        if (isUpdate) {
            // Si es actualización, busca la URL de la imagen existente para posible eliminación
            Optional<Producto> existingProduct = productoRepository.findById(producto.getId());
            if (existingProduct.isPresent()) {
                oldUrlImagen = existingProduct.get().getUrlImagen();
            }
        }

        if (file != null && !file.isEmpty()) {
            // Si hay un nuevo archivo, elimina el anterior si existe
            if (oldUrlImagen != null && !oldUrlImagen.isEmpty()) {
                uploadFileService.delete(oldUrlImagen);
            }
            // Copia el nuevo archivo y obtiene su nombre único
            String uniqueFilename = uploadFileService.copy(file);
            producto.setUrlImagen(uniqueFilename); // Asigna el nuevo nombre al producto
        } else if (isUpdate) {
            // Lógica para mantener o eliminar la URL de imagen en caso de actualización sin nuevo archivo
            if (producto.getUrlImagen() == null || producto.getUrlImagen().isEmpty()) {
                // Si el frontend envió el campo vacío, elimina la imagen antigua
                if (oldUrlImagen != null && !oldUrlImagen.isEmpty()) {
                    uploadFileService.delete(oldUrlImagen); 
                }
            } else {
                // Si el frontend no envió un archivo y la URL anterior existía, la mantiene
                if (oldUrlImagen != null) {
                    producto.setUrlImagen(oldUrlImagen);
                }
            }
        }
        return productoRepository.save(producto); // Guarda la entidad en la base de datos
    }

    @Override
    // Elimina un producto por ID
    public void delete(Integer id) {
        Optional<Producto> optionalProducto = productoRepository.findById(id);
        if (optionalProducto.isPresent()) {
            Producto producto = optionalProducto.get();
            // Si tiene una imagen asociada, la elimina del sistema de archivos
            if (producto.getUrlImagen() != null && !producto.getUrlImagen().isEmpty()) {
                uploadFileService.delete(producto.getUrlImagen());
            }
            productoRepository.deleteById(id); // Elimina el registro de la base de datos
        }
    }
    
    @Override
    // Verifica si un producto existe por su ID
    public boolean existsById(Integer id) {
        return productoRepository.existsById(id);
    }
    
    @Override
    // Implementación stub (simulada) para la búsqueda por nombre
    public List<Producto> findByNombre(String nombre) {
        return List.of(); 
    }
    
    @Override
    // Genera un reporte de productos y lo devuelve como un array de bytes de un archivo Excel
    public byte[] exportToExcel() throws IOException {
        List<Producto> productos = productoRepository.findAll(); // Obtiene todos los productos de la BD
        try (Workbook workbook = new XSSFWorkbook()) { // Crea un nuevo libro de trabajo de Excel (.xlsx)
            Sheet sheet = workbook.createSheet("Reporte Productos"); // Crea una nueva hoja
            String[] headers = {"ID", "Nombre", "Descripción", "Precio", "Stock", "Categoría"};
            Row headerRow = sheet.createRow(0); // Crea la fila de encabezados
            for (int i = 0; i < headers.length; i++) {
                headerRow.createCell(i).setCellValue(headers[i]); // Asigna el valor del encabezado
            }
            int rowNum = 1;
            for (Producto p : productos) {
                Row row = sheet.createRow(rowNum++); // Crea una nueva fila para cada producto
                row.createCell(0).setCellValue(p.getId());
                row.createCell(1).setCellValue(p.getNombre());
                row.createCell(2).setCellValue(p.getDescripcion());
                row.createCell(3).setCellValue(p.getPrecio());
                row.createCell(4).setCellValue(p.getStock());
                row.createCell(5).setCellValue(p.getCategoria().getNombre());
            }
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream); // Escribe el libro de trabajo en el stream de salida
            return outputStream.toByteArray(); // Devuelve el contenido del Excel como un array de bytes
        }
    }
}