import React, { useState, useEffect } from 'react';
import { getProductImageUrl } from '../../features/products/services/productoApi';

// Expresión regular para validar caracteres permitidos en campos de texto
const VALID_CHARS_REGEX = /^[a-zA-Z0-9\s.,()ñÑáéíóúÁÉÍÓÚ-]+$/;

// Componente del formulario para crear o editar un producto
function ProductoForm({ initialData, categories, onSubmit, onCancel, isEditing }) {
    
    // Estado que mantiene los datos del formulario (Nombre, Precio, Categoría, etc.)
    const [formData, setFormData] = useState(initialData);
    // Estado para el archivo de imagen seleccionado por el usuario
    const [file, setFile] = useState(null);
    // Estado para la URL de previsualización de la imagen
    const [imagePreview, setImagePreview] = useState(initialData.urlImagen ? getProductImageUrl(initialData.urlImagen) : null);
    
    // Estado para almacenar errores de validación por campo
    const [validationErrors, setValidationErrors] = useState({});
    // Estado para un mensaje de error general
    const [generalError, setGeneralError] = useState(null);

    // Hook para resetear el formulario cada vez que cambia el producto inicial (ej: al pasar de 'Crear' a 'Editar')
    useEffect(() => {
        setFormData(initialData);
        setImagePreview(initialData.urlImagen ? getProductImageUrl(initialData.urlImagen) : null);
        setFile(null);
        setValidationErrors({});
        setGeneralError(null);
    }, [initialData]);

    // Maneja el evento focus: limpia el valor '0' en campos numéricos al empezar a escribir
    const handleFocus = (e) => {
        const { name, value } = e.target;
        if (!isEditing && (value === '0' || value === 0)) {
            setFormData(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        // Limpia el error de validación específico al interactuar con el campo
        setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    };

    // Maneja los cambios en todos los inputs del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        let newValue = value;
        // Convierte a float para el precio o int para el stock
        if (name === 'precio') {
            newValue = parseFloat(value) || 0;
        } else if (name === 'stock') {
            newValue = parseInt(value) || 0;
        }

        setFormData(prev => {
            if (name === 'categoriaId') {
                // Manejo especial para la selección de categoría (se requiere un objeto)
                return { ...prev, categoria: { idCategoria: parseInt(newValue) } };
            }
            return { ...prev, [name]: newValue };
        });
        
        setValidationErrors(prev => ({ ...prev, [name]: undefined }));
        setGeneralError(null);
    };

    // Maneja la selección del archivo de imagen
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            // Crea una URL temporal para previsualizar la imagen en el navegador
            setImagePreview(URL.createObjectURL(selectedFile));
        } else {
            // Vuelve a la imagen guardada o a null si no se seleccionó archivo
            setImagePreview(initialData.urlImagen ? getProductImageUrl(initialData.urlImagen) : null);
        }
        setValidationErrors(prev => ({ ...prev, file: undefined }));
        setGeneralError(null);
    };


    // Función de validación y envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        
        let errors = {};
        let isValid = true;
        const invalidCharMessage = "Solo se permiten letras, números, espacios, tildes (áéíóú) y los símbolos ., - ()";

        // --- 1. Validaciones de obligatoriedad y límites numéricos ---
        if (!formData.nombre) { errors.nombre = "El Nombre es obligatorio."; isValid = false; }
        if (!formData.descripcion) { errors.descripcion = "La Descripción es obligatoria."; isValid = false; }
        if (formData.precio <= 0) { errors.precio = "El Precio debe ser mayor a 0."; isValid = false; }
        if (formData.stock < 0) { errors.stock = "El Stock no puede ser negativo."; isValid = false; }
        if (!formData.categoria.idCategoria) { errors.categoriaId = "Debe seleccionar una Categoría."; isValid = false; }
        if (!formData.subcategoria) { errors.subcategoria = "Debe seleccionar el Tipo de Producto (Subcategoría)."; isValid = false; }

        // --- 2. Validaciones de caracteres (Regex) ---
        if (formData.nombre && !VALID_CHARS_REGEX.test(formData.nombre)) {
            errors.nombre = invalidCharMessage;
            isValid = false;
        }
        
        if (formData.descripcion && !VALID_CHARS_REGEX.test(formData.descripcion)) {
            errors.descripcion = invalidCharMessage;
            isValid = false;
        }

        // --- 3. Validación de Archivo (solo si es nuevo producto) ---
        if (!isEditing && !file) {
             errors.file = "Debe seleccionar una imagen para el nuevo producto.";
             isValid = false;
        }

        if (!isValid) {
            // Muestra los errores y hace scroll al inicio del formulario
            setValidationErrors(errors);
            setGeneralError("Por favor, corrige los errores en el formulario para continuar.");
            document.querySelector('.registro-card').scrollTop = 0;
            return;
        }
        
        // --- 4. Preparación de datos para el envío (MultipartForm) ---
        const dataToSend = new FormData(); // Usado para enviar JSON y Archivo
        const productJSON = { ...formData };
        
        // Limpia campos irrelevantes para la creación
        if (!isEditing) {
            delete productJSON.id;
            delete productJSON.urlImagen;
        }
        
        // Añade el objeto producto como un string JSON (requerido por Spring)
        dataToSend.append('producto', JSON.stringify(productJSON));

        // Añade el archivo solo si se ha seleccionado uno nuevo
        if (file) {
            dataToSend.append('file', file);
        }
        
        onSubmit(dataToSend); // Llama a la función de envío del componente padre
    };

    return (
        <div className="registro-card">
            <h3>{isEditing ? 'Modificar Producto' : 'Registro de Nuevo Producto'}</h3>
            <form onSubmit={handleSubmit} className="product-form-style">
                
                {generalError && <p className="general-error-message">{generalError}</p>}
                
                {/* Campo Nombre */}
                <div className="input-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input 
                        type="text" 
                        id="nombre" 
                        name="nombre" 
                        value={formData.nombre} 
                        onChange={handleChange} 
                        required 
                        pattern="[a-zA-Z0-9\s.,()ñÑáéíóúÁÉÍÓÚ-]+"
                        title="Solo se permiten letras, números, espacios y los símbolos: ., - ()"
                    />
                    {validationErrors.nombre && <p className="error-message">{validationErrors.nombre}</p>}
                </div>
                
                {/* Campo Descripción */}
                <div className="input-group">
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea 
                        id="descripcion" 
                        name="descripcion" 
                        value={formData.descripcion} 
                        onChange={handleChange} 
                        required 
                    />
                    {validationErrors.descripcion && <p className="error-message">{validationErrors.descripcion}</p>}
                </div>

                {/* Campo Precio */}
                <div className="input-group">
                    <label htmlFor="precio">Precio (S/)</label>
                    <input 
                        type="number" 
                        id="precio" 
                        name="precio" 
                        // Limpia el campo visualmente si el valor es 0 en modo creación
                        value={formData.precio === 0 && !isEditing ? '' : formData.precio} 
                        onChange={handleChange} 
                        onFocus={handleFocus}
                        step="0.01" 
                        min="0"
                        required 
                    />
                    {validationErrors.precio && <p className="error-message">{validationErrors.precio}</p>}
                </div>

                {/* Campo Stock */}
                <div className="input-group">
                    <label htmlFor="stock">Stock</label>
                    <input 
                        type="number" 
                        id="stock" 
                        name="stock" 
                        // Limpia el campo visualmente si el valor es 0 en modo creación
                        value={formData.stock === 0 && !isEditing ? '' : formData.stock} 
                        onChange={handleChange} 
                        onFocus={handleFocus}
                        min="0"
                        required 
                    />
                    {validationErrors.stock && <p className="error-message">{validationErrors.stock}</p>}
                </div>
                
                {/* Campo Tipo de Producto (Subcategoría) */}
                <div className="input-group">
                    <label htmlFor="subcategoria">Tipo de Producto</label>
                    <select 
                        id="subcategoria" 
                        name="subcategoria" 
                        value={formData.subcategoria} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">Seleccione el tipo</option>
                        <option value="Con azúcar">Con Azúcar</option>
                        <option value="Con Stevia">Con Stevia</option>
                    </select>
                    {validationErrors.subcategoria && <p className="error-message">{validationErrors.subcategoria}</p>}
                </div>

                {/* Campo Categoría (Select dinámico) */}
                <div className="input-group">
                    <label htmlFor="categoriaId">Categoría</label>
                    <select 
                        id="categoriaId" 
                        name="categoriaId" 
                        // Usa idCategoria o id, dependiendo de cómo vengan los datos
                        value={formData.categoria.idCategoria || formData.categoria.id || ''} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">Seleccione una categoría</option>
                        {/* Mapea las categorías recibidas por props */}
                        {categories.map(cat => (
                            <option key={cat.idCategoria || cat.id} value={cat.idCategoria || cat.id}>{cat.nombre}</option>
                        ))}
                    </select>
                    {validationErrors.categoriaId && <p className="error-message">{validationErrors.categoriaId}</p>}
                </div>

                {/* Campo de Subida de Imagen y Previsualización */}
                <div className="input-group">
                    <label htmlFor="file">Seleccionar Imagen</label>
                    <input 
                        type="file" 
                        id="file" 
                        name="file" 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        // El campo es requerido solo si es un nuevo producto y no hay imagen anterior
                        required={!isEditing && !initialData.urlImagen} 
                    />
                    {validationErrors.file && <p className="error-message">{validationErrors.file}</p>}

                    {/* Muestra la previsualización si existe la URL */}
                    {imagePreview && (
                        <div className="image-preview-container">
                             <img 
                                 src={imagePreview} 
                                 alt="Previsualización" 
                                 style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '10px' }}
                            />
                                 {/* Mensaje de advertencia en modo edición si se seleccionó un nuevo archivo */}
                            {isEditing && file && <small style={{ color: 'orange' }}>Se reemplazará la imagen guardada al guardar.</small>}
                        </div>
                    )}
                </div>
                
                {/* Acciones del formulario */}
                <div className="form-actions">
                    <button type="submit" className="btn-registrar">
                        {isEditing ? 'Guardar Cambios' : 'Registrar'}
                    </button>
                    <button type="button" className="btn-cancelar" onClick={onCancel}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProductoForm;