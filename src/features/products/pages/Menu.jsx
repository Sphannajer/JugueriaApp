import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Cart/Sidebar";
import ProductGrid from "../../../components/Cart/ProductGrid";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "../../../styles/Menu.css";

function Menu() {
    
    // ESTADOS PARA DATOS CARGADOS DE LA API
    const [products, setProducts] = useState([]);
    const [apiCategories, setApiCategories] = useState([]); // <-- NUEVO ESTADO DINÁMICO
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ESTADOS PARA LÓGICA DE UI Y FILTRADO
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [filteredProducts, setFilteredProducts] = useState([]); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [openMobileCategory, setOpenMobileCategory] = useState(null);

    // **********************************************************
    // 1. useEffect: CARGAR DATOS de la API (Productos y Categorías)
    // **********************************************************
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch de PRODUCTOS
                const productsPromise = fetch("http://localhost:8080/api/productos");
                // Fetch de CATEGORÍAS
                const categoriesPromise = fetch("http://localhost:8080/api/categorias");

                const [productsResponse, categoriesResponse] = await Promise.all([
                    productsPromise,
                    categoriesPromise
                ]);

                if (!productsResponse.ok) {
                    throw new Error(`Error al cargar productos: ${productsResponse.status}`);
                }
                if (!categoriesResponse.ok) {
                    throw new Error(`Error al cargar categorías: ${categoriesResponse.status}`);
                }

                const productsData = await productsResponse.json();
                const categoriesData = await categoriesResponse.json();

                // 2. Transformar la respuesta de Categorías
                // La API devuelve solo el nombre. Agregamos las subcategorías estáticas aquí.
                const transformedCategories = categoriesData.map(cat => ({
                    name: cat.nombre,
                    // Lógica para asignar subcategorías (asumiendo que Jugos, Extractos y Kekes las tienen)
                    subcategories: 
                        cat.nombre.includes('Jugos') || cat.nombre.includes('Extractos') || cat.nombre.includes('Kekes') 
                        ? ["Con azúcar", "Con Stevia"] 
                        : []
                }));

                setProducts(productsData);
                setFilteredProducts(productsData);
                setApiCategories(transformedCategories); // <-- Establecer categorías dinámicas
                
            } catch (e) {
                console.error("Error al cargar los datos:", e);
                setError("No se pudieron cargar los datos. Verifica tu backend.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []); // Array de dependencia vacío: se ejecuta solo al montar

    // **********************************************************
    // 2. useEffect: Lógica de FILTRADO (Depende de products y selectedCategory)
    // **********************************************************
    useEffect(() => {
        let newFilteredProducts = products; // Usa los datos cargados de la API

        if (searchTerm) {
            newFilteredProducts = newFilteredProducts.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } else if (selectedCategory !== "all") {
            if (selectedCategory.includes("-")) {
                const [category, subcategory] = selectedCategory.split("-");
                
                // IMPORTANTE: Asegúrate de que el campo 'category' y 'subcategory'
                // en tus DTOs (ProductoResponseDTO) coincidan con los nombres de la API.
                newFilteredProducts = newFilteredProducts.filter(
                    (product) =>
                        product.category === category && product.subcategory === subcategory
                );
            } else {
                newFilteredProducts = newFilteredProducts.filter(
                    (product) => product.category === selectedCategory
                );
            }
        }

        setFilteredProducts(newFilteredProducts);
    }, [searchTerm, selectedCategory, products]); // Depende de 'products' para re-filtrar tras la carga inicial

    // **********************************************************
    // 3. Handlers
    // **********************************************************

    const handleCategoryChange = (category, subcategory) => {
        setSearchTerm("");
        if (category === "all") {
            setSelectedCategory("all");
        } else if (category && !subcategory) {
            setSelectedCategory(category);
        } else if (category && subcategory) {
            setSelectedCategory(`${category}-${subcategory}`);
        }
        setIsSidebarOpen(false);
        setIsCategoriesOpen(false);
    };

    const handleMobileCategoryToggle = (categoryName) => {
        setOpenMobileCategory(
            openMobileCategory === categoryName ? null : categoryName
        );
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setSelectedCategory("all");
    };
    
    // RENDERIZADO CONDICIONAL
    if (loading) {
        return <p className="loading-message">Cargando menú y categorías...</p>;
    }

    if (error) {
        return <p className="error-message" style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
    }


    // RENDERIZADO PRINCIPAL
    return (
        <>
            <Header />
            <main className="main-content">
                <div className="hero-section">
                    <h2>Descubre Nuestros Sabores</h2>
                    <p>Refresca tu día, nutre tu vida.</p>
                </div>
                <div className="mobile-controls">
                    <button
                        className="category-btn"
                        onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    >
                        Categorías <span className="arrow">▼</span>
                    </button>
                    <div className="search-bar-container">
                        <input
                            type="text"
                            placeholder="Buscar"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <button
                        className="filter-btn"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <img src="/images/filter.svg" alt="Filtros" />
                    </button>
                </div>

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
                            {apiCategories.map((category) => ( // <-- USA CATEGORÍAS DINÁMICAS
                                <li key={category.name}>
                                    {category.subcategories.length > 0 ? (
                                        <>
                                            <button
                                                onClick={() => handleMobileCategoryToggle(category.name)}
                                                className={selectedCategory.startsWith(category.name) ? "active" : ""}
                                            >
                                                {category.name}{" "}
                                                <span className="arrow">
                                                    {openMobileCategory === category.name ? "▲" : "▼"}
                                                </span>
                                            </button>
                                            {openMobileCategory === category.name && (
                                                <ul className="subcategories">
                                                    {category.subcategories.map((sub) => (
                                                        <li key={sub}>
                                                            <button
                                                                onClick={() => handleCategoryChange(category.name, sub)}
                                                                className={selectedCategory === `${category.name}-${sub}` ? "active" : ""}
                                                            >
                                                                {sub}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleCategoryChange(category.name, null)}
                                            className={selectedCategory === category.name ? "active" : ""}
                                        >
                                            {category.name}
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {(isSidebarOpen || isCategoriesOpen) && (
                    <div
                        className="overlay"
                        onClick={() => {
                            setIsSidebarOpen(false);
                            setIsCategoriesOpen(false);
                        }}
                    ></div>
                )}

                <div className="product-layout">
                    <Sidebar
                        selectedCategory={selectedCategory}
                        onSearchChange={handleSearchChange}
                        onCategoryChange={handleCategoryChange}
                        searchTerm={searchTerm}
                        isSidebarOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                        categories={apiCategories} // <-- PASAMOS CATEGORÍAS DINÁMICAS
                    />
                    <section className="product-grid">
                        <ProductGrid products={filteredProducts} />
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default Menu;