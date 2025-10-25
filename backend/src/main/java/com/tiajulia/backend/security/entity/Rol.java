package com.tiajulia.backend.security.entity;

import com.tiajulia.backend.security.enums.RolUsuario;
import jakarta.persistence.*;

@Entity
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Enumerated(EnumType.STRING)
    private RolUsuario rolNombre;

    public Rol() {
    }

    public Rol(RolUsuario rolNombre) {
        this.rolNombre = rolNombre;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public RolUsuario getRolNombre() {
        return rolNombre;
    }

    public void setRolNombre(RolUsuario rolNombre) {
        this.rolNombre = rolNombre;
    }
}
