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
public class MainSecurity {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtEntryPoint jwtEntryPoint;

    @Bean
    public JwtTokenFilter jwtTokenFilter() {
        return new JwtTokenFilter();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> {
                }) // Habilita CORS (para frontend)
                .csrf(csrf -> csrf.disable()) // Deshabilita CSRF para APIs REST
                .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtEntryPoint))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 🔓 Endpoints públicos
                        .requestMatchers(
                                "/auth/**",
                                "/api/productos/**",
                                "/api/categorias/**",
                                "/api/inventario/**",
                                "/api/checkout/**",
                                "auth/login",
                                "auth/nuevo",
                                "auth/request-reset",
                                "auth/validate-reset-token",
                                "auth/reset-password")
                        .permitAll()
                        .anyRequest().authenticated());

        // Agrega el filtro JWT
        http.addFilterBefore(jwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
