package com.tiajulia.backend.inventario.model;

import com.tiajulia.backend.producto.model.Producto;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventario_total")
@Data
public class InventarioTotal {

    @Id
    @Column(name = "id_producto")
    private Long idProducto;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id_producto")
    private Producto producto;

    @Column(name = "stock_actual", nullable = false)
    private Integer stockActual;

    @Column(name = "ultima_actualizacion", nullable = false)
    private LocalDateTime ultimaActualizacion;

    public InventarioTotal() {
    }

    public InventarioTotal( Producto producto, Integer stockActual, LocalDateTime ultimaActualizacion) {
        this.producto = producto;
        this.stockActual = stockActual;
        this.ultimaActualizacion = ultimaActualizacion;
    }

    public Long getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Long idProducto) {
        this.idProducto = idProducto;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public Integer getStockActual() {
        return stockActual;
    }

    public void setStockActual(Integer stockActual) {
        this.stockActual = stockActual;
    }

    public LocalDateTime getUltimaActualizacion() {
        return ultimaActualizacion;
    }

    public void setUltimaActualizacion(LocalDateTime ultimaActualizacion) {
        this.ultimaActualizacion = ultimaActualizacion;
    }
}
