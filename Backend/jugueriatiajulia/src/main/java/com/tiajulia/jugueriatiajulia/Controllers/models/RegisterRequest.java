package com.tiajulia.jugueriatiajulia.controllers.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    private String nombre;
    private String email;
    private String contrasena;
    private String celular;
    private String direccion;
}
