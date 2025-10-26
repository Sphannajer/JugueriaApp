import React, { useState, useEffect } from 'react';
import { getProductImageUrl } from '../../features/products/services/productoApi';

const VALID_CHARS_REGEX = /^[a-zA-Z0-9\s.,()ñÑáéíóúÁÉÍÓÚ-]+$/;

function ProductoForm({ initialData, categories, onSubmit, onCancel, isEditing }) {
    
    const [formData, setFormData] = useState(initialData);
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(initialData.urlImagen ? getProductImageUrl(initialData.urlImagen) : null);
    
    const [validationErrors, setValidationErrors] = useState({});
    const [generalError, setGeneralError] = useState(null);

    useEffect(() => {
        setFormData(initialData);
        setImagePreview(initialData.urlImagen ? getProductImageUrl(initialData.urlImagen) : null);
        setFile(null);
        setValidationErrors({});
        setGeneralError(null);
    }, [initialData]);

    const handleFocus = (e) => {
        const { name, value } = e.target;
        if (!isEditing && (value === '0' || value === 0)) {
            setFormData(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        let newValue = value;
        if (name === 'precio') {
            newValue = parseFloat(value) || 0;
        } else if (name === 'stock') {
            newValue = parseInt(value) || 0;
        }

        setFormData(prev => {
            if (name === 'categoriaId') {
                return { ...prev, categoria: { idCategoria: parseInt(newValue) } };
            }
            return { ...prev, [name]: newValue };
        });
        
        setValidationErrors(prev => ({ ...prev, [name]: undefined }));
        setGeneralError(null);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            setImagePreview(URL.createObjectURL(selectedFile));
        } else {
            setImagePreview(initialData.urlImagen ? getProductImageUrl(initialData.urlImagen) : null);
        }
        setValidationErrors(prev => ({ ...prev, file: undefined }));
        setGeneralError(null);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        
        let errors = {};
        let isValid = true;
        const invalidCharMessage = "Solo se permiten letras, números, espacios, tildes (áéíóú) y los símbolos ., - ()";

        if (!formData.nombre) { errors.nombre = "El Nombre es obligatorio."; isValid = false; }
        if (!formData.descripcion) { errors.descripcion = "La Descripción es obligatoria."; isValid = false; }
        if (formData.precio <= 0) { errors.precio = "El Precio debe ser mayor a 0."; isValid = false; }
        if (formData.stock < 0) { errors.stock = "El Stock no puede ser negativo."; isValid = false; }
        if (!formData.categoria.idCategoria) { errors.categoriaId = "Debe seleccionar una Categoría."; isValid = false; }
        if (!formData.subcategoria) { errors.subcategoria = "Debe seleccionar el Tipo de Producto (Subcategoría)."; isValid = false; }

        if (formData.nombre && !VALID_CHARS_REGEX.test(formData.nombre)) {
            errors.nombre = invalidCharMessage;
            isValid = false;
        }
        
        if (formData.descripcion && !VALID_CHARS_REGEX.test(formData.descripcion)) {
            errors.descripcion = invalidCharMessage;
            isValid = false;
        }

        if (!isEditing && !file) {
             errors.file = "Debe seleccionar una imagen para el nuevo producto.";
             isValid = false;
        }

        if (!isValid) {
            setValidationErrors(errors);
            setGeneralError("Por favor, corrige los errores en el formulario para continuar.");
            document.querySelector('.registro-card').scrollTop = 0;
            return;
        }
        
        const dataToSend = new FormData();
        const productJSON = { ...formData };
        
        if (!isEditing) {
            delete productJSON.id;
            delete productJSON.urlImagen;
        }
        
        dataToSend.append('producto', JSON.stringify(productJSON));

        if (file) {
            dataToSend.append('file', file);
        }
        
        onSubmit(dataToSend);
    };

    return (
        <div className="registro-card">
            <h3>{isEditing ? 'Modificar Producto' : 'Registro de Nuevo Producto'}</h3>
            <form onSubmit={handleSubmit} className="product-form-style">
                
                {generalError && <p className="general-error-message">{generalError}</p>}
                
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

                <div className="input-group">
                    <label htmlFor="precio">Precio (S/)</label>
                    <input 
                        type="number" 
                        id="precio" 
                        name="precio" 
                        value={formData.precio === 0 && !isEditing ? '' : formData.precio} 
                        onChange={handleChange} 
                        onFocus={handleFocus}
                        step="0.01" 
                        min="0"
                        required 
                    />
                    {validationErrors.precio && <p className="error-message">{validationErrors.precio}</p>}
                </div>

                <div className="input-group">
                    <label htmlFor="stock">Stock</label>
                    <input 
                        type="number" 
                        id="stock" 
                        name="stock" 
                        value={formData.stock === 0 && !isEditing ? '' : formData.stock} 
                        onChange={handleChange} 
                        onFocus={handleFocus}
                        min="0"
                        required 
                    />
                    {validationErrors.stock && <p className="error-message">{validationErrors.stock}</p>}
                </div>
                
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

                <div className="input-group">
                    <label htmlFor="categoriaId">Categoría</label>
                    <select 
                        id="categoriaId" 
                        name="categoriaId" 
                        value={formData.categoria.idCategoria || ''} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">Seleccione una categoría</option>
                        {categories.map(cat => (
                            <option key={cat.idCategoria || cat.id} value={cat.idCategoria || cat.id}>{cat.nombre}</option>
                        ))}
                    </select>
                    {validationErrors.categoriaId && <p className="error-message">{validationErrors.categoriaId}</p>}
                </div>

                <div className="input-group">
                    <label htmlFor="file">Seleccionar Imagen</label>
                    <input 
                        type="file" 
                        id="file" 
                        name="file" 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        required={!isEditing && !initialData.urlImagen} 
                    />
                    {validationErrors.file && <p className="error-message">{validationErrors.file}</p>}

                    {imagePreview && (
                        <div className="image-preview-container">
                             <img 
                                src={imagePreview} 
                                alt="Previsualización" 
                                style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '10px' }}
                            />
                            {isEditing && file && <small style={{ color: 'orange' }}>Se reemplazará la imagen guardada al guardar.</small>}
                        </div>
                    )}
                </div>
                
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