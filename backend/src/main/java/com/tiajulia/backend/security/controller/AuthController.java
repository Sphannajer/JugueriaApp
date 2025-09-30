package com.tiajulia.backend.security.controller;

import com.tiajulia.backend.dto.Mensaje;
import com.tiajulia.backend.security.dto.JwtDto;
import com.tiajulia.backend.security.dto.LoginUsuario;
import com.tiajulia.backend.security.dto.NuevoUsuario;
import com.tiajulia.backend.security.entity.Rol;
import com.tiajulia.backend.security.entity.Usuario;
import com.tiajulia.backend.security.enums.RolUsuario;
import com.tiajulia.backend.security.jwt.JwtProvider;
import com.tiajulia.backend.security.service.RolService;
import com.tiajulia.backend.security.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UsuarioService usuarioService;

    @Autowired
    RolService rolService;

    @Autowired
    JwtProvider jwtProvider;

    @PostMapping("/nuevo")
    public ResponseEntity<?> nuevo(@Valid @RequestBody NuevoUsuario nuevoUsuario, BindingResult bindingResult) {
        if(bindingResult.hasErrors()){
            String primerError = bindingResult.getFieldErrors().stream()
                    .map(err -> err.getDefaultMessage())
                    .findFirst()
                    .orElse("Error de validación desconocido");
            return new ResponseEntity(new Mensaje(primerError), HttpStatus.BAD_REQUEST);
        }
            if (bindingResult.hasErrors())
                return new ResponseEntity(new Mensaje("Campos mal puestos o email inválido"), HttpStatus.BAD_REQUEST);
            if (usuarioService.existsByNombreUsuario(nuevoUsuario.getNombreUsuario()))
                return new ResponseEntity(new Mensaje("Ese usuario ya fue registrado"), HttpStatus.BAD_REQUEST);
            if (usuarioService.existsByEmail(nuevoUsuario.getEmail()))
                return new ResponseEntity(new Mensaje("Ese email ya registrado"), HttpStatus.BAD_REQUEST);
            Usuario usuario = new Usuario(
                    nuevoUsuario.getNombre(),
                    nuevoUsuario.getNombreUsuario(),
                    nuevoUsuario.getEmail(),
                    passwordEncoder.encode(nuevoUsuario.getContrasena()),
                    nuevoUsuario.getCelular(),
                    nuevoUsuario.getDireccion()
            );
            Set<Rol> roles = new HashSet<>();
            roles.add(rolService.getByRolNombre(RolUsuario.CLIENTE).get());
            if (nuevoUsuario.getRoles().contains("admin"))
                roles.add(rolService.getByRolNombre(RolUsuario.ADMINISTRADOR).get());
            usuario.setRoles(roles);
            usuarioService.save(usuario);
            return new ResponseEntity(new Mensaje("usuario guardado"), HttpStatus.CREATED);
        }

    @PostMapping("/login")
    public ResponseEntity<JwtDto> login(@Valid @RequestBody LoginUsuario loginUsuario, BindingResult bindingResult){
        if(bindingResult.hasErrors())
            return new ResponseEntity(new Mensaje("campos mal puestos"), HttpStatus.BAD_REQUEST);
        Authentication authentication =
                authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginUsuario.getNombreUsuario(), loginUsuario.getContrasena()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtProvider.generateToken(authentication);
        JwtDto jwtDto = new JwtDto(jwt);
        return new ResponseEntity(jwtDto, HttpStatus.OK);
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtDto> refresh(@RequestBody JwtDto jwtDto) throws ParseException {
        String token = jwtProvider.refreshToken(jwtDto);
        JwtDto jwt = new JwtDto(token);
        return new ResponseEntity(jwt, HttpStatus.OK);
    }
}
