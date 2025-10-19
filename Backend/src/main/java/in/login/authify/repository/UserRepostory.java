package in.login.authify.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import in.login.authify.entity.UserEntity;
import java.util.Optional;

public interface UserRepostory extends JpaRepository<UserEntity, Long>{
    Optional <UserEntity> findByEmail(String email);

    Boolean existsByEmail(String email);

}
