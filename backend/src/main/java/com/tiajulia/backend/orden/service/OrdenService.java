package com.tiajulia.backend.orden.service;

import com.tiajulia.backend.orden.dto.OrdenRequestDTO; // DTO de entrada (carrito completo)
import com.tiajulia.backend.orden.dto.OrdenDetalleDTO; // DTO de cada ítem del carrito
import com.tiajulia.backend.orden.model.Orden; // Entidad principal de la orden
import com.tiajulia.backend.orden.model.OrdenDetalle; // Entidad del detalle de la orden
import com.tiajulia.backend.orden.repository.OrdenRepository; // Repositorio para la entidad Orden
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Anotación clave para transacciones

// Marca esta clase como un Service de Spring (Lógica de Negocio)
@Service
public class OrdenService {

    @Autowired
    private OrdenRepository ordenRepository; // Repositorio inyectado para guardar la orden
    
    // Asegura que todo el método se ejecute en una transacción de base de datos
    @Transactional 
    public Long procesarVenta(OrdenRequestDTO ordenDto) {

        // 1. Mapear DTO a la Entidad Orden
        Orden nuevaOrden = new Orden(); // Crea la entidad padre
        nuevaOrden.setTotal(ordenDto.getTotal()); // Asigna el total
        // fechaHora y estado se establecen en el constructor/declaración de Orden.java

        // 2. Mapear Detalles del DTO a Entidades OrdenDetalle
        for (OrdenDetalleDTO detalleDto : ordenDto.getDetalles()) {
            OrdenDetalle detalle = new OrdenDetalle(); // Crea la entidad detalle
            
            // Mapeo de datos del DTO al Detalle
            detalle.setIdProducto(detalleDto.getIdProducto());
            detalle.setCantidad(detalleDto.getCantidad());
            detalle.setPrecioUnitario(detalleDto.getPrecioUnitario());
            
            // Establecer la relación bidireccional (CRÍTICO para Cascade y JPA)
            detalle.setOrden(nuevaOrden); // Asigna la entidad padre al detalle

            // Agregar a la lista de detalles (necesario para la persistencia en cascada)
            if (nuevaOrden.getDetalles() == null) {
                nuevaOrden.setDetalles(new java.util.ArrayList<>());
            }
            nuevaOrden.getDetalles().add(detalle);
        }
        
        // 3. Guardar la Orden. 
        // La anotación @Transactional y CascadeType.ALL se encargan de guardar
        // la Orden y todos sus Detalles asociados de una sola vez.
        Orden ordenGuardada = ordenRepository.save(nuevaOrden); 

        return ordenGuardada.getIdOrden(); // Devuelve el ID de la orden generada
    }
}