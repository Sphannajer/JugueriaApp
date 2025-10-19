package in.login.authify.io;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfileRequest {
    
    @NotBlank(message = "El nombre no puede estar vacío")
    private String name;
    @Email(message = "Email inválido")
    @NotNull(message = "El email no puede estar vacío")
    private String email;
    @Size(min = 6, message = "La contraseña debe tener al menos 6 carácteres")
    private String password;
    
}
