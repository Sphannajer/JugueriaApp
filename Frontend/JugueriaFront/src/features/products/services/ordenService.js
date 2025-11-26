// Archivo: src/services/ordenService.js

// URL base del endpoint de órdenes en el Backend de Spring
const BASE_URL = 'http://localhost:8080/api/v1/ordenes'; 

// Función asíncrona para enviar la solicitud de finalizar compra al Backend
export const procesarFinalizarCompra = async (ordenData) => { // 'ordenData' es el OrdenRequestDTO (total + detalles)
    try {
        // Realiza una petición POST al endpoint específico de checkout
        const response = await fetch(`${BASE_URL}/checkout`, {
            method: 'POST', // Método HTTP para la creación de recursos
            headers: {
                // Indica al Backend que el cuerpo de la petición es JSON
                'Content-Type': 'application/json',
            },
            // Convierte el objeto JavaScript (ordenData) a una cadena JSON
            body: JSON.stringify(ordenData),
        });

        // Verifica si la respuesta del servidor no fue exitosa (código >= 400)
        if (!response.ok) {
            // Spring devolverá un error 500 si hay un problema con el stock o la DB.
            const errorText = await response.text(); // Intenta leer el mensaje de error del cuerpo
            throw new Error(errorText || `Error del servidor: ${response.status}`); // Lanza el error con el mensaje del servidor
        }

        // Si es exitosa (código 201 CREATED), lee el mensaje de éxito
        const successMessage = await response.text();
        return successMessage; // Devuelve el mensaje de confirmación
    } catch (error) {
        console.error("Error en la solicitud de checkout:", error);
        throw error; // Re-lanza el error para que el componente de React lo maneje
    }
};