package com.tiajulia.backend.util;

import com.tiajulia.backend.security.service.RolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class CreateRoles implements CommandLineRunner {
    @Autowired
    RolService rolService;

    @Override
    public void run(String... args) throws Exception {
        // ``Rol rolAdmin = new Rol(RolUsuario.ADMINISTRADOR);
        // Rol rolUser = new Rol(RolUsuario.CLIENTE);
        // rolService.save(rolAdmin);
        // rolService.save(rolUser);``
    }
}
