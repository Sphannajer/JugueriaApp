package com.tiajulia.backend.security.service;

import com.tiajulia.backend.security.entity.Usuario;
import com.tiajulia.backend.security.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class PasswordResetService {

    private static final Logger logger = LoggerFactory.getLogger(PasswordResetService.class);

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 🔹 Configurable desde application.properties
    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    /**
     * Paso 1: Solicitar restablecimiento (envía correo con enlace)
     */
    public void solicitarRestablecimiento(String email) {
        Optional<Usuario> optionalUsuario = usuarioRepository.findByEmail(email);
        if (optionalUsuario.isEmpty()) {
            throw new IllegalArgumentException("No existe un usuario con ese correo electrónico");
        }

        Usuario usuario = optionalUsuario.get();
        String token = UUID.randomUUID().toString();
        usuario.setResetToken(token);
        usuario.setTokenExpiration(Instant.now().plus(15, ChronoUnit.MINUTES));
        usuarioRepository.save(usuario);

        String resetLink = frontendUrl + "/reset-password?token=" + token;
        emailService.sendPasswordResetEmail(usuario.getEmail(), resetLink);

        logger.info("🔐 Enlace de restablecimiento enviado a {}", email);
    }

    /**
     * Paso 2: Validar token (para el frontend)
     */
    public boolean validarToken(String token) {
        Optional<Usuario> optionalUsuario = usuarioRepository.findByResetToken(token);
        if (optionalUsuario.isEmpty()) {
            return false;
        }

        Usuario usuario = optionalUsuario.get();
        return usuario.getTokenExpiration() != null &&
                Instant.now().isBefore(usuario.getTokenExpiration());
    }

    /**
     * Paso 3: Actualizar contraseña
     */
    public void cambiarContrasena(String token, String nuevaContrasena) {
        Optional<Usuario> optionalUsuario = usuarioRepository.findByResetToken(token);
        if (optionalUsuario.isEmpty()) {
            throw new IllegalArgumentException("Token inválido");
        }

        Usuario usuario = optionalUsuario.get();

        if (usuario.getTokenExpiration() == null || Instant.now().isAfter(usuario.getTokenExpiration())) {
            throw new IllegalArgumentException("El token ha expirado");
        }

        // ✅ Validación de seguridad de la contraseña
        if (!esContrasenaSegura(nuevaContrasena)) {
            throw new IllegalArgumentException(
                    "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número."
            );
        }

        usuario.setContrasena(passwordEncoder.encode(nuevaContrasena));
        usuario.setResetToken(null);
        usuario.setTokenExpiration(null);
        usuarioRepository.save(usuario);

        logger.info("✅ Contraseña actualizada correctamente para el usuario: {}", usuario.getEmail());
    }

    /**
     * Verifica la fortaleza de la contraseña con una expresión regular.
     */
    private boolean esContrasenaSegura(String contrasena) {
        String regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$";
        return Pattern.matches(regex, contrasena);
    }
}
