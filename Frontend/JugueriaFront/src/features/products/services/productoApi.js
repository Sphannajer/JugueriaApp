// Definición de URLs base para los endpoints del Backend
const API_URL = 'http://localhost:8080/api/productos'; // URL base para operaciones CRUD de Producto
const FILTER_BASE_URL = 'http://localhost:8080/api/productos/filtrar'; // URL base para filtrar productos
const BASE_URL = 'http://localhost:8080'; // URL base del servidor Spring

const FRONTEND_BASE_URL = 'http://localhost:5173'; // URL del frontend (útil para CORS o logs)


// Función principal para obtener productos, con o sin filtros de categoría/subcategoría
export const getAllProductos = async (categoryName = null, subcategoryName = null) => {
    
    // Determina si se usará la URL de filtro o la URL de todos los productos
    let url = (categoryName && categoryName !== 'all') ? FILTER_BASE_URL : API_URL; 

    if (categoryName && categoryName !== 'all') { 
        
        // Crea un objeto para construir los parámetros de la URL (?categoria=X&subcategoria=Y)
        const params = new URLSearchParams();
        
        // Agrega el parámetro de categoría si está presente
        params.append('categoria', categoryName);
        
        if (subcategoryName) {
            // Agrega el parámetro de subcategoría si está presente
            params.append('subcategoria', subcategoryName);
        }
        
        // Construye la URL final con los parámetros de consulta
        url = `${FILTER_BASE_URL}?${params.toString()}`;
    }

    console.log("Fetching Productos con URL:", url); 

    // Realiza la petición GET al Backend
    const response = await fetch(url);
    // Verifica si la respuesta HTTP es exitosa (código 200-299)
    if (!response.ok) {
        const errorText = await response.text();
        // Lanza un error si la petición falló
        throw new Error(`Fallo al obtener productos. URL: ${url}. Error: ${errorText}`);
    }
    // Devuelve los datos de la respuesta en formato JSON
    return response.json();
};

// Función para obtener todas las categorías disponibles
export const getAllCategorias = async () => {
    // URL del endpoint de categorías
    const response = await fetch('http://localhost:8080/api/categorias');
    if (!response.ok) throw new Error('Fallo al obtener categorías.');
    return response.json();
};

// Función para crear un nuevo producto (usa POST y `multipart/form-data`)
export const createProducto = async (formData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        // El `formData` contiene tanto el JSON del producto como el archivo
        body: formData,
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Fallo al crear producto: ${response.status} - ${errorText}`);
    }
    return response.json();
};

// Función para actualizar un producto existente (usa PUT y `multipart/form-data`)
export const updateProducto = async (id, formData) => {
    // Construye la URL con el ID del producto
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        body: formData,
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Fallo al actualizar producto: ${response.status} - ${errorText}`);
    }
    return response.json();
};

// Función para eliminar un producto
export const deleteProducto = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Fallo al eliminar producto.');
    return true;
};

// Función para construir la URL completa de la imagen de un producto
export const getProductImageUrl = (filename) => {
    if (!filename) return '/default-product.png';
    
    // Lógica para manejar rutas de imágenes antiguas o estáticas
    if (filename.startsWith('imagenes/')) {
        const correctedPath = filename.replace('imagenes/', 'images/');
        return `/${correctedPath}`;
    }

    // Ruta estándar para las imágenes servidas por el endpoint de Spring Boot
    return `${API_URL}/uploads/${filename}`;
};