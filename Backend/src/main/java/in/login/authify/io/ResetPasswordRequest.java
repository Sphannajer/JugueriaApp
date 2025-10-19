package in.login.authify.io;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResetPasswordRequest {

    @NotBlank(message = "Se requiere de una nueva contraseña")
    private String newPassword;
    @NotBlank(message = "Se requiere del OTP")
    private String otp;
    @NotBlank(message = "Se requiere del email")
    private String email;

}
