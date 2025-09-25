import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';
import Header from '../components/Header';
import '../styles/Menu.css';
import { products as initialProducts } from '../model/productsData';

function Menu() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [openMobileCategory, setOpenMobileCategory] = useState(null);

  const categories = [
    { name: 'Jugos Clasicos', subcategories: ['Con azúcar', 'Con Stevia'] },
    { name: 'Jugos Especiales', subcategories: ['Con azúcar', 'Con Stevia'] },
    { name: 'Extractos', subcategories: ['Con azúcar', 'Con Stevia'] },
    { name: 'Desayunos', subcategories: [] },
    { name: 'Kekes', subcategories: ['Con azúcar', 'Con Stevia'] },
  ];

  const handleCategoryChange = (category, subcategory) => {
    setSearchTerm('');
    if (category === 'all') {
      setSelectedCategory('all');
    } else if (category && !subcategory) {
      setSelectedCategory(category);
    } else if (category && subcategory) {
      setSelectedCategory(`${category}-${subcategory}`);
    }
    setIsSidebarOpen(false);
    setIsCategoriesOpen(false);
  };

  const handleMobileCategoryToggle = (categoryName) => {
    setOpenMobileCategory(openMobileCategory === categoryName ? null : categoryName);
  };

  useEffect(() => {
    let newFilteredProducts = initialProducts;

    if (searchTerm) {
      newFilteredProducts = newFilteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (selectedCategory !== 'all') {
      if (selectedCategory.includes('-')) {
        const [category, subcategory] = selectedCategory.split('-');
        newFilteredProducts = newFilteredProducts.filter(
          product => product.category === category && product.subcategory === subcategory
        );
      } else {
        newFilteredProducts = newFilteredProducts.filter(
          product => product.category === selectedCategory
        );
      }
    }

    setFilteredProducts(newFilteredProducts);
  }, [searchTerm, selectedCategory]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setSelectedCategory('all');
  };

  return (
    <>
      <Header /> 
      <main className="main-content">
        <div className="hero-section">
          <h2>Descubre Nuestros Sabores</h2>
          <p>Refresca tu día, nutre tu vida.</p>
        </div>
        <div className="mobile-controls">
          <button className="category-btn" onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}>
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
          <button className="filter-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <img src="/images/filter.svg" alt="Filtros" />
          </button>
        </div>

        {isCategoriesOpen && (
          <div className="mobile-category-menu">
            <ul>
              <li key="all">
                <button
                  onClick={() => handleCategoryChange('all', null)}
                  className={selectedCategory === 'all' ? 'active' : ''}
                >
                  Todos
                </button>
              </li>
              {categories.map(category => (
                <li key={category.name}>
                  {category.subcategories.length > 0 ? (
                    <>
                      <button
                        onClick={() => handleMobileCategoryToggle(category.name)}
                        className={selectedCategory.startsWith(category.name) ? 'active' : ''}
                      >
                        {category.name} <span className="arrow">{openMobileCategory === category.name ? '▲' : '▼'}</span>
                      </button>
                      {openMobileCategory === category.name && (
                        <ul className="subcategories">
                          {category.subcategories.map(sub => (
                            <li key={sub}>
                              <button
                                onClick={() => handleCategoryChange(category.name, sub)}
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
                    <button
                      onClick={() => handleCategoryChange(category.name, null)}
                      className={selectedCategory === category.name ? 'active' : ''}
                    >
                      {category.name}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {(isSidebarOpen || isCategoriesOpen) && <div className="overlay" onClick={() => {
          setIsSidebarOpen(false);
          setIsCategoriesOpen(false);
        }}></div>}

        <div className="product-layout">
          <Sidebar
            selectedCategory={selectedCategory}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
            searchTerm={searchTerm}
            isSidebarOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
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