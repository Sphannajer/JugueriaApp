package com.tiajulia.backend.producto.controller;

import com.tiajulia.backend.producto.model.Categoria;
import com.tiajulia.backend.producto.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// Indica a Spring que esta clase es un controlador REST que maneja peticiones HTTP
@RestController
// Define la ruta base para todos los endpoints de este controlador (ej: http://localhost:8080/api/categorias)
@RequestMapping("/api/categorias")
// Permite peticiones desde el origen del frontend (React en http://localhost:5173)
@CrossOrigin(origins = "http://localhost:5173") 
public class CategoriaController {

    // Inyecta automáticamente una instancia de CategoriaRepository (patrón Dependency Injection)
 @Autowired
 private CategoriaRepository categoriaRepository;

    // Mapea peticiones HTTP GET a la ruta base ("/api/categorias")
    @GetMapping
    // Método que se ejecuta para obtener todas las categorías
    public List<Categoria> getAllCategorias() {
        // Llama al método findAll del repositorio para consultar y devolver todas las categorías de la BD
    return categoriaRepository.findAll();
    }
}