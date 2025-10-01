package com.tiajulia.backend.security.service;

import com.tiajulia.backend.security.entity.Usuario;
import com.tiajulia.backend.security.repository.UsuarioRepository;
import com.tiajulia.backend.service.EmailService;
import com.tiajulia.backend.utils.CodigoVerificacionGenerator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
public class UsuarioService {

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    EmailService emailService;

    // --- MÉTODOS EXISTENTES Y DE BÚSQUEDA ---

    public Optional<Usuario> getByNombreUsuario(String nombreUsuario) {
        return usuarioRepository.findByNombreUsuario(nombreUsuario);
    }

    public Optional<Usuario> getByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public boolean existsByNombreUsuario(String nombreUsuario){
        return usuarioRepository.existsByNombreUsuario(nombreUsuario);
    }

    public boolean existsByEmail(String email){
        return usuarioRepository.existsByEmail(email);
    }

    public void save(Usuario usuario){
        usuarioRepository.save(usuario);
    }

    // ----------------------------------------------------
    // --- LÓGICA DE VERIFICACIÓN Y EXPIRACIÓN DEL TOKEN ---
    // ----------------------------------------------------

    /**
     * Valida si el token ingresado por el usuario es correcto y no está expirado.
     * Si es válido, actualiza el estado 'verificado' a true.
     * * @param email Email del usuario a verificar.
     * @param inputToken Código ingresado por el usuario.
     * @return Mensaje de estado (SUCCESS o error específico).
     */
    public String verifyUser(String email, String inputToken) {
        Optional<Usuario> userOpt = usuarioRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return "El email no está registrado.";
        }

        Usuario usuario = userOpt.get();

        if (usuario.isVerificado()) {
            return "La cuenta ya ha sido verificada.";
        }

        // 1. Validación de Token Incorrecto o inexistente
        if (usuario.getTokenVerificacion() == null || !usuario.getTokenVerificacion().equals(inputToken)) {
            return "Código de verificación incorrecto.";
        }

        // 2. Validación de Token Expirado (Comparación de tiempo)
        if (usuario.getFechaExpiracionToken() != null && usuario.getFechaExpiracionToken().isBefore(LocalDateTime.now())) {
            // Un token expirado no se elimina para que el usuario pueda usar 'Reenviar'
            return "El código de verificación ha expirado.";
        }

        // Si pasa todas las validaciones: Marcar como verificado
        usuario.setVerificado(true);
        usuario.setTokenVerificacion(null);
        usuario.setFechaExpiracionToken(null);
        usuarioRepository.save(usuario);

        return "SUCCESS: Cuenta verificada correctamente.";
    }

    /**
     * Genera un nuevo token de verificación, actualiza la base de datos
     * y envía el nuevo código por correo.
     * * @param email Email del usuario para el reenvío.
     * @return Mensaje de estado (SUCCESS o error específico).
     */
    public String resendVerificationToken(String email) {
        Optional<Usuario> userOpt = usuarioRepository.findByEmail(email);

        if (userOpt.isEmpty() || userOpt.get().isVerificado()) {
            // No reenviamos si el usuario no existe o ya está verificado.
            return "ERROR: No es posible reenviar el código a este email.";
        }

        Usuario usuario = userOpt.get();

        // 1. Generar nuevo token y expiración (10 minutos)
        String newToken = CodigoVerificacionGenerator.generateCode(6);
        LocalDateTime newExpiracion = LocalDateTime.now().plusMinutes(10);

        // 2. Actualizar usuario en la DB
        usuario.setTokenVerificacion(newToken);
        usuario.setFechaExpiracionToken(newExpiracion);
        usuarioRepository.save(usuario);

        // 3. Enviar el nuevo correo
        emailService.sendVerificationEmail(usuario.getEmail(), newToken);

        return "SUCCESS: Nuevo código de verificación enviado. Revisa tu correo.";
    }
}
