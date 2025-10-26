package com.tiajulia.backend.security.jwt;

import com.nimbusds.jwt.JWT;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.JWTParser;
import com.tiajulia.backend.security.dto.JwtDto;
import com.tiajulia.backend.security.entity.UsuarioPrincipal;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtProvider {

    private final static Logger logger = LoggerFactory.getLogger(JwtProvider.class);
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private int expiration;
    private SecretKey key; // NUEVO: La clave secreta en formato Key

    // --- 1. Inicializa la Clave Secreta UNA SOLA VEZ ---
    @PostConstruct
    public void init() {
        // Convierte el String secreto a un SecretKey usando HS512
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }


    public String generateToken(Authentication authentication) {
        UsuarioPrincipal usuarioPrincipal = (UsuarioPrincipal) authentication.getPrincipal();
        List<String> roles = usuarioPrincipal.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
        return Jwts.builder()
                .subject(usuarioPrincipal.getUsername())
                .claim("roles",roles)
                .issuedAt(new Date())
                .expiration(new Date(new Date().getTime() + expiration ))
                .signWith(this.key) // CORREGIDO: Usamos el SecretKey 'key', ya no el String 'secret'
                .compact();
    }


    public String getNombreUsuarioFromToken(String token) {
        return Jwts.parser()
                .verifyWith(this.key) // CORREGIDO: Usamos el SecretKey 'key'
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject(); // getSubject() es el método correcto para leer
    }

    // --- 4. Método para validar el token ---
    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(this.key).build().parseClaimsJws(token);
            return true;
        } catch (io.jsonwebtoken.security.SignatureException e) { // Uso la excepción moderna
            logger.error("fail en la firma");
        } catch (MalformedJwtException e) {
            logger.error("Token mal formado");
        } catch (UnsupportedJwtException e) {
            logger.error("Token no soportado");
        } catch (ExpiredJwtException e) {
            logger.error("Token expirado");
        } catch (IllegalArgumentException e) {
            logger.error("Token vacio");
        }
        return false;
    }

    public String refreshToken(JwtDto jwtDto) throws ParseException {
        JWT jwt = JWTParser.parse(jwtDto.getToken());
        JWTClaimsSet claims = jwt.getJWTClaimsSet();
        String nombreUsuario = claims.getSubject();
        List<String> roles = (List<String>)claims.getClaim("roles");

        return Jwts.builder()
                .subject(nombreUsuario)
                .claim("roles",roles)
                .issuedAt(new Date())
                .expiration(new Date(new Date().getTime() + expiration))
                .signWith(this.key) // CORREGIDO: Usamos el SecretKey 'key', ya no el String 'secret'
                .compact();
    }
}
