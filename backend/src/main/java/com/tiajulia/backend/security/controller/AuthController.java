package com.tiajulia.backend.security.controller;

import com.tiajulia.backend.dto.Mensaje;
import com.tiajulia.backend.security.dto.JwtDto;
import com.tiajulia.backend.security.dto.LoginUsuario;
import com.tiajulia.backend.security.dto.NuevoUsuario;
import com.tiajulia.backend.security.entity.Rol;
import com.tiajulia.backend.security.entity.Usuario;
import com.tiajulia.backend.security.entity.UsuarioPrincipal;
import com.tiajulia.backend.security.entity.VerificacionCodigo;
import com.tiajulia.backend.security.enums.RolUsuario;
import com.tiajulia.backend.security.jwt.JwtProvider;
import com.tiajulia.backend.security.repository.VerificacionRepository;
import com.tiajulia.backend.security.service.EmailService;
import com.tiajulia.backend.security.service.RolService;
import com.tiajulia.backend.security.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.*;

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

    @Autowired
    VerificacionRepository verificacionRepository;

    @Autowired
    EmailService emailService;

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
    public ResponseEntity<?> login(@Valid @RequestBody LoginUsuario loginUsuario, BindingResult bindingResult) {
        if (bindingResult.hasErrors())
            return new ResponseEntity<>(new Mensaje("Campos mal puestos"), HttpStatus.BAD_REQUEST);

        // 1️⃣ Autenticar usuario y contraseña
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginUsuario.getNombreUsuario(), loginUsuario.getContrasena())
            );
        } catch (Exception e) {
            return new ResponseEntity<>(new Mensaje("Usuario o contraseña incorrectos"), HttpStatus.UNAUTHORIZED);
        }

        // 2️⃣ Obtener el usuario autenticado
        Usuario usuario = usuarioService.getByNombreUsuario(loginUsuario.getNombreUsuario())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        verificacionRepository.findByEmail(usuario.getEmail())
                .ifPresent(verificacionRepository::delete);

        // 3️⃣ Generar código de verificación
        String codigo = String.valueOf((int)(Math.random() * 900000) + 100000); // 6 dígitos

        VerificacionCodigo verificacion = new VerificacionCodigo(
                usuario.getEmail(),
                codigo,
                LocalDateTime.now().plusMinutes(5)
        );
        verificacionRepository.save(verificacion);

        // 4️⃣ Enviar el correo
        emailService.sendVerificationCode(usuario.getEmail(), codigo);

        // 5️⃣ Devolver email real al frontend
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Código enviado al correo registrado.");
        response.put("email", usuario.getEmail());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PostMapping("/verificar-codigo")
    public ResponseEntity<?> verificarCodigo(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String codigo = request.get("codigo");

        // 1️⃣ Buscar el código por correo
        Optional<VerificacionCodigo> optionalCodigo = verificacionRepository.findByEmail(email);

        if (optionalCodigo.isEmpty())
            return new ResponseEntity<>(new Mensaje("Código no encontrado"), HttpStatus.NOT_FOUND);

        VerificacionCodigo verificacion = optionalCodigo.get();

        // 2️⃣ Validar si ha expirado
        if (verificacion.getExpirationTime().isBefore(LocalDateTime.now()))
            return new ResponseEntity<>(new Mensaje("El código ha expirado"), HttpStatus.BAD_REQUEST);

        // 3️⃣ Validar el código
        if (!verificacion.getCode().equals(codigo))
            return new ResponseEntity<>(new Mensaje("Código incorrecto"), HttpStatus.BAD_REQUEST);

        // 4️⃣ Buscar el usuario por email
        Usuario usuario = usuarioService.getByEmail(verificacion.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        // ✅ 5️⃣ Crear un UsuarioPrincipal (implementa UserDetails)
        UsuarioPrincipal usuarioPrincipal = UsuarioPrincipal.build(usuario);

        // ✅ 6️⃣ Crear un objeto de autenticación correcto
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                usuarioPrincipal,
                null,
                usuarioPrincipal.getAuthorities()
        );

        // ✅ 7️⃣ Generar el JWT
        String jwt = jwtProvider.generateToken(authentication);

        // 8️⃣ Eliminar el código (opcional)
        verificacionRepository.delete(verificacion);

        // 9️⃣ Devolver el token
        return new ResponseEntity<>(new JwtDto(jwt), HttpStatus.OK);
    }



    @PostMapping("/refresh")
    public ResponseEntity<JwtDto> refresh(@RequestBody JwtDto jwtDto) throws ParseException {
        String token = jwtProvider.refreshToken(jwtDto);
        JwtDto jwt = new JwtDto(token);
        return new ResponseEntity(jwt, HttpStatus.OK);
    }
}
