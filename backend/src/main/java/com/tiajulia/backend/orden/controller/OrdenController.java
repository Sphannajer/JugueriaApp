package com.tiajulia.backend.orden.controller;

// Importar el DTO de entrada
import com.tiajulia.backend.orden.dto.OrdenRequestDTO; 
import com.tiajulia.backend.orden.service.OrdenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ordenes") // Usamos /api/v1/ordenes para coincidir con el frontend
@CrossOrigin // Habilita la comunicación con el frontend
public class OrdenController {

@Autowired
private OrdenService ordenService;

@PostMapping("/checkout")
 public ResponseEntity<?> procesarOrden(@RequestBody OrdenRequestDTO ordenDto) { // FIX 1: Cambiar Orden a OrdenRequestDTO
 try {
// FIX 2: Pasar el DTO al servicio
Long idOrden = ordenService.procesarVenta(ordenDto); 

// Necesitas una clase Mensaje.java en tu carpeta dto si quieres retornar JSON (Revisar si ya la tienes)
 return new ResponseEntity<>("Venta Finalizada con éxito. ID: " + idOrden, HttpStatus.CREATED); 
} catch (Exception e) {
 // Manejo de errores
 return new ResponseEntity<>("Error al finalizar la compra: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
}
 }
}