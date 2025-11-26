import React, { useState } from 'react';
import './Sidebar.css'; 

// Componente Sidebar (Barra Lateral) para filtros y búsqueda
const Sidebar = ({ selectedCategory, onCategoryChange, searchTerm, onSearchChange, isSidebarOpen, onClose, categories }) => {
    
    // Estado local para controlar qué categoría desplegable está abierta
    const [openCategory, setOpenCategory] = useState(null);

    // Alterna la visibilidad de las subcategorías al hacer clic en la categoría principal
    const handleToggle = (categoryName) => {
        setOpenCategory(openCategory === categoryName ? null : categoryName);
    };

    return (
        // Clase dinámica para controlar la visibilidad/animación en móvil (is-open)
        <div className={`sidebar ${isSidebarOpen ? 'is-open' : ''}`}>
            <button className="close-btn" onClick={onClose}>
                &times; {/* Símbolo de cerrar */}
            </button>

            <h3>Filtros</h3>
            <div className="search-box">
                <h3>Buscar Jugo</h3>
                {/* Input de búsqueda controlado */}
                <input
                    type="text"
                    placeholder="Ej: Jugo de naranja"
                    value={searchTerm}
                    onChange={onSearchChange} /* Llama al manejador de búsqueda del componente padre */
                />
            </div>
            <hr />
            <h3>Categorías</h3>
            <ul>
                <li key="all">
                    {/* Botón para ver todos los productos */}
                    <button
                        onClick={() => onCategoryChange('all', null)}
                        className={selectedCategory === 'all' ? 'active' : ''} /* Resaltado si está seleccionado */
                    >
                        Todos
                    </button>
                </li>
                {/* Mapeo de categorías recibidas por props */}
                {categories.map(category => ( 
                    <li key={category.name}>
                        {/* Renderizado condicional si la categoría tiene subcategorías */}
                        {category.subcategories.length > 0 ? (
                            <>
                                {/* Botón principal para expandir/contraer las subcategorías */}
                                <button
                                    onClick={() => handleToggle(category.name)} /* Alterna el estado local de openCategory */
                                    className={selectedCategory.startsWith(category.name) ? 'active' : ''} /* Activo si la categoría o subcategoría está seleccionada */
                                >
                                    {category.name}
                                </button>
                                {/* Renderiza las subcategorías si están abiertas */}
                                {openCategory === category.name && category.subcategories.length > 0 && (
                                    <ul className="subcategories">
                                        {category.subcategories.map(sub => (
                                            <li key={sub}>
                                                {/* Botón para seleccionar la subcategoría */}
                                                <button
                                                    onClick={() => {
                                                        onCategoryChange(category.name, sub); /* Llama al manejador del padre con categoría y subcategoría */
                                                        onClose(); /* Cierra el sidebar después de seleccionar (en móvil) */
                                                    }}
                                                    className={selectedCategory === `${category.name}-${sub}` ? 'active' : ''}
                                                >
                                                    {sub}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        ) : (
                            /* Botón simple para categorías sin subcategorías */
                            <button
                                onClick={() => onCategoryChange(category.name, null)}
                                className={selectedCategory === category.name ? 'active' : ''}
                            >
                                {category.name}
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;