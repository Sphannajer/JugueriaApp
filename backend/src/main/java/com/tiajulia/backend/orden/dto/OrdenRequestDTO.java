package com.tiajulia.backend.orden.dto;

import java.math.BigDecimal; // Importa para manejar el monto total con precisión
import java.util.List; // Para manejar la lista de ítems en el carrito

/**
 * DTO (Data Transfer Object) para recibir la solicitud de creación de una orden 
 * de venta desde el frontend (el carrito de compras).
 */
public class OrdenRequestDTO { // El DTO de entrada para la petición POST de checkout
    
    // El monto total calculado en el frontend. Usado típicamente para validación en el backend.
    private BigDecimal total;
    
    // La lista de productos (detalles) en el carrito. Cada elemento es un OrdenDetalleDTO.
    private List<OrdenDetalleDTO> detalles; 

    // --- Getters y Setters ---

    public BigDecimal getTotal() { 
        return total; 
    }
    public void setTotal(BigDecimal total) { 
        this.total = total; 
    }

    public List<OrdenDetalleDTO> getDetalles() { 
        return detalles; 
    }
    public void setDetalles(List<OrdenDetalleDTO> detalles) { 
        this.detalles = detalles; 
    }
}