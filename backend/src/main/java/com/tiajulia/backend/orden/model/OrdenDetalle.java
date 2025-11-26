package com.tiajulia.backend.orden.model;

import jakarta.persistence.*; // Anotaciones de Persistencia JPA
import java.math.BigDecimal; // Para manejar el precio unitario con precisión

// Marca esta clase como una entidad JPA
@Entity
// Especifica el nombre de la tabla en la base de datos
@Table(name = "orden_detalle")
public class OrdenDetalle {

    // Clave primaria del detalle
    @Id
    // Generación de valor autoincremental
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle")
    private Long idDetalle;

    // Define la relación Muchos Detalles a Una Orden (Many-to-One)
    @ManyToOne(fetch = FetchType.LAZY) // Carga perezosa: La orden no se carga hasta que se accede a ella
    @JoinColumn(name = "id_orden", nullable = false) // Columna de clave foránea en la tabla DB
    private Orden orden; // Objeto que representa la orden padre a la que pertenece este detalle

    // ID del producto comprado (se guarda aquí para mantener el historial, aunque el producto original cambie)
    @Column(name = "id_producto")
    private Long idProducto;

    // Cantidad comprada de este producto
    private Integer cantidad;

    // Precio unitario registrado al momento de la compra
    @Column(name = "precio_unitario")
    private BigDecimal precioUnitario;
    
    // Getters y Setters...
    public Long getIdDetalle() { return idDetalle; }
    public void setIdDetalle(Long idDetalle) { this.idDetalle = idDetalle; }

    // Getter y setter para la relación con Orden
    public Orden getOrden() { return orden; }
    public void setOrden(Orden orden) { this.orden = orden; }

    public Long getIdProducto() { return idProducto; }
    public void setIdProducto(Long idProducto) { this.idProducto = idProducto; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }
}