const API_URL = 'http://localhost:8080/api/productos';
const FILTER_BASE_URL = 'http://localhost:8080/api/productos/filtrar'; 
const BASE_URL = 'http://localhost:8080'; 

const FRONTEND_BASE_URL = 'http://localhost:5173';


export const getAllProductos = async (categoryName = null, subcategoryName = null) => {
    
    let url = (categoryName && categoryName !== 'all') ? FILTER_BASE_URL : API_URL; 

    if (categoryName && categoryName !== 'all') { 
        
        const params = new URLSearchParams();
        
        params.append('categoria', categoryName);
        
        if (subcategoryName) {
            params.append('subcategoria', subcategoryName);
        }
        
        url = `${FILTER_BASE_URL}?${params.toString()}`;
    }

    console.log("Fetching Productos con URL:", url); 

    const response = await fetch(url);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Fallo al obtener productos. URL: ${url}. Error: ${errorText}`);
    }
    return response.json();
};

export const getAllCategorias = async () => {
    const response = await fetch('http://localhost:8080/api/categorias');
    if (!response.ok) throw new Error('Fallo al obtener categorías.');
    return response.json();
};

export const createProducto = async (formData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Fallo al crear producto: ${response.status} - ${errorText}`);
    }
    return response.json();
};

export const updateProducto = async (id, formData) => {
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

export const deleteProducto = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Fallo al eliminar producto.');
    return true;
};

export const getProductImageUrl = (filename) => {
    if (!filename) return '/default-product.png';
    
    if (filename.startsWith('imagenes/')) {
        const correctedPath = filename.replace('imagenes/', 'images/');
        return `/${correctedPath}`;
    }

    return `${API_URL}/uploads/${filename}`;
};