// Archivo: src/services/ordenService.js (o donde manejes tus APIs)

// Usaremos 'axios' si ya lo estás usando en otros lugares,
// si no, usaremos 'fetch' para simplicidad. Asumo que usas fetch.

const BASE_URL = 'http://localhost:8080/api/v1/ordenes'; // Asegúrate que el puerto 8080 sea correcto

export const procesarFinalizarCompra = async (ordenData) => {
    try {
        const response = await fetch(`${BASE_URL}/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Si usas tokens de autenticación (JWT), agrégalo aquí
            },
            body: JSON.stringify(ordenData),
        });

        if (!response.ok) {
            // Spring devolverá un error 500 si hay un problema con el stock o la DB.
            const errorText = await response.text();
            throw new Error(errorText || `Error del servidor: ${response.status}`);
        }

        const successMessage = await response.text();
        return successMessage; // Esto debería ser "Venta Finalizada con éxito. ID: [X]"

    } catch (error) {
        console.error("Error en la solicitud de checkout:", error);
        throw error;
    }
};