package com.tiajulia.backend.orden.model;

import jakarta.persistence.*; // Anotaciones de Persistencia JPA
import java.math.BigDecimal; // Para manejar el total de la orden con precisión
import java.time.LocalDateTime; // Para manejar la marca de tiempo de la orden
import java.util.List;

// Marca esta clase como una entidad JPA
@Entity
// Especifica el nombre de la tabla en la base de datos
@Table(name = "ordenes")
public class Orden {

    // Clave primaria
    @Id
    // Generación de valor autoincremental
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_orden")
    private Long idOrden;

    // Columna para la fecha y hora de la orden (no puede ser nula)
    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora = LocalDateTime.now(); // Asigna la fecha y hora actual por defecto al crear

    // Campo para el total de la orden
    private BigDecimal total;

    // Estado de la orden, inicializado como "COMPLETADA" por defecto
    private String estado = "COMPLETADA";
    
    // Define la relación Uno a Muchos con la entidad OrdenDetalle
    @OneToMany(
        mappedBy = "orden", // Indica el campo en la entidad OrdenDetalle que mapea esta relación
        cascade = CascadeType.ALL, // Las operaciones (Guardar, Eliminar) se propagan a los detalles
        orphanRemoval = true // Elimina los detalles si se desvinculan de la orden padre
    )
    private List<OrdenDetalle> detalles; // Lista de los ítems comprados en esta orden
    
    // Getters y Setters...
    public Long getIdOrden() { return idOrden; }
    public void setIdOrden(Long idOrden) { this.idOrden = idOrden; }

    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    // Getter y setter para la lista de detalles
    public List<OrdenDetalle> getDetalles() { return detalles; }
    public void setDetalles(List<OrdenDetalle> detalles) { this.detalles = detalles; }
}