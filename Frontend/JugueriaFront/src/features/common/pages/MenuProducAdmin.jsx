
import React, { useState, useEffect } from 'react'; 

import '../../../components/ProductosAdmin/ProductoForm.css'; 
import Notification from "../../../components/ProductosAdmin/Notification";
import ConfirmModal from "../../../components/ProductosAdmin/ConfirmModal";


import { 
    getAllProductos, 
    createProducto, 
    updateProducto, 
    deleteProducto,
    getAllCategorias, 
    getProductImageUrl 
} from "../../products/services/productoApi";

import ProductoForm from "../../../components/ProductosAdmin/ProductoForm"; 
import ProductAdminTable from "../../../components/ProductosAdmin/ProductAdminTable";


function MenuProducAdmin() {

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);
    const [notification, setNotification] = useState(null); 

    const [confirmModalData, setConfirmModalData] = useState(null); 
    
    const emptyProduct = { 
        nombre: '', 
        descripcion: '', 
        precio: 0, 
        stock: 0, 
        subcategoria: '',
        categoria: { idCategoria: '', nombre: '' } 
    };


  
    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 4000); 
    };
    
    const fetchProducts = async () => {
        try {
            const data = await getAllProductos(); 
            const sortedData = data.sort((a, b) => a.id - b.id); 
            
            setProducts(sortedData);
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    };
    
    const fetchCategories = async () => {
        try {
            const data = await getAllCategorias();
            setCategories(data);
        } catch (error) {
            console.error("Error al cargar categorías:", error);
        }
    };


    const handleCreateClick = () => {
        setFormData(emptyProduct);
        setIsEditing(false);
        setShowForm(true);
    };

    const handleEditClick = (product) => {
        const productForEdit = {
            ...product,
            categoria: {
                idCategoria: product.categoria.idCategoria || product.categoria.id,
                nombre: product.categoria.nombre
            }
        };
        setFormData(productForEdit);
        setIsEditing(true);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setFormData(null); 
    };
    
    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('form-modal-overlay')) {
            handleCloseForm();
        }
    };


    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape' && showForm) {
                handleCloseForm();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [showForm]); 


    
    const handleSubmit = async (dataToSend) => {
        try {
            if (isEditing) {
                await updateProducto(formData.id, dataToSend);
                showNotification("Producto actualizado con éxito.", 'success');
            } else {
                await createProducto(dataToSend);
                showNotification("Producto registrado con éxito.", 'success'); 
            }
            fetchProducts();
            handleCloseForm();
        } catch (error) {
            console.error("Error al guardar el producto:", error);
            showNotification(`Fallo al guardar producto: ${error.message || "Error desconocido."}`, 'error'); 
        }
    };

    const handleDeleteClick = (id, nombre) => {
        setConfirmModalData({ 
            id: id,
            nombre: nombre || 'este producto'
        });
    };

    const handleConfirmDelete = async () => {
        const idToDelete = confirmModalData.id;
        
        setConfirmModalData(null); 
        
        try {
            await deleteProducto(idToDelete);
            
            fetchProducts(); 
            showNotification(`Producto "${confirmModalData.nombre}" eliminado con éxito.`, 'success');
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            showNotification(`Fallo al eliminar el producto: ${error.message || "Error desconocido."}`, 'error');
        }
    };

    const handleCancelDelete = () => {
        setConfirmModalData(null);
    };

   
    const EXCEL_REPORT_URL = 'http://localhost:8080/api/productos/reporte/excel'; 

    const handleExportExcel = async () => {
        showNotification("Generando reporte Excel...", 'info');

        try {
            const response = await fetch(EXCEL_REPORT_URL, {
                method: 'GET',
            });

            if (!response.ok) {
                const errorText = await response.text(); 
                throw new Error(`Fallo en la descarga. Estado: ${response.status}. Mensaje: ${errorText.substring(0, 100)}...`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            
            a.href = url;
            a.download = 'productos_reporte_' + new Date().toISOString().slice(0, 10) + '.xlsx'; 
            
            document.body.appendChild(a);
            a.click();
            
            a.remove();
            window.URL.revokeObjectURL(url);
            
            showNotification("Reporte Excel descargado con éxito.", 'success');

        } catch (error) {
            console.error("Error al exportar a Excel:", error);
            showNotification(`Error al generar reporte: ${error.message}`, 'error');
        }
    };

    return (
        <div className="admin-container">
            <h1>Administración de Productos</h1>
            
            <button 
                className="btn-create" 
                onClick={handleCreateClick}
            >
                + Crear Nuevo Producto
            </button>

            <button 
                className="btn-excel" 
                onClick={handleExportExcel}
                style={{ marginLeft: '10px' }} 
            >
                Descargar Reporte Excel
            </button>

            <ProductAdminTable 
                products={products}
                onEdit={handleEditClick}
                onDelete={(id) => {
                    const productToDelete = products.find(p => p.id === id);
                    handleDeleteClick(id, productToDelete ? productToDelete.nombre : 'Producto');
                }}
                getImageUrl={getProductImageUrl}
            />

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
            
            {notification && (
                <Notification 
                    message={notification.message} 
                    type={notification.type} 
                />
            )}

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