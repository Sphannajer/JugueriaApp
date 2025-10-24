package com.tiajulia.backend.security.repository;

import com.tiajulia.backend.security.entity.VerificacionCodigo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificacionRepository extends JpaRepository<VerificacionCodigo, Long> {
    Optional<VerificacionCodigo> findByEmail(String email);
}

