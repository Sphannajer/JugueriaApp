package in.login.authify.service;

import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import in.login.authify.entity.UserEntity;
import in.login.authify.io.ProfileRequest;
import in.login.authify.io.ProfileResponse;
import in.login.authify.repository.UserRepostory;
import lombok.RequiredArgsConstructor;
import org.springframework.web.server.ResponseStatusException;


@Service
@RequiredArgsConstructor

public class ProfileServiceImpl implements ProfileService{

    private final UserRepostory userRepostory;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    public ProfileResponse createProfile(ProfileRequest request) {
        UserEntity newProfile = convertToUserEntity(request);
        if (!userRepostory.existsByEmail(request.getEmail())){
            newProfile = userRepostory.save(newProfile);
            return convertToProfileResponse(newProfile);
        }
        throw new ResponseStatusException(HttpStatus.CONFLICT,"El email ya está registrado");
    }

    @Override
    public ProfileResponse getProfile(String email) {
        UserEntity existingUser = userRepostory.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("El usuario no ha sido encontrado: " +email));
        return convertToProfileResponse(existingUser);
    }

    @Override
    public void sendResetOtp(String email) {
        UserEntity existingEntity = userRepostory.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " +email));
        //Creacion del OTP de 6 dígitos
        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));
        //Calcular el tiempo de expiración
        long expiryTime = System.currentTimeMillis() + (15 * 60 * 1000);
        //Actualizar el perfil / usuario
        existingEntity.setResetOtp(otp);
        existingEntity.setResetOtpExpireAt(expiryTime);
        //Guardar en la Base de Datos
        userRepostory.save(existingEntity);

        try{
            emailService.sendResetOtpEmail(existingEntity.getEmail(), otp);
        } catch (Exception ex){
            throw new RuntimeException("No se ha podido enviar el email");
        }
    }

    @Override
    public void resetPassword(String email, String otp, String newPassword) {
        UserEntity existingUser = userRepostory.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("El usuario no fue encontrado: "+email));

        if(existingUser.getResetOtp() == null || !existingUser.getResetOtp().equals(otp)){
            throw new RuntimeException("OTP Inválida");
        }

        if(existingUser.getResetOtpExpireAt() < System.currentTimeMillis()){
            throw new RuntimeException("OTP Expirado");
        }

        existingUser.setPassword(passwordEncoder.encode(newPassword));
        existingUser.setResetOtp(null);
        existingUser.setResetOtpExpireAt(0L);

        userRepostory.save(existingUser);
    }

    @Override
    public void sendOtp(String email) {
        UserEntity existingUser = userRepostory.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: "+email));
        if(existingUser.getIsAccountVerified() != null && existingUser.getIsAccountVerified()){
            return;
        }
        //Creacion del OTP de 6 dígitos
        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));
        //Calcular el tiempo de expiración
        long expiryTime = System.currentTimeMillis() + (24 * 60 * 60 * 1000);
        //Actualizar la entidad del usuario
        existingUser.setVerifyOtp(otp);
        existingUser.setVerifyOtpExpireAt(expiryTime);
        //Guardar en la Base de Datos
        userRepostory.save(existingUser);

        try{
            emailService.sendOtpEmail(existingUser.getEmail(), otp);
        } catch (Exception e) {
            throw new RuntimeException("No se ha podido enviar el email");
        }
    }

    @Override
    public void verifyOtp(String email, String otp) {
        UserEntity existingUser = userRepostory.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: "+email));
        if(existingUser.getVerifyOtp() == null || !existingUser.getVerifyOtp().equals(otp)) {
            throw new RuntimeException("OTP inválida");
        }

        if(existingUser.getVerifyOtpExpireAt() < System.currentTimeMillis()){
            throw new RuntimeException("OTP expirado");
        }

        existingUser.setIsAccountVerified(true);
        existingUser.setVerifyOtp(null);
        existingUser.setVerifyOtpExpireAt(0L);

        userRepostory.save(existingUser);
    }

    private ProfileResponse convertToProfileResponse(UserEntity newProfile){
        return ProfileResponse.builder()
        .name(newProfile.getName())
        .email(newProfile.getEmail())
        .userId(newProfile.getUserId())
        .isAccountVerified(newProfile.getIsAccountVerified())
        .build();
    }

    private UserEntity convertToUserEntity(ProfileRequest request){
        return UserEntity.builder()
            .email(request.getEmail())
            .userId(UUID.randomUUID().toString())
            .name(request.getName())
            .password(passwordEncoder.encode(request.getPassword()))
            .isAccountVerified(false)
            .resetOtpExpireAt(0L)
            .verifyOtp(null)
            .verifyOtpExpireAt(0)
            .resetOtp(null)
            .build();

    }
}