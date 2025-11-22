package com.tiajulia.backend.producto.service;

import com.tiajulia.backend.producto.model.Producto;
import com.tiajulia.backend.producto.repository.ProductoRepository;
import com.tiajulia.backend.producto.repository.RecetaProductoRepository;
import com.tiajulia.backend.producto.model.RecetaProducto;
import com.tiajulia.backend.producto.dto.ProductoResponseDTO; 

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors; 

@Service 
public class ProductoService implements IProductoService {
    
    private final ProductoRepository productoRepository;
    private final IUploadFileService uploadFileService; 
    private final RecetaProductoRepository recetaProductoRepository; 

    @Autowired
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
    private Boolean verificarDisponibilidad(Integer idProducto) {
        List<RecetaProducto> receta = recetaProductoRepository.findByIdIdProducto(idProducto);

        // Si no tiene receta, asumimos que siempre hay stock (true)
        if (receta.isEmpty()) return true; 

        int stockMaximoProducible = Integer.MAX_VALUE; 

        for (RecetaProducto item : receta) {
            Integer stockActualInsumo = item.getInsumo().getStock(); 
            double cantidadRequerida = item.getCantidadRequerida().doubleValue();

            if (cantidadRequerida == 0) continue; 
            
            // Fórmula: Stock Insumo / Cantidad Requerida
            int unidadesPosibles = (int) Math.floor(stockActualInsumo / cantidadRequerida);
            
            // Buscamos el "cuello de botella" (el insumo más escaso)
            if (unidadesPosibles < stockMaximoProducible) {
                stockMaximoProducible = unidadesPosibles;
            }
        }
        return stockMaximoProducible > 0;
    }

    // --- HELPER PARA REUTILIZAR LÓGICA ---
    // Convierte la lista de Producto a ProductoResponseDTO aplicando el cálculo de disponibilidad
    private List<ProductoResponseDTO> convertirADTO(List<Producto> productos) {
        return productos.stream()
            .map(producto -> {
                Boolean disponible = verificarDisponibilidad(producto.getId());
                return new ProductoResponseDTO(producto, disponible);
            })
            .collect(Collectors.toList());
    }

    // --- IMPLEMENTACIONES CORREGIDAS (Devuelven DTOs calculados) ---

    @Override
    public List<ProductoResponseDTO> findAll() {
        return convertirADTO(productoRepository.findAll());
    }
    
    @Override
    public List<ProductoResponseDTO> findByCategoriaNombre(String nombreCategoria) {
        // Usa el helper para devolver DTOs con stock real
        return convertirADTO(productoRepository.findByCategoriaNombre(nombreCategoria));
    }
    
    @Override
    public List<ProductoResponseDTO> findBySubcategoria(String subcategoria) {
        // Usa el helper para devolver DTOs con stock real
        return convertirADTO(productoRepository.findBySubcategoria(subcategoria));
    }

    @Override
    public List<ProductoResponseDTO> findByCategoriaNombreAndSubcategoria(String nombreCategoria, String subcategoria) {
        // Usa el helper para devolver DTOs con stock real
        return convertirADTO(productoRepository.findByCategoriaNombreAndSubcategoria(nombreCategoria, subcategoria));
    }

    // --- RESTO DE MÉTODOS (Sin cambios) ---

    @Override
    public Optional<Producto> findById(Integer id) {
        return productoRepository.findById(id);
    }
    
    @Override
    public Producto save(Producto producto) {
        return productoRepository.save(producto);
    }

    @Override
    public Producto saveWithImage(Producto producto, MultipartFile file) throws IOException {
        String oldUrlImagen = null;
        boolean isUpdate = producto.getId() != null;

        if (isUpdate) {
            Optional<Producto> existingProduct = productoRepository.findById(producto.getId());
            if (existingProduct.isPresent()) {
                oldUrlImagen = existingProduct.get().getUrlImagen();
            }
        }

        if (file != null && !file.isEmpty()) {
            if (oldUrlImagen != null && !oldUrlImagen.isEmpty()) {
                uploadFileService.delete(oldUrlImagen);
            }
            String uniqueFilename = uploadFileService.copy(file);
            producto.setUrlImagen(uniqueFilename); 
        } else if (isUpdate) {
            if (producto.getUrlImagen() == null || producto.getUrlImagen().isEmpty()) {
                if (oldUrlImagen != null && !oldUrlImagen.isEmpty()) {
                    uploadFileService.delete(oldUrlImagen); 
                }
            } else {
                if (oldUrlImagen != null) {
                    producto.setUrlImagen(oldUrlImagen);
                }
            }
        }
        return productoRepository.save(producto);
    }

    @Override
    public void delete(Integer id) {
        Optional<Producto> optionalProducto = productoRepository.findById(id);
        if (optionalProducto.isPresent()) {
            Producto producto = optionalProducto.get();
            if (producto.getUrlImagen() != null && !producto.getUrlImagen().isEmpty()) {
                uploadFileService.delete(producto.getUrlImagen());
            }
            productoRepository.deleteById(id);
        }
    }
    
    @Override
    public boolean existsById(Integer id) {
        return productoRepository.existsById(id);
    }
    
    @Override
    public List<Producto> findByNombre(String nombre) {
        return List.of(); 
    }
    
    @Override
    public byte[] exportToExcel() throws IOException {
        List<Producto> productos = productoRepository.findAll();
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Reporte Productos");
            String[] headers = {"ID", "Nombre", "Descripción", "Precio", "Stock", "Categoría"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                headerRow.createCell(i).setCellValue(headers[i]);
            }
            int rowNum = 1;
            for (Producto p : productos) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(p.getId());
                row.createCell(1).setCellValue(p.getNombre());
                row.createCell(2).setCellValue(p.getDescripcion());
                row.createCell(3).setCellValue(p.getPrecio());
                row.createCell(4).setCellValue(p.getStock());
                row.createCell(5).setCellValue(p.getCategoria().getNombre());
            }
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }
}