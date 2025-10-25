package com.tiajulia.backend.security.repository;

import com.tiajulia.backend.security.entity.Rol;
import com.tiajulia.backend.security.enums.RolUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface RolRepository extends JpaRepository<Rol, Integer> {
    Optional<Rol> findByRolNombre(RolUsuario rolNombre);
}
