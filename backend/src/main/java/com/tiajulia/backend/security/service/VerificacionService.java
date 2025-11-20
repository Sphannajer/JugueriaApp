package com.tiajulia.backend.security.service;

import com.google.common.base.Preconditions;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.tiajulia.backend.security.entity.VerificacionCodigo;
import com.tiajulia.backend.security.repository.VerificacionRepository;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
public class VerificacionService {

    @Autowired
    private VerificacionRepository verificacionRepository;

    // Cache en memoria con Guava
    private final Cache<String, String> codigoCache = CacheBuilder.newBuilder()
            .maximumSize(1000)
            .expireAfterWrite(5, TimeUnit.MINUTES)
            .build();

    // Generar código nuevo con Apache Commons
    public String generarCodigo(String email) {
        Preconditions.checkArgument(StringUtils.isNotBlank(email), "El email no puede estar vacío");

        // RandomStringUtils: genera números de 6 dígitos
        String codigo = RandomStringUtils.randomNumeric(6);
        LocalDateTime expiracion = LocalDateTime.now().plusMinutes(5);

        Optional<VerificacionCodigo> existente = verificacionRepository.findByEmail(email);
        VerificacionCodigo entidad = existente.orElse(new VerificacionCodigo());
        entidad.setEmail(email);
        entidad.setCode(codigo);
        entidad.setExpirationTime(expiracion);
        verificacionRepository.save(entidad);

        codigoCache.put(email, codigo);

        return codigo;
    }

    // 🔹 Validar código con Apache Commons y Guava
    public boolean validarCodigo(String email, String codigoIngresado) {
        Preconditions.checkArgument(StringUtils.isNotBlank(email), "El email no puede estar vacío");
        Preconditions.checkArgument(StringUtils.isNotBlank(codigoIngresado), "El código no puede estar vacío");

        // Buscar en caché primero
        String codigoCacheado = codigoCache.getIfPresent(email);
        if (StringUtils.equals(codigoCacheado, codigoIngresado)) {
            limpiar(email);
            return true;
        }

        // Buscar en BD
        Optional<VerificacionCodigo> opt = verificacionRepository.findByEmail(email);
        if (opt.isEmpty())
            return false;

        VerificacionCodigo verificacion = opt.get();

        // Verificar expiración
        if (verificacion.getExpirationTime().isBefore(LocalDateTime.now())) {
            limpiar(email);
            return false;
        }

        boolean valido = StringUtils.equals(verificacion.getCode(), codigoIngresado);
        if (valido) {
            limpiar(email);
        }

        return valido;
    }

    // Método auxiliar para limpiar caché y BD
    private void limpiar(String email) {
        codigoCache.invalidate(email);
        verificacionRepository.findByEmail(email).ifPresent(verificacionRepository::delete);
    }
}
