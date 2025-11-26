package com.tiajulia.backend.orden.dto;

import java.math.BigDecimal; // Importa para manejar valores monetarios con alta precisión

// DTO: Data Transfer Object para cada línea de detalle dentro de una orden (cada producto en el carrito)
public class OrdenDetalleDTO {
    // Identificador del producto comprado
    private Long idProducto;
    // Cantidad de unidades de este producto compradas
    private Integer cantidad;
    // Precio unitario del producto al momento de la compra (usando BigDecimal para precisión)
    private BigDecimal precioUnitario;
    
    // Getters y Setters automáticos (Para deserializar el JSON de la petición)
    
    public Long getIdProducto() { return idProducto; }
    public void setIdProducto(Long idProducto) { this.idProducto = idProducto; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }
}