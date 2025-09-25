package com.tiajulia.jugueriatiajulia.service;

import com.tiajulia.jugueriatiajulia.config.JwtService;
import com.tiajulia.jugueriatiajulia.controllers.models.AuthResponse;
import com.tiajulia.jugueriatiajulia.controllers.models.AuthenticationRequest;
import com.tiajulia.jugueriatiajulia.controllers.models.RegisterRequest;
import com.tiajulia.jugueriatiajulia.entity.Role;
import com.tiajulia.jugueriatiajulia.entity.User;
import com.tiajulia.jugueriatiajulia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {
        var user = User.builder().nombre(request.getNombre())
                .email(request.getEmail())
                .contrasena(passwordEncoder.encode(request.getContrasena()))
                .celular(request.getCelular())
                .direccion(request.getDireccion())
                .rol(Role.CLIENTE)
                .build();
        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder().token(jwtToken).build();
    }

    @Override
    public AuthResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getContrasena()
                )
        );
        var user = userRepository.findUserByEmail(request.getEmail()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return  AuthResponse.builder().token(jwtToken).build();
    }
}
