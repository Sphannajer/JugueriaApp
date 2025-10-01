package com.tiajulia.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service to handle email sending operations, specifically for account verification.
 * Requires Spring Boot Mail starter and SMTP configuration in application.properties.
 */
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Sends a verification email containing the token to the user.
     * @param to The recipient's email address.
     * @param token The verification code/token.
     */
    public void sendVerificationEmail(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("Verificación de Cuenta - Juguería Tia Julia");
        message.setText("¡Bienvenido/a a Juguería Tía Julia!\n\n"
                + "Tu código de verificación es: \n\n"
                + "➡️ " + token + " ⬅️"
                + "\n\nEste código expira en 10 minutos. ¡Gracias por registrarte!");

        mailSender.send(message);
    }
}
