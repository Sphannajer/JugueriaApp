// CONSTANTES DE SESIÓN (Mapeo de las claves de TokenService) ===
import { environment } from "../enviroments/enviroment";
const TOKEN_KEY = 'AuthToken';
const AUTH_URL = environment.authURL;


// 🔑 LÓGICA DE TOKEN/SESIÓN (TokenService traducido a funciones JS)

export const setToken = (token) => {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
    return window.localStorage.getItem(TOKEN_KEY);
};

export const isLogged = () => {
    return !!getToken();
};

export const getUserName = () => {
    if (!isLogged()) return null;

    const token = getToken();
    const payload = token.split(".")[1];
    const payloadDecoded = atob(payload);
    const values = JSON.parse(payloadDecoded);

    return values.sub || null;
};


export const isAdmin = () => {
    if (!isLogged()){ 
        return false;
    }

    const token = getToken();
    const payload = token.split(".")[1];
    const payloadDecoded = atob(payload);
    const values = JSON.parse(payloadDecoded);

    const roles = values.roles || [];
    return roles.includes("ADMINISTRADOR");
};


export const logOut = () => {
    window.localStorage.clear();
    window.location.href = "/login";
};

// LÓGICA DE CONEXIÓN HTTP (Mapea el AuthService)

//Para el nuevo usuario
export const registerUser = async (nuevoUsuario) => {
    const response = await fetch(AUTH_URL + 'nuevo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoUsuario),
    });

    if (!response.ok) {

        try {
            const errorData = await response.json();
            throw new Error(errorData.mensaje || 'Error en el registro.');
        } catch {
            // Si falla leer el JSON (cuerpo vacío), lanza un error claro.
            throw new Error(`Fallo en el registro: ${response.statusText} (${response.status})`);
        }

    }
    // Retorna los datos de éxito
    return response.json();
};

//Para Login
export const loginUser = async (loginUsuario) => {
    const response = await fetch(AUTH_URL + 'login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginUsuario),
    });

    if (!response.ok) {

        try {
            const errorData = await response.json();
            // Si pudimos leer el JSON, usamos el mensaje del backend.
            throw new Error(errorData.mensaje || 'Credenciales incorrectas.');
        } catch {
            // Si falla leer el JSON (cuerpo vacío en el 401), lanzamos un mensaje claro.
            throw new Error(`Fallo de autenticación: ${response.statusText} (${response.status})`);
        }

    }

    const data = await response.json(); // Data es tu JwtDTO
    setToken(data.token);


    return data;
};