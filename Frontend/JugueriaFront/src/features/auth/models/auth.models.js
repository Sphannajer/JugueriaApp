//Funciones para crear login Usuario y NuevoUsuario

/**
 * @typedef {object} JwtDTO
 * @property {string} token El token de autenticación JWT.
 */

// Factory para crear el objeto JwtDTO
export const createJwtDTO = (token) => {
  return {
    token: token
  };
};


export const createNuevoUsuario = (nombre, nombreUsuario, email, contrasena , celular,direccion) => {
    // Definimos el rol por defecto.
    const roles = ["cliente"]; 
    
    return {
        
        nombre: nombre,
        nombreUsuario: nombreUsuario,
        email: email,
        contrasena: contrasena,
        celular: celular,
        direccion: direccion,
        roles: roles 
    };
};

export const createLoginUsuario = (nombreUsuario,contrasena) =>{
    return{
        nombreUsuario : nombreUsuario,
        contrasena: contrasena
    }
}