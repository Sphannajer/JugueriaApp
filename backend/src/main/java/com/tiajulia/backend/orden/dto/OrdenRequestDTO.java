package com.tiajulia.backend.orden.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO (Data Transfer Object) para recibir la solicitud de creación de una orden 
 * de venta desde el frontend (el carrito de compras).
 */
public class OrdenRequestDTO {
    
    // El monto total calculado en el frontend
    private BigDecimal total;
    
    // La lista de productos (detalles) en el carrito
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