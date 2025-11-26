package com.tiajulia.backend.orden.controller;

// Importar el DTO de entrada
import com.tiajulia.backend.orden.dto.OrdenRequestDTO; // DTO que contiene la información del pedido (carrito)
import com.tiajulia.backend.orden.service.OrdenService; // Servicio de lógica de negocio para órdenes
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; // Códigos de estado HTTP
import org.springframework.http.ResponseEntity; // Clase para manejar la respuesta HTTP
import org.springframework.web.bind.annotation.*; // Anotaciones REST

// Define esta clase como un controlador REST
@RestController
// Mapea la ruta base para todos los endpoints de orden
@RequestMapping("/api/v1/ordenes") // Usamos /api/v1/ordenes para coincidir con el frontend
// Habilita la comunicación de Origen Cruzado (CORS) con el frontend
@CrossOrigin 
public class OrdenController {

    // Inyecta automáticamente el servicio de órdenes (lógica de negocio)
    @Autowired
    private OrdenService ordenService;

    // Maneja peticiones POST a /api/v1/ordenes/checkout para finalizar la compra
    @PostMapping("/checkout")
    public ResponseEntity<?> procesarOrden(@RequestBody OrdenRequestDTO ordenDto) { // Recibe el cuerpo de la petición como DTO
        try {
            // Llama al servicio para ejecutar toda la lógica de venta (ej: descontar stock, guardar orden)
            Long idOrden = ordenService.procesarVenta(ordenDto); 

            // Retorna un mensaje de éxito con el código de estado 201 CREATED
            return new ResponseEntity<>("Venta Finalizada con éxito. ID: " + idOrden, HttpStatus.CREATED); 
        } catch (Exception e) {
            // Manejo de errores: si falla la lógica de stock o validación
            return new ResponseEntity<>("Error al finalizar la compra: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // Retorna 500 Internal Server Error
        }
    }
}