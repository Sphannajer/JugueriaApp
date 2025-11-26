package com.tiajulia.backend.payment;

// Imports necesarios
import com.mercadopago.MercadoPagoConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

// Le dice a Spring Boot que es una clase de configuración y debe cargarse al inicio.
@Configuration
public class MercadoPagoConfigBean {
    // Inyecta el valor del token de acceso desde application.properties a la
    // variable "accessToken".
    @Value("${mp.access-token}")
    private String accessToken;

    // Este método se ejecuta justo después de que Spring crea esta clase.
    @PostConstruct
    public void init() {
        MercadoPagoConfig.setAccessToken(accessToken); // Configura el SDK (kit de herramientas de software) de Mercado
                                                       // Pago con las credenciales.
    }
}
