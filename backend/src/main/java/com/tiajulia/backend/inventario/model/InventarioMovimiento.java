package com.tiajulia.backend.inventario.model;


import com.tiajulia.backend.producto.model.Producto;
import jakarta.persistence.*;
import lombok.Data;
import jakarta.persistence.Id;


import java.time.LocalDateTime;

@Entity
@Table(name = "inventario_movimiento")
@Data
public class InventarioMovimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMovimiento;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private String tipoMovimiento; // ENTRADA o SALIDA

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false)
    private LocalDateTime fechaMovimiento = LocalDateTime.now();

    private String descripcion;

    public InventarioMovimiento() {
    }

    public InventarioMovimiento(Producto producto, String tipoMovimiento, Integer cantidad, LocalDateTime fechaMovimiento, String descripcion) {
        this.producto = producto;
        this.tipoMovimiento = tipoMovimiento;
        this.cantidad = cantidad;
        this.fechaMovimiento = fechaMovimiento;
        this.descripcion = descripcion;
    }

    public Long getIdMovimiento() {
        return idMovimiento;
    }

    public void setIdMovimiento(Long idMovimiento) {
        this.idMovimiento = idMovimiento;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public String getTipoMovimiento() {
        return tipoMovimiento;
    }

    public void setTipoMovimiento(String tipoMovimiento) {
        this.tipoMovimiento = tipoMovimiento;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public LocalDateTime getFechaMovimiento() {
        return fechaMovimiento;
    }

    public void setFechaMovimiento(LocalDateTime fechaMovimiento) {
        this.fechaMovimiento = fechaMovimiento;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}

