package in.login.authify.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    public void sendWelcomeEmail(String toEmail, String name){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Bienvenido a nuestra plataforma");
        message.setText("Hola " +name+ ",\n\n Gracias por registrarse!\n\nSaludos, \nJuguería Tía Julia");
        mailSender.send(message);
    }

    public void sendResetOtpEmail(String toEmail, String otp){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("OTP - Reseteo de contraseña");
        message.setText("El código OTP para reseteo de su contraseña es: "+otp+". Use este código para continuar con el reseteo de la contraseña");
        mailSender.send(message);
    }

    public void sendOtpEmail(String toEmail, String otp){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Estado de su cuenta - Verificación de OTP");
        message.setText("Su OTP es "+otp+". Verifique su cuenta utilizando este OTP.");
        mailSender.send(message);
    }
}
