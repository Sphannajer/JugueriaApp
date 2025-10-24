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

// Para el nuevo usuario
export const registerUser = async (nuevoUsuario) => {
    const response = await fetch(AUTH_URL + 'nuevo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoUsuario),
    });

    if (!response.ok) {
        // La petición falló (400, 401, 500, etc.)

        let errorMessage = `Fallo en el registro: ${response.statusText} (${response.status})`;

        try {
            // 1. Intenta leer el cuerpo JSON de la respuesta de error
            const errorData = await response.json();
            
            // 2. Si el backend envió el campo 'mensaje', úsalo
            if (errorData && errorData.mensaje) {
                errorMessage = errorData.mensaje; 
            }
            
        } catch (e) {
            // Si hay un error al leer el JSON (ej: el cuerpo estaba vacío o no era JSON)
            // Se mantiene el mensaje por defecto (Fallo en el registro: 400)
            console.error("No se pudo parsear el JSON de error:", e);
        }
        
        // 3. Lanza el mensaje de error más específico que encontramos
        throw new Error(errorMessage);

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