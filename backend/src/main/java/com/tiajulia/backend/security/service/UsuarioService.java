package com.tiajulia.backend.security.service;

import com.tiajulia.backend.security.entity.Usuario;
import com.tiajulia.backend.security.repository.UsuarioRepository;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.Validate;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class UsuarioService {

    private static final Logger log = LoggerFactory.getLogger(UsuarioService.class);

    @Autowired
    private UsuarioRepository usuarioRepository;


    // Busca un usuario por nombre de usuario.

    public Optional<Usuario> getByNombreUsuario(String nombreUsuario) {
        Validate.notBlank(nombreUsuario, "El nombre de usuario no puede estar vacío");
        log.info("Buscando usuario por nombre: {}", nombreUsuario);
        return usuarioRepository.findByNombreUsuario(StringUtils.trim(nombreUsuario));
    }


     //Verifica si existe un usuario con ese nombre.

    public boolean existsByNombreUsuario(String nombreUsuario) {
        Validate.notBlank(nombreUsuario, "El nombre de usuario no puede estar vacío");
        boolean existe = usuarioRepository.existsByNombreUsuario(StringUtils.trim(nombreUsuario));
        log.debug("¿Existe usuario '{}'? {}", nombreUsuario, existe);
        return existe;
    }


    //Verifica si existe un usuario con ese email.

    public boolean existsByEmail(String email) {
        Validate.notBlank(email, "El correo no puede estar vacío");
        boolean existe = usuarioRepository.existsByEmail(StringUtils.lowerCase(StringUtils.trim(email)));
        log.debug("¿Existe email '{}'? {}", email, existe);
        return existe;
    }

     //Guarda un nuevo usuario en base de datos.
    public void save(Usuario usuario) {
        Validate.notNull(usuario, "El objeto usuario no puede ser nulo");
        Validate.notBlank(usuario.getEmail(), "El correo del usuario no puede estar vacío");
        log.info("Guardando usuario: {}",
                ToStringBuilder.reflectionToString(usuario, ToStringStyle.JSON_STYLE));
        usuarioRepository.save(usuario);
    }

    //Busca un usuario por correo electrónico.

    public Optional<Usuario> getByEmail(String email) {
        Validate.notBlank(email, "El correo no puede estar vacío");
        log.info("Buscando usuario por correo: {}", email);
        return usuarioRepository.findByEmail(StringUtils.lowerCase(StringUtils.trim(email)));
    }
}
