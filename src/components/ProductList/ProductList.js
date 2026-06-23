import React, { useState } from 'react';
import { SlidersHorizontal, RotateCcw, Search, Grid, Star, X } from 'lucide-react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductList.css';

export function ProductList({ hookData }) {
  const {
    loading,
    error,
    filteredProducts,
    categories,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    ratingFilter,
    setRatingFilter,
    maxProductPrice,
    resetFilters
  } = hookData;

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Handle max price slider
  const handlePriceChange = (e) => {
    const val = parseFloat(e.target.value);
    setPriceRange([priceRange[0], val]);
  };

  // Render Skeletons for Loading State
  const renderSkeletons = () => {
    return Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="product-skeleton-card glass-panel">
        <div className="skeleton skeleton-img"></div>
        <div className="skeleton-info">
          <div className="skeleton skeleton-category"></div>
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-title short"></div>
          <div className="skeleton skeleton-rating"></div>
          <div className="skeleton-footer">
            <div className="skeleton skeleton-price"></div>
            <div className="skeleton skeleton-btn"></div>
          </div>
        </div>
      </div>
    ));
  };

  // Check if any filter is active
  const isFilterActive = selectedCategory || priceRange[1] < maxProductPrice || ratingFilter > 0;

  if (error) {
    return (
      <div className="error-panel glass-panel">
        <p className="error-message">Oops! {error}</p>
        <button onClick={resetFilters} className="btn btn-primary">
          <RotateCcw size={16} />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  return (
    <div className="product-list-section">
      {/* Catalog Top Toolbar */}
      <div className="catalog-toolbar glass-panel">
        <div className="toolbar-info">
          <span className="products-count">
            {loading ? 'Searching...' : `Showing ${filteredProducts.length} Products`}
          </span>
        </div>

        <div className="toolbar-controls">
          {/* Sorting */}
          <div className="sort-control">
            <label htmlFor="sort-select" className="sort-label">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Customer Rating</option>
            </select>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="btn btn-secondary mobile-filter-trigger"
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="catalog-layout">
        {/* Sidebar Filters (Desktop) */}
        <aside className={`filters-sidebar glass-panel ${mobileSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="close-sidebar-btn"
              aria-label="Close filters"
            >
              <X size={20} />
            </button>
          </div>

          <div className="sidebar-content">
            {/* Category Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Categories</h4>
              <div className="category-filters-list">
                <button
                  onClick={() => { setSelectedCategory(''); setMobileSidebarOpen(false); }}
                  className={`category-filter-btn ${selectedCategory === '' ? 'active' : ''}`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setMobileSidebarOpen(false); }}
                    className={`category-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Max Price</h4>
              <div className="price-slider-container">
                <input
                  type="range"
                  min="0"
                  max={maxProductPrice}
                  value={priceRange[1]}
                  onChange={handlePriceChange}
                  className="price-slider-input"
                />
                <div className="price-labels">
                  <span>$0</span>
                  <span className="price-current">${priceRange[1].toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Minimum Rating</h4>
              <div className="rating-filters-list">
                {[4, 3, 2].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setRatingFilter(ratingFilter === stars ? 0 : stars)}
                    className={`rating-filter-btn ${ratingFilter === stars ? 'active' : ''}`}
                  >
                    <div className="rating-stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < stars ? 'star-icon filled' : 'star-icon'}
                        />
                      ))}
                    </div>
                    <span className="rating-text">& Up</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters Button */}
            {isFilterActive && (
              <button onClick={resetFilters} className="btn btn-secondary clear-filters-btn">
                <RotateCcw size={16} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="products-grid-container">
          {loading ? (
            <div className="products-grid">{renderSkeletons()}</div>
          ) : filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-catalog-panel glass-panel">
              <Search size={48} className="empty-icon" />
              <h3>No products found</h3>
              <p>We couldn't find any products matching your current filters.</p>
              <button onClick={resetFilters} className="btn btn-primary">
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
export default ProductList;
