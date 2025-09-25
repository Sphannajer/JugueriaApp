package com.tiajulia.jugueriatiajulia.service;

import com.tiajulia.jugueriatiajulia.controllers.models.AuthResponse;
import com.tiajulia.jugueriatiajulia.controllers.models.AuthenticationRequest;
import com.tiajulia.jugueriatiajulia.controllers.models.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);

    AuthResponse authenticate(AuthenticationRequest request);
}
