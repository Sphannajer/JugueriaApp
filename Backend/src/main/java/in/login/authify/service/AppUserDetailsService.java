package in.login.authify.service;

import in.login.authify.entity.UserEntity;
import in.login.authify.repository.UserRepostory;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor

public class AppUserDetailsService implements UserDetailsService {

    private final UserRepostory userRepostory;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity existingUser = userRepostory.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email no encontrado: " +email));
        return new User(existingUser.getEmail(), existingUser.getPassword(), new ArrayList<>());
    }
}
