import React, { useState, useEffect } from 'react'; 

import '../../../components/ProductosAdmin/ProductoForm.css'; 
// Componente para mostrar mensajes temporales al usuario (éxito, error, info)
import Notification from "../../../components/ProductosAdmin/Notification";
// Componente modal para confirmar acciones destructivas (ej: eliminar)
import ConfirmModal from "../../../components/ProductosAdmin/ConfirmModal";


import { 
    getAllProductos, // API: Obtener todos o filtrados
    createProducto, // API: Crear (POST)
    updateProducto, // API: Actualizar (PUT)
    deleteProducto, // API: Eliminar (DELETE)
    getAllCategorias, // API: Obtener categorías
    getProductImageUrl // Utilidad para construir la URL de la imagen
} from "../../products/services/productoApi";

import ProductoForm from "../../../components/ProductosAdmin/ProductoForm"; // Formulario para crear/editar
import ProductAdminTable from "../../../components/ProductosAdmin/ProductAdminTable"; // Tabla de visualización


function MenuProducAdmin() {

    // Estado que almacena la lista de productos para la tabla
    const [products, setProducts] = useState([]);
    // Estado que almacena la lista de categorías para el formulario
    const [categories, setCategories] = useState([]);
    // Controla la visibilidad del modal del formulario
    const [showForm, setShowForm] = useState(false);
    // Indica si el formulario está en modo edición o creación
    const [isEditing, setIsEditing] = useState(false);
    // Datos del producto que se está creando o editando
    const [formData, setFormData] = useState(null);
    // Datos para el componente Notification (mensaje y tipo)
    const [notification, setNotification] = useState(null); 

    // Datos para el componente ConfirmModal (ID y nombre a eliminar)
    const [confirmModalData, setConfirmModalData] = useState(null); 
    
    // Objeto base para resetear el formulario a un estado vacío de creación
    const emptyProduct = { 
        nombre: '', 
        descripcion: '', 
        precio: 0, 
        stock: 0, 
        subcategoria: '',
        categoria: { idCategoria: '', nombre: '' } // Categoría inicial vacía
    };


    
    // Hook que se ejecuta una sola vez al montar el componente
    useEffect(() => {
        fetchProducts(); // Carga inicial de productos
        fetchCategories(); // Carga inicial de categorías
    }, []);

    // Función para configurar y mostrar una notificación temporal
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 4000); // La notificación desaparece después de 4 segundos
    };
    
    // Función asíncrona para obtener la lista de productos del API
    const fetchProducts = async () => {
        try {
            const data = await getAllProductos(); // Llama al servicio API
            const sortedData = data.sort((a, b) => a.id - b.id); // Ordena la data por ID
            
            setProducts(sortedData);
        } catch (error) {
            console.error("Error al cargar productos:", error);
            // Aquí se podría añadir una notificación de error
        }
    };
    
    // Función asíncrona para obtener la lista de categorías del API
    const fetchCategories = async () => {
        try {
            const data = await getAllCategorias();
            setCategories(data);
        } catch (error) {
            console.error("Error al cargar categorías:", error);
        }
    };


    // Abre el formulario en modo Creación
    const handleCreateClick = () => {
        setFormData(emptyProduct); // Pone los campos en blanco
        setIsEditing(false); // Modo Creación
        setShowForm(true); // Muestra el formulario
    };

    // Abre el formulario en modo Edición
    const handleEditClick = (product) => {
        // Adapta el objeto de producto para que el formulario pueda manejarlo correctamente (manejo de IDs)
        const productForEdit = {
            ...product,
            categoria: {
                idCategoria: product.categoria.idCategoria || product.categoria.id,
                nombre: product.categoria.nombre
            }
        };
        setFormData(productForEdit);
        setIsEditing(true); // Modo Edición
        setShowForm(true);
    };

    // Cierra el formulario y limpia los datos temporales
    const handleCloseForm = () => {
        setShowForm(false);
        setFormData(null); // Limpia los datos del formulario
    };
    
    // Permite cerrar el formulario al hacer clic en el fondo oscuro (overlay)
    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('form-modal-overlay')) {
            handleCloseForm();
        }
    };


    // Hook useEffect para manejar el cierre con la tecla ESCAPE
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape' && showForm) {
                handleCloseForm();
            }
        };

        // Añade el listener al montar
        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            // Remueve el listener al desmontar o antes de re-ejecutar
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [showForm]); // Se ejecuta cada vez que showForm cambia


    // Maneja el envío final del formulario (Creación o Edición)
    const handleSubmit = async (dataToSend) => { // dataToSend es el FormData con JSON y Archivo
        try {
            if (isEditing) {
                await updateProducto(formData.id, dataToSend); // Llama a la API de actualización
                showNotification("Producto actualizado con éxito.", 'success');
            } else {
                await createProducto(dataToSend); // Llama a la API de creación
                showNotification("Producto registrado con éxito.", 'success'); 
            }
            fetchProducts(); // Recarga la lista de productos para actualizar la tabla
            handleCloseForm(); // Cierra el formulario
        } catch (error) {
            console.error("Error al guardar el producto:", error);
            showNotification(`Fallo al guardar producto: ${error.message || "Error desconocido."}`, 'error'); // Muestra notificación de error
        }
    };

    // Prepara los datos para el modal de confirmación de eliminación
    const handleDeleteClick = (id, nombre) => {
        setConfirmModalData({ 
            id: id,
            nombre: nombre || 'este producto'
        });
    };

    // Lógica final que se ejecuta al confirmar la eliminación en el modal
    const handleConfirmDelete = async () => {
        const idToDelete = confirmModalData.id;
        
        setConfirmModalData(null); // Cierra el modal de confirmación
        
        try {
            await deleteProducto(idToDelete); // Llama a la API de eliminación
            
            fetchProducts(); // Recarga la lista de productos
            showNotification(`Producto "${confirmModalData.nombre}" eliminado con éxito.`, 'success');
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            showNotification(`Fallo al eliminar el producto: ${error.message || "Error desconocido."}`, 'error');
        }
    };

    // Cierra el modal de confirmación sin ejecutar la eliminación
    const handleCancelDelete = () => {
        setConfirmModalData(null);
    };

    
    const EXCEL_REPORT_URL = 'http://localhost:8080/api/productos/reporte/excel'; // URL del endpoint de reporte

    // Maneja la descarga del reporte Excel
    const handleExportExcel = async () => {
        showNotification("Generando reporte Excel...", 'info');

        try {
            const response = await fetch(EXCEL_REPORT_URL, {
                method: 'GET', // Petición GET para descargar el archivo
            });

            if (!response.ok) {
                const errorText = await response.text(); 
                throw new Error(`Fallo en la descarga. Estado: ${response.status}. Mensaje: ${errorText.substring(0, 100)}...`);
            }

            // Convierte la respuesta binaria del backend (byte array) a un objeto Blob
            const blob = await response.blob();
            // Crea una URL temporal para el objeto Blob
            const url = window.URL.createObjectURL(blob);
            // Crea un enlace (<a>) invisible para forzar la descarga
            const a = document.createElement('a');
            
            a.href = url;
            // Define el nombre del archivo de descarga
            a.download = 'productos_reporte_' + new Date().toISOString().slice(0, 10) + '.xlsx'; 
            
            document.body.appendChild(a);
            a.click(); // Simula el clic en el enlace para iniciar la descarga
            
            a.remove();
            window.URL.revokeObjectURL(url); // Libera la URL temporal del objeto
            
            showNotification("Reporte Excel descargado con éxito.", 'success');

        } catch (error) {
            console.error("Error al exportar a Excel:", error);
            showNotification(`Error al generar reporte: ${error.message}`, 'error');
        }
    };

    return (
        <div className="admin-container">
            <h1>Administración de Productos</h1>
            
            {/* Botón para abrir el formulario de creación */}
            <button 
                className="btn-create" 
                onClick={handleCreateClick}
            >
                + Crear Nuevo Producto
            </button>

            {/* Botón para descargar el reporte Excel */}
            <button 
                className="btn-excel" 
                onClick={handleExportExcel}
                style={{ marginLeft: '10px' }} 
            >
                Descargar Reporte Excel
            </button>

            {/* Tabla de productos */}
            <ProductAdminTable 
                products={products}
                onEdit={handleEditClick}
                onDelete={(id) => {
                    // Lógica para obtener el nombre del producto antes de abrir el modal de confirmación
                    const productToDelete = products.find(p => p.id === id);
                    handleDeleteClick(id, productToDelete ? productToDelete.nombre : 'Producto');
                }}
                getImageUrl={getProductImageUrl}
            />

            {/* Renderizado condicional del formulario modal */}
            {showForm && formData && (
                <div className="form-modal-overlay" onClick={handleOverlayClick}>
                    <ProductoForm 
                        initialData={formData}
                        categories={categories}
                        onSubmit={handleSubmit}
                        onCancel={handleCloseForm} 
                        isEditing={isEditing}
                    />
                </div>
            )}
            
            {/* Renderizado condicional de la notificación */}
            {notification && (
                <Notification 
                    message={notification.message} 
                    type={notification.type} 
                />
            )}

            {/* Renderizado condicional del modal de confirmación de eliminación */}
            {confirmModalData && (
                <ConfirmModal
                    itemName={confirmModalData.nombre}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </div>
    );
}

export default MenuProducAdmin;