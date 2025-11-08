package com.tiajulia.backend.security.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.HashSet;
import java.util.Set;
@Data
@NoArgsConstructor
public class NuevoUsuario {

    @NotBlank
    private String nombre;
    @NotBlank
    private String nombreUsuario;
    @Email(message = "El formato del email es inválido")
    @Pattern(regexp = "^[A-Za-z0-9._%+-]+@(gmail|hotmail|outlook)\\.com$",
            message = "El email debe ser de dominio gmail.com, hotmail.com o outlook.com")
    private String email;
    @NotBlank
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            message = "Debe contener al menos una mayúscula, una minúscula, un número y un símbolo (@$!%*?&)."
    )
    private String contrasena;
    @NotBlank
    @Size(min = 9, max = 9, message = "El celular debe tener exactamente 9 dígitos")
    private String celular;
    @NotBlank
    private String direccion;
    private Set<String> roles = new HashSet<>();
}
