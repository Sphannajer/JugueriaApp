import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ selectedCategory, onCategoryChange, searchTerm, onSearchChange, isSidebarOpen, onClose }) => {
  const categories = [
    { name: 'Jugos Clasicos', subcategories: ['Con azúcar', 'Con Stevia'] },
    { name: 'Jugos Especiales', subcategories: ['Con azúcar', 'Con Stevia'] },
    { name: 'Extractos', subcategories: ['Con azúcar', 'Con Stevia'] },
    { name: 'Desayunos', subcategories: [] },
    { name: 'Kekes', subcategories: ['Con azúcar', 'Con Stevia'] },
  ];

  const [openCategory, setOpenCategory] = useState(null);

  const handleToggle = (categoryName) => {
    setOpenCategory(openCategory === categoryName ? null : categoryName);
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? 'is-open' : ''}`}>
      <button className="close-btn" onClick={onClose}>
        &times;
      </button>

      <h3>Filtros</h3>
      <div className="search-box">
        <h3>Buscar Jugo</h3>
        <input
          type="text"
          placeholder="Ej: Jugo de naranja"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      <hr />
      <h3>Categorías</h3>
      <ul>
        <li key="all">
          <button
            onClick={() => onCategoryChange('all', null)}
            className={selectedCategory === 'all' ? 'active' : ''}
          >
            Todos
          </button>
        </li>
        {categories.map(category => (
          <li key={category.name}>
            {category.subcategories.length > 0 ? (
              <button
                onClick={() => handleToggle(category.name)}
                className={selectedCategory.startsWith(category.name) ? 'active' : ''}
              >
                {category.name}
              </button>
            ) : (
              <button
                onClick={() => onCategoryChange(category.name, null)}
                className={selectedCategory === category.name ? 'active' : ''}
              >
                {category.name}
              </button>
            )}

            {openCategory === category.name && category.subcategories.length > 0 && (
              <ul className="subcategories">
                {category.subcategories.map(sub => (
                  <li key={sub}>
                    <button
                      onClick={() => {
                        onCategoryChange(category.name, sub);
                        onClose(); 
                      }}
                      className={selectedCategory === `${category.name}-${sub}` ? 'active' : ''}
                    >
                      {sub}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;