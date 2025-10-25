package com.tiajulia.backend.security;
import com.tiajulia.backend.security.jwt.JwtEntryPoint;
import com.tiajulia.backend.security.jwt.JwtTokenFilter;
import com.tiajulia.backend.security.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager; // Nuevo Import
import org.springframework.security.authentication.dao.DaoAuthenticationProvider; // Nuevo Import
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration; // Nuevo Import
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder; // Ya lo tienes
import org.springframework.security.web.SecurityFilterChain; // Nuevo Import
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;



@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class MainSecurity  {

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    JwtEntryPoint jwtEntryPoint;

    @Bean
    public JwtTokenFilter jwtTokenFilter(){
        return new JwtTokenFilter();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }


    // Este Bean se usa para inyectar el AuthenticationManager donde se necesite (ej. en tu controlador de login).
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }



    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> cors.configure(http)) //Activa CORS
                .csrf(csrf -> csrf.disable()) // Deshabilita CSRF para APIs REST

                .exceptionHandling(handling ->
                        handling.authenticationEntryPoint(jwtEntryPoint)) // Manejo de excepciones

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Configuración JWT

                .authorizeHttpRequests(auth -> auth
                        // Rutas públicas: /auth/**
                        .requestMatchers("/auth/**").permitAll()

                        .requestMatchers("/api/productos/uploads/**").permitAll()
                        .requestMatchers("/api/productos/**").permitAll() 
                        .requestMatchers("/api/categorias/**").permitAll()
                        
                        .anyRequest().authenticated()
                );

        // Agrega tu filtro JWT antes del filtro estándar de Spring
        http.addFilterBefore(jwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
