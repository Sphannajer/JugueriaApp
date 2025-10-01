package com.tiajulia.backend.utils;

import java.security.SecureRandom;
import java.util.Random;

/**
 * Utility class to generate a secure, random alphanumeric code.
 * This code is used as the verification token sent to the user's email.
 */
public class CodigoVerificacionGenerator {

    private static final String ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final Random RANDOM = new SecureRandom();

    /**
     * Generates an alphanumeric code of the specified length.
     * @param length The desired length of the code (e.g., 6).
     * @return The generated code as a String.
     */
    public static String generateCode(int length) {
        StringBuilder code = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            code.append(ALPHANUMERIC.charAt(RANDOM.nextInt(ALPHANUMERIC.length())));
        }
        return code.toString();
    }
}
