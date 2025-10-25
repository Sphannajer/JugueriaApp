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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || 'Error en login');
  }

  return data; // data.mensaje = "Código enviado al correo registrado."
};

export const verifyCode = async (email, codigo) => {
  const response = await fetch(AUTH_URL + 'verificar-codigo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, codigo }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || 'Código incorrecto o expirado');
  }

  // ✅ Aquí ya viene el token, así que lo guardamos
  if (data.token) {
    setToken(data.token);
  }

  return data;
};

