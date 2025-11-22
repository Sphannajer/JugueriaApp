package com.tiajulia.backend.orden.service;

import com.tiajulia.backend.orden.dto.OrdenRequestDTO; // Usamos el DTO para entrada
import com.tiajulia.backend.orden.dto.OrdenDetalleDTO;
import com.tiajulia.backend.orden.model.Orden;
import com.tiajulia.backend.orden.model.OrdenDetalle;
import com.tiajulia.backend.orden.repository.OrdenRepository;
// Ya no necesitamos OrdenDetalleRepository gracias al CascadeType.ALL
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
public class OrdenService {

    @Autowired
    private OrdenRepository ordenRepository;
    
    // FIX: Cambiamos la firma para recibir el DTO de solicitud (OrdenRequestDTO)
    @Transactional 
    public Long procesarVenta(OrdenRequestDTO ordenDto) {

        // 1. Mapear DTO a la Entidad Orden
        Orden nuevaOrden = new Orden();
        nuevaOrden.setTotal(ordenDto.getTotal());
        // fechaHora y estado se establecen en el constructor/declaración de Orden.java

        // 2. Mapear Detalles del DTO a Entidades OrdenDetalle
        for (OrdenDetalleDTO detalleDto : ordenDto.getDetalles()) {
            OrdenDetalle detalle = new OrdenDetalle();
            
            // Mapeo de datos del DTO
            detalle.setIdProducto(detalleDto.getIdProducto());
            detalle.setCantidad(detalleDto.getCantidad());
            detalle.setPrecioUnitario(detalleDto.getPrecioUnitario());
            
            // Establecer la relación bidireccional (CRÍTICO para Cascade)
            detalle.setOrden(nuevaOrden);

            // Agregar a la lista de detalles (necesario para la persistencia en cascada)
            if (nuevaOrden.getDetalles() == null) {
                nuevaOrden.setDetalles(new java.util.ArrayList<>());
            }
            nuevaOrden.getDetalles().add(detalle);
        }
        
        // 3. Guardar la Orden. 
        // ¡Esta operación guarda los detalles y cada inserción activa el TRIGGER!
        Orden ordenGuardada = ordenRepository.save(nuevaOrden); 

        return ordenGuardada.getIdOrden();
    }
}