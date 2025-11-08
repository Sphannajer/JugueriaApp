package com.tiajulia.backend.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationCode(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Código de verificación - Tía Julia 🍹");
        message.setText("Tu código de verificación es: " + code + "\n\nGracias por usar nuestro sistema ❤️");
        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String to, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Restablecer tu contraseña - Tía Julia 🍹");
        message.setText("""
            Hola 👋,

            Hemos recibido una solicitud para restablecer tu contraseña.
            Puedes hacerlo ingresando al siguiente enlace:

            %s

            Este enlace expirará en 15 minutos.

            Si tú no hiciste esta solicitud, simplemente ignora este mensaje.
            
            Atentamente,
            El equipo de Tía Julia ❤️
            """.formatted(resetLink));

        mailSender.send(message);
    }

}

