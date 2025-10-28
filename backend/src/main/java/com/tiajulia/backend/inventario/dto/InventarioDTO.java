package com.tiajulia.backend.inventario.dto;

public class InventarioDTO {
    private String nombreProducto;
    private Integer stockActual;

    public InventarioDTO() {
    }

    public InventarioDTO(String nombreProducto, Integer stockActual) {
        this.nombreProducto = nombreProducto;
        this.stockActual = stockActual;
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
    }

    public Integer getStockActual() {
        return stockActual;
    }

    public void setStockActual(Integer stockActual) {
        this.stockActual = stockActual;
    }
}
