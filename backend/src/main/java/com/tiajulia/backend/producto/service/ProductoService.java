package com.tiajulia.backend.producto.service;

import com.tiajulia.backend.producto.model.Producto;
import com.tiajulia.backend.producto.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service 
public class ProductoService implements IProductoService {
    
    private final ProductoRepository productoRepository;
    private final IUploadFileService uploadFileService; 

    @Autowired
    public ProductoService(ProductoRepository productoRepository, IUploadFileService uploadFileService) {
        this.productoRepository = productoRepository;
        this.uploadFileService = uploadFileService;
    }

    @Override
    public List<Producto> findAll() {
        return productoRepository.findAll();
    }

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
    public List<Producto> findByCategoriaNombre(String nombreCategoria) {
        return productoRepository.findByCategoriaNombre(nombreCategoria);
    }
    
    @Override
    public List<Producto> findBySubcategoria(String subcategoria) {
        return productoRepository.findBySubcategoria(subcategoria);
    }

    @Override
public List<Producto> findByCategoriaNombreAndSubcategoria(String nombreCategoria, String subcategoria) {
    return productoRepository.findByCategoriaNombreAndSubcategoria(nombreCategoria, subcategoria);
    }
}