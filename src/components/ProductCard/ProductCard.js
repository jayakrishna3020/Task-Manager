import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Check } from 'lucide-react';
import { CartContext } from '../../contexts/CartContext';
import './ProductCard.css';

export function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigating if wrapped in a Link or handled via clicks
    setIsAdding(true);
    
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: 1
    });

    // Animate state
    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }, 600);
  };

  // Render stars dynamically
  const renderStars = (rate = 0) => {
    const stars = [];
    const roundedRate = Math.round(rate);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          className={i <= roundedRate ? 'star-icon filled' : 'star-icon'}
        />
      );
    }
    return stars;
  };

  return (
    <div className="product-card glass-panel">
      {/* Product Image Link */}
      <Link to={`/product/${product.id}`} className="product-card-image-link">
        <div className="product-card-image-container">
          <img 
            src={product.image} 
            alt={product.title} 
            className="product-card-img" 
            loading="lazy" 
          />
          <span className="product-card-badge badge badge-primary">
            {product.category}
          </span>
        </div>
      </Link>

      {/* Product Info */}
      <div className="product-card-info">
        <span className="product-card-category">{product.category}</span>
        <Link to={`/product/${product.id}`} className="product-card-title-link">
          <h3 className="product-card-title">{product.title}</h3>
        </Link>

        {/* Rating */}
        {product.rating && (
          <div className="product-card-rating">
            <div className="stars-container">{renderStars(product.rating.rate)}</div>
            <span className="rating-count">({product.rating.count})</span>
          </div>
        )}

        {/* Footer (Price & Add Button) */}
        <div className="product-card-footer">
          <span className="product-card-price">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`btn product-card-btn ${isAdded ? 'added' : ''} ${isAdding ? 'adding' : ''}`}
            aria-label="Add to Cart"
          >
            {isAdded ? (
              <>
                <Check size={16} />
                <span>Added</span>
              </>
            ) : isAdding ? (
              <span>Adding...</span>
            ) : (
              <>
                <ShoppingCart size={16} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProductCard;
