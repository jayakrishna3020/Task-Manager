import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Check, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { CartContext } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard/ProductCard';
import './ProductDetail.css';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Fetch product detail and related items
  useEffect(() => {
    let isMounted = true;
    
    async function loadProductDetail() {
      try {
        setLoading(true);
        setError(null);
        setQuantity(1); // Reset qty on page change

        const fetchedProduct = await api.getProductById(id);
        if (!isMounted) return;
        setProduct(fetchedProduct);

        // Fetch related products (same category)
        const allProducts = await api.getProducts();
        if (!isMounted) return;
        
        const related = allProducts
          .filter((p) => p.category === fetchedProduct.category && p.id !== fetchedProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
        
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load product details.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProductDetail();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleDecreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: quantity
    });

    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }, 600);
  };

  // Star rating helper
  const renderStars = (rate = 0) => {
    const stars = [];
    const roundedRate = Math.round(rate);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={i <= roundedRate ? 'star-icon filled' : 'star-icon'}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="product-detail-page container">
        <div className="detail-loading-skeleton">
          <div className="skeleton-detail-img skeleton"></div>
          <div className="skeleton-detail-info">
            <div className="skeleton skeleton-category"></div>
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-title short"></div>
            <div className="skeleton skeleton-rating"></div>
            <div className="skeleton skeleton-price"></div>
            <div className="skeleton skeleton-desc"></div>
            <div className="skeleton skeleton-desc"></div>
            <div className="skeleton skeleton-btn"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-page container">
        <div className="error-panel glass-panel">
          <h3>Error Loading Product</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Return to Shop</span>
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="product-detail-page container">
      {/* Back button link */}
      <button onClick={() => navigate(-1)} className="back-link-btn">
        <ArrowLeft size={18} />
        <span>Go Back</span>
      </button>

      {/* Main product showcase */}
      <div className="product-detail-grid">
        {/* Left Column: Image */}
        <div className="product-detail-visual glass-panel">
          <div className="detail-image-wrapper">
            <img src={product.image} alt={product.title} className="detail-image" />
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="product-detail-content glass-panel">
          <span className="detail-category badge badge-primary">{product.category}</span>
          <h1 className="detail-title">{product.title}</h1>

          {/* Rating reviews */}
          {product.rating && (
            <div className="detail-rating">
              <div className="stars-container">{renderStars(product.rating.rate)}</div>
              <span className="rating-text">
                {product.rating.rate.toFixed(1)} / 5.0 ({product.rating.count} Customer reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="detail-price-box">
            <span className="detail-price">${product.price.toFixed(2)}</span>
            <span className="price-tax-note">In stock & ready to ship</span>
          </div>

          <hr className="detail-divider" />

          {/* Description */}
          <div className="detail-desc-box">
            <h4>Description</h4>
            <p className="detail-description">{product.description}</p>
          </div>

          <hr className="detail-divider" />

          {/* Cart Quantity Adder Controls */}
          <div className="detail-purchase-controls">
            <div className="detail-quantity-selector">
              <button 
                onClick={handleDecreaseQuantity} 
                className="qty-btn"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="qty-value">{quantity}</span>
              <button 
                onClick={handleIncreaseQuantity} 
                className="qty-btn"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`btn btn-primary detail-add-btn ${isAdded ? 'added' : ''}`}
            >
              {isAdded ? (
                <>
                  <Check size={18} />
                  <span>Added to Cart!</span>
                </>
              ) : isAdding ? (
                <span>Adding...</span>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  <span>Add {quantity} to Cart</span>
                </>
              )}
            </button>
          </div>

          {/* Micro Trust badges */}
          <div className="detail-trust-points">
            <div className="trust-point">
              <Truck size={16} />
              <span>Free Delivery</span>
            </div>
            <div className="trust-point">
              <ShieldCheck size={16} />
              <span>2 Year Warranty</span>
            </div>
            <div className="trust-point">
              <RefreshCw size={16} />
              <span>30 Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <div className="related-header">
            <h2>You May Also Like</h2>
            <p>Similar products handpicked from the {product.category} category.</p>
          </div>
          <div className="related-products-grid">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
export default ProductDetail;
