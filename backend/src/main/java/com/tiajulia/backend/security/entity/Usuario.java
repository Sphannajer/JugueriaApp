package com.tiajulia.backend.security.entity;

import jakarta.persistence.*;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;


import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Usuario {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private int id;
    private String nombre;
    @Column(unique = true)
    private String nombreUsuario;
    private String email;
    private String contrasena;
    private String celular;
    private String direccion;
    @Column(name = "reset_token")
    private String resetToken;
    @Column(name = "token_expiration")
    private Instant tokenExpiration;
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "usuario_rol",
            joinColumns = @JoinColumn(name = "usuario_id"),
            inverseJoinColumns = @JoinColumn(name = "rol_id"))
    private Set<Rol> roles = new HashSet<>();

    public Usuario() {
    }

    public Usuario(String nombre, String nombreUsuario, String email, String contrasena, String celular, String direccion) {
        this.nombre = nombre;
        this.nombreUsuario = nombreUsuario;
        this.email = email;
        this.contrasena = contrasena;
        this.celular = celular;
        this.direccion = direccion;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public String getCelular() {
        return celular;
    }

    public void setCelular(String celular) {
        this.celular = celular;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public Set<Rol> getRoles() {
        return roles;
    }

    public void setRoles(Set<Rol> roles) {
        this.roles = roles;
    }

    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public Instant getTokenExpiration() {
        return tokenExpiration;
    }

    public void setTokenExpiration(Instant tokenExpiration) {
        this.tokenExpiration = tokenExpiration;
    }

    // ✅ Validación interna con Apache Commons
    public boolean isValid() {
        return StringUtils.isNotBlank(nombre)
                && StringUtils.isNotBlank(nombreUsuario)
                && StringUtils.isNotBlank(email)
                && StringUtils.isNotBlank(contrasena);
    }

    // ✅ Equals y HashCode profesionales
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Usuario)) return false;

        Usuario that = (Usuario) o;

        return new EqualsBuilder()
                .append(id, that.id)
                .append(nombreUsuario, that.nombreUsuario)
                .append(email, that.email)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
                .append(id)
                .append(nombreUsuario)
                .append(email)
                .toHashCode();
    }

    // ✅ ToString detallado con estilo JSON
    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE)
                .append("id", id)
                .append("nombre", nombre)
                .append("nombreUsuario", nombreUsuario)
                .append("email", email)
                .append("celular", celular)
                .append("direccion", direccion)
                .toString();
    }
}
