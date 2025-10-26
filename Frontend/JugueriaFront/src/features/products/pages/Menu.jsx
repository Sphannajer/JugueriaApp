import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../../../components/Cart/Sidebar";
import ProductGrid from "../../../components/Cart/ProductGrid";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "../../../styles/Menu.css";

import { getAllProductos, getAllCategorias } from "../../products/services/productoApi";

function Menu() {
    
    const [products, setProducts] = useState([]); 
    const [apiCategories, setApiCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all"); 
    const [filteredProducts, setFilteredProducts] = useState([]); 
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [openMobileCategory, setOpenMobileCategory] = useState(null); 

    const fetchProducts = useCallback(async (category = null, subcategory = null) => {
        if (category || subcategory) {
            setLoading(true);
        }
        setError(null);
        
        try {
            const productsData = await getAllProductos(category, subcategory);
            
            if (!category && !subcategory && productsData.length > 0) {
                setProducts(productsData); 
            }
            
            setFilteredProducts(productsData);

        } catch (e) {
            console.error("Error al cargar productos:", e);
            setError("No se pudieron cargar los productos. Verifica el API y los endpoints.");
        } finally {
            setLoading(false);
        }
    }, []); 

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const categoriesData = await getAllCategorias();
                const transformedCategories = categoriesData.map(cat => ({
                    name: cat.nombre,
                    subcategories:
                        cat.nombre.includes('Jugos') || cat.nombre.includes('Extractos') || cat.nombre.includes('Kekes')
                        ? ["Con azúcar", "Con Stevia"]
                        : []
                }));
                setApiCategories(transformedCategories);
            } catch (e) {
                console.error("Error al cargar categorías:", e);
                setError("No se pudieron cargar las categorías.");
            } 
            
            fetchProducts();
        };

        fetchInitialData();
        
    }, [fetchProducts]); 

    useEffect(() => {
        if (loading && products.length === 0 && selectedCategory === "all" && searchTerm === "") return; 
        
        if (searchTerm) {
            let newFiltered = products.filter((product) =>
                product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProducts(newFiltered);
            return;
        } 
        
        if (selectedCategory !== "all") {
            
            let categoryToFilter = selectedCategory;
            let subcategoryToFilter = null;

            if (selectedCategory.includes("-")) {
                const parts = selectedCategory.split("-");
                categoryToFilter = parts[0];
                subcategoryToFilter = parts[1].trim(); 
            } 

            fetchProducts(categoryToFilter, subcategoryToFilter);
            
        } else {
            fetchProducts(null, null);
        }
        
    }, [selectedCategory, searchTerm, fetchProducts, products, loading]); 

    const handleMobileCategoryToggle = (categoryName) => {
        setOpenMobileCategory(openMobileCategory === categoryName ? null : categoryName);
    };

    const handleCategoryChange = (category, subcategory) => {
        setSearchTerm(""); 
        
        if (subcategory) {
            setSelectedCategory(`${category}-${subcategory}`);
        } else {
            setSelectedCategory(category);
        }

        setIsSidebarOpen(false); 
        setIsCategoriesOpen(false); 
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setSelectedCategory("all"); 
    };
    
    if (loading && products.length === 0) {
        return <p className="loading-message">Cargando menú y categorías...</p>;
    }

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
                
                <div className="mobile-controls">
                    <button
                        className="category-btn"
                        onClick={() => { 
                            setIsCategoriesOpen(!isCategoriesOpen); 
                            setIsSidebarOpen(false);
                        }}
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
                        onClick={() => {
                            setIsSidebarOpen(!isSidebarOpen);
                            setIsCategoriesOpen(false); 
                        }}
                    >
                        Filtros 
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
                            {apiCategories.map((category) => (
                                <li key={category.name}>
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
                    <Sidebar
                        selectedCategory={selectedCategory}
                        onSearchChange={handleSearchChange}
                        onCategoryChange={handleCategoryChange}
                        searchTerm={searchTerm}
                        isSidebarOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                        categories={apiCategories}
                    />
                    <ProductGrid products={filteredProducts} />
                </div>
                
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