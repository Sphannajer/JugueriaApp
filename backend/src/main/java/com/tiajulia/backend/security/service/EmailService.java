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
}

