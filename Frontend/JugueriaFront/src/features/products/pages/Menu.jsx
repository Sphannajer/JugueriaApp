import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../../../components/Cart/Sidebar";
import ProductGrid from "../../../components/Cart/ProductGrid";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "../../../styles/Menu.css";

// Importa las funciones de la capa de servicio para interactuar con el Backend
import { getAllProductos, getAllCategorias } from "../../products/services/productoApi";

function Menu() {
    
    // Estado para almacenar todos los productos originales cargados del API
    const [products, setProducts] = useState([]); 
    // Estado para almacenar las categorías del API (incluyendo la lógica de subcategorías)
    const [apiCategories, setApiCategories] = useState([]);
    // Estado de control de carga
    const [loading, setLoading] = useState(true);
    // Estado para manejar errores de la API
    const [error, setError] = useState(null);

    // Estado para el término de búsqueda ingresado por el usuario
    const [searchTerm, setSearchTerm] = useState("");
    // Estado para la categoría/subcategoría seleccionada ("all" por defecto)
    const [selectedCategory, setSelectedCategory] = useState("all"); 
    // Estado que contiene la lista de productos actualmente mostrada (después de filtrar/buscar)
    const [filteredProducts, setFilteredProducts] = useState([]); 
    
    // Estados para controlar la visibilidad de la barra lateral y los menús móviles
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [openMobileCategory, setOpenMobileCategory] = useState(null); 

    // Función para llamar al API de productos, envuelta en useCallback para memorización
    const fetchProducts = useCallback(async (category = null, subcategory = null) => {
        if (category || subcategory) {
            setLoading(true); // Muestra el loading solo en filtros posteriores
        }
        setError(null);
        
        try {
            // Llama a la API para obtener productos (usa la URL de filtro si se pasan argumentos)
            const productsData = await getAllProductos(category, subcategory);
            
            // Almacena la lista completa solo la primera vez (cuando no hay filtros iniciales)
            if (!category && !subcategory && productsData.length > 0) {
                setProducts(productsData); // Guarda la lista base para el filtrado local por búsqueda
            }
            
            // La lista a mostrar siempre es la respuesta del API (filtrada o completa)
            setFilteredProducts(productsData);

        } catch (e) {
            console.error("Error al cargar productos:", e);
            setError("No se pudieron cargar los productos. Verifica el API y los endpoints.");
        } finally {
            setLoading(false);
        }
    }, []); // Dependencia vacía para que useCallback solo se ejecute una vez

    // Hook useEffect para cargar datos iniciales (categorías y productos)
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // 1. Cargar categorías
                const categoriesData = await getAllCategorias();
                // 2. Transformar categorías (añadir subcategorías de forma manual/local)
                const transformedCategories = categoriesData.map(cat => ({
                    name: cat.nombre,
                    subcategories:
                        cat.nombre.includes('Jugos') || cat.nombre.includes('Extractos') || cat.nombre.includes('Kekes')
                        ? ["Con azúcar", "Con Stevia"] // Lógica local para subcategorías
                        : []
                }));
                setApiCategories(transformedCategories);
            } catch (e) {
                console.error("Error al cargar categorías:", e);
                setError("No se pudieron cargar las categorías.");
            } 
            
            // 3. Cargar productos iniciales
            fetchProducts();
        };

        fetchInitialData();
        
    }, [fetchProducts]); // Se vuelve a ejecutar si fetchProducts cambia (solo en desarrollo)

    // Hook useEffect para manejar el filtrado y la búsqueda (se ejecuta al cambiar categoría o término de búsqueda)
    useEffect(() => {
        // Evita ejecutar la lógica si aún está cargando o no hay productos cargados
        if (loading && products.length === 0 && selectedCategory === "all" && searchTerm === "") return; 
        
        if (searchTerm) {
            // Lógica de búsqueda (filtrado local en el array 'products' base)
            let newFiltered = products.filter((product) =>
                product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProducts(newFiltered);
            return;
        } 
        
        if (selectedCategory !== "all") {
            // Lógica de filtrado por categoría/subcategoría
            
            let categoryToFilter = selectedCategory;
            let subcategoryToFilter = null;

            // Detecta si la selección incluye subcategoría (ej: "Jugos-Con Stevia")
            if (selectedCategory.includes("-")) {
                const parts = selectedCategory.split("-");
                categoryToFilter = parts[0];
                subcategoryToFilter = parts[1].trim(); 
            } 

            // Llama a la función que pide los datos filtrados al API de Spring
            fetchProducts(categoryToFilter, subcategoryToFilter);           
        }
        
    }, [selectedCategory, searchTerm, fetchProducts, loading, products.length]); 

    // Función para manejar el despliegue del menú de categorías en móvil
    const handleMobileCategoryToggle = (categoryName) => {
        setOpenMobileCategory(openMobileCategory === categoryName ? null : categoryName);
    };

    // Función principal para cambiar la categoría o subcategoría seleccionada
    const handleCategoryChange = (category, subcategory) => {
        setSearchTerm(""); // Limpia la búsqueda al cambiar de categoría
        
        if (subcategory) {
            // Almacena la categoría y subcategoría combinadas
            setSelectedCategory(`${category}-${subcategory}`);
        } else {
            setSelectedCategory(category);
        }

        // Cierra los menús móviles después de la selección
        setIsSidebarOpen(false); 
        setIsCategoriesOpen(false); 
    };

    // Función para manejar los cambios en la barra de búsqueda
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setSelectedCategory("all"); // Desselecciona la categoría al buscar
    };
    
    // Renderizado condicional mientras se cargan los datos iniciales
    if (loading && products.length === 0) {
        return <p className="loading-message">Cargando menú y categorías...</p>;
    }

    // Renderizado condicional de mensaje de error
    if (error) {
        return <p className="error-message" style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
    }


    return (
        <>
            <Header />

            <main className="main-content">
                <div className="hero-section">
                    <h2>Descubre Nuestros Sabores</h2>
                    <p>Refresca tu día, nutre tu vida.</p>
                </div>
                
                {/* Controles móviles */}
                <div className="mobile-controls">
                    <button
                        className="category-btn"
                        onClick={() => { 
                            // Alterna la visibilidad del menú de categorías móvil
                            setIsCategoriesOpen(!isCategoriesOpen); 
                            setIsSidebarOpen(false); // Asegura que la barra lateral esté cerrada
                        }}
                    >
                        Categorías <span className="arrow">▼</span>
                    </button>
                    <div className="search-bar-container">
                        <input
                            type="text"
                            placeholder="Buscar"
                            value={searchTerm}
                            onChange={handleSearchChange} // Llama a la función de manejo de búsqueda
                        />
                    </div>
                    <button
                        className="filter-btn"
                        onClick={() => {
                            // Alterna la visibilidad de la barra lateral (filtros/carrito)
                            setIsSidebarOpen(!isSidebarOpen);
                            setIsCategoriesOpen(false); 
                        }}
                    >
                        Filtros 
                    </button>
                </div>

                {/* Renderizado del menú de categorías móvil */}
                {isCategoriesOpen && (
                    <div className="mobile-category-menu">
                        <ul>
                            <li key="all">
                                <button
                                    onClick={() => handleCategoryChange("all", null)}
                                    className={selectedCategory === "all" ? "active" : ""}
                                >
                                    Todos
                                </button>
                            </li>
                            {apiCategories.map((category) => (
                                <li key={category.name}>
                                    {/* Lógica de renderizado condicional para categorías con/sin subcategorías */}
                                    {category.subcategories.length > 0 ? (
                                        <>
                                            <button
                                                onClick={() =>
                                                    handleMobileCategoryToggle(category.name)
                                                }
                                                className={
                                                    selectedCategory.startsWith(category.name)
                                                            ? "active"
                                                            : ""
                                                }
                                            >
                                                {category.name}{" "}
                                                <span className="arrow">
                                                    {openMobileCategory === category.name ? "▲" : "▼"}
                                                </span>
                                            </button>
                                            {/* Muestra las subcategorías si la categoría está abierta en móvil */}
                                            {openMobileCategory === category.name && (
                                                <ul className="subcategories">
                                                    {category.subcategories.map((sub) => (
                                                        <li key={sub}>
                                                            <button
                                                                onClick={() =>
                                                                    handleCategoryChange(category.name, sub)
                                                                }
                                                                className={
                                                                    selectedCategory === `${category.name}-${sub}`
                                                                            ? "active"
                                                                            : ""
                                                                }
                                                            >
                                                                {sub}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </>
                                    ) : (
                                        // Botón para categorías sin subcategorías
                                        <button
                                            onClick={() => handleCategoryChange(category.name, null)}
                                            className={
                                                selectedCategory === category.name ? "active" : ""
                                            }
                                        >
                                            {category.name}
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="product-layout">
                    {/* Renderiza la barra lateral (filtros / carrito) */}
                    <Sidebar
                        selectedCategory={selectedCategory}
                        onSearchChange={handleSearchChange}
                        onCategoryChange={handleCategoryChange}
                        searchTerm={searchTerm}
                        isSidebarOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                        categories={apiCategories}
                    />
                    {/* Renderiza la cuadrícula de productos, pasando los productos filtrados */}
                    <ProductGrid products={filteredProducts} />
                </div>
                
                {/* Overlay para cerrar la barra lateral o el menú móvil */}
                {(isSidebarOpen || isCategoriesOpen) && (
                    <div
                        className="overlay"
                        onClick={() => {
                            setIsSidebarOpen(false);
                            setIsCategoriesOpen(false);
                        }}
                    ></div>
                )}
            </main>
            <Footer />
        </>
    );
}

export default Menu;