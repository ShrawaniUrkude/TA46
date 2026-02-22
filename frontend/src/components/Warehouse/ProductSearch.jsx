import { useState, useMemo } from 'react';
import { products, categoryColors } from '../../data/warehouse';
import './ProductSearch.css';

function ProductSearch({ onProductSelect, selectedProduct }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showResults, setShowResults] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.rack.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || 
        product.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  const categories = [...new Set(products.map(p => p.category))];

  const handleProductClick = (product) => {
    onProductSelect(product);
    setShowResults(false);
  };

  const handleSearchFocus = () => {
    setShowResults(true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onProductSelect(null);
  };

  return (
    <div className="product-search-container">
      <div className="search-header">
        <h2>🔍 Find Product</h2>
        <p>Enter product name, SKU, or rack location</p>
      </div>

      <div className="search-controls">
        <div className="search-input-wrapper">
          <span className="search-icon">🔎</span>
          <input
            type="text"
            placeholder="Search for iPhone, SKU-001, Rack A1..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleSearchFocus}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-btn" onClick={handleClearSearch}>
              ✕
            </button>
          )}
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="category-select"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Selected product display */}
      {selectedProduct && (
        <div className="selected-product-banner">
          <div className="selected-product-info">
            <span className="product-icon">📦</span>
            <div className="product-details">
              <strong>{selectedProduct.name}</strong>
              <span>
                {selectedProduct.id} • Rack {selectedProduct.rack} • Shelf {selectedProduct.shelf}
              </span>
            </div>
          </div>
          <button 
            className="navigate-btn"
            onClick={() => onProductSelect(selectedProduct)}
          >
            🧭 Navigate
          </button>
        </div>
      )}

      {/* Product results */}
      <div className={`search-results ${showResults ? 'visible' : ''}`}>
        <div className="results-header">
          <span>{filteredProducts.length} products found</span>
          {showResults && (
            <button className="close-results" onClick={() => setShowResults(false)}>
              Collapse
            </button>
          )}
        </div>

        <div className="products-grid">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className={`product-card ${selectedProduct?.id === product.id ? 'selected' : ''}`}
              onClick={() => handleProductClick(product)}
            >
              <div 
                className="product-category-tag"
                style={{ backgroundColor: categoryColors[product.category] }}
              >
                {product.category}
              </div>
              
              <div className="product-card-content">
                <h4>{product.name}</h4>
                <div className="product-meta">
                  <span className="sku">{product.id}</span>
                  <span className="location">
                    📍 Rack {product.rack} • Shelf {product.shelf}
                  </span>
                </div>
                <div className="product-stock">
                  <span className={`stock-badge ${product.quantity < 20 ? 'low' : product.quantity < 50 ? 'medium' : 'high'}`}>
                    {product.quantity} in stock
                  </span>
                </div>
              </div>

              <button className="find-btn">
                Find →
              </button>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-results">
            <span>📭</span>
            <p>No products found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductSearch;
