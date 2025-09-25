package com.tiajulia.jugueriatiajulia.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/saludo")
public class holaController {
    @GetMapping("/holiPublic")
    public String holamundo(){
        return "Saludando al hola mundo";
    }

    @GetMapping("/holiProtected")
    public String holamundoProtected(){
        return "Saludando al hola mundo PROTEGUIDO";
    }
}
