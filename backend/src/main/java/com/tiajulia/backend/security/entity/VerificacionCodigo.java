package com.tiajulia.backend.security.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.Validate;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.time.LocalDateTime;

@Entity
@Table(name = "verification_code")
public class VerificacionCodigo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String code;
    private LocalDateTime expirationTime;

    public VerificacionCodigo() {}

    public VerificacionCodigo(String email, String code, LocalDateTime expirationTime) {
        Validate.notBlank(email, "El correo no puede estar vacío");
        Validate.notBlank(code, "El código no puede estar vacío");
        Validate.notNull(expirationTime, "La fecha de expiración no puede ser nula");

        this.email = email;
        this.code = code;
        this.expirationTime = expirationTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        Validate.notBlank(email, "El correo no puede estar vacío");
        this.email = StringUtils.lowerCase(StringUtils.trim(email));
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        Validate.notBlank(code, "El código no puede estar vacío");
        this.code = StringUtils.trim(code);
    }

    public LocalDateTime getExpirationTime() {
        return expirationTime;
    }

    public void setExpirationTime(LocalDateTime expirationTime) {
        Validate.notNull(expirationTime, "La fecha de expiración no puede ser nula");
        this.expirationTime = expirationTime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof VerificacionCodigo)) return false;

        VerificacionCodigo that = (VerificacionCodigo) o;
        return new EqualsBuilder()
                .append(email, that.email)
                .append(code, that.code)
                .append(expirationTime, that.expirationTime)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
                .append(email)
                .append(code)
                .append(expirationTime)
                .toHashCode();
    }

    // ToString con formato JSON
    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE)
                .append("id", id)
                .append("email", email)
                .append("code", code)
                .append("expirationTime", expirationTime)
                .toString();
    }

    // Validación lógica de si ya expiró?
    public boolean isExpired() {
        return expirationTime.isBefore(LocalDateTime.now());
    }
}
