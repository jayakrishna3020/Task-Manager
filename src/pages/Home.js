import React from 'react';
import { ShoppingBag, ArrowDownCircle, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import ProductList from '../components/ProductList/ProductList';
import './Home.css';

export function Home() {
  const productsHook = useProducts();

  const scrollToCatalog = () => {
    const catalogElement = document.getElementById('catalog-start');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section container">
        <div className="hero-grid">
          <div className="hero-content">
            <span className="hero-badge badge badge-primary">SUMMER COLLECTION 2026</span>
            <h1 className="hero-title">
              Redefine Your <br />
              <span className="text-gradient">Modern Lifestyle</span>
            </h1>
            <p className="hero-description">
              Discover Aura’s curated selection of premium electronics, fine jewelry, and contemporary fashion designed for those who appreciate minimalist aesthetics and high utility.
            </p>
            <div className="hero-actions">
              <button onClick={scrollToCatalog} className="btn btn-primary hero-cta-btn">
                <ShoppingBag size={18} />
                <span>Shop the Collection</span>
              </button>
              <button onClick={scrollToCatalog} className="btn btn-secondary hero-learn-btn">
                <span>Explore Catalog</span>
                <ArrowDownCircle size={18} />
              </button>
            </div>
          </div>

          {/* Graphic/Visual Showcase Element */}
          <div className="hero-visual">
            <div className="visual-circle-glow"></div>
            <div className="glass-showcase-card glass-panel">
              <div className="showcase-header">
                <span className="showcase-pill">Trending</span>
                <span className="showcase-price">$299.00</span>
              </div>
              <h3 className="showcase-title">Active Noise Cancelling Headphones</h3>
              <p className="showcase-desc">High fidelity audio with smart environmental acoustics adaptation.</p>
              <div className="showcase-footer">
                <div className="rating-stars-demo">★★★★★</div>
                <span className="rating-count-demo">(480 reviews)</span>
              </div>
            </div>
            {/* Another smaller overlay card for premium depth */}
            <div className="glass-showcase-subcard glass-panel">
              <span className="subcard-title">Free Express Shipping</span>
              <p className="subcard-text">On orders over $100</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Bar */}
      <section className="trust-badges-section container">
        <div className="trust-badges-grid glass-panel">
          <div className="trust-badge-item">
            <Truck size={24} className="badge-icon" />
            <div className="badge-text">
              <h4>Free Shipping</h4>
              <p>On all orders above $100</p>
            </div>
          </div>
          <div className="trust-badge-item">
            <RotateCcw size={24} className="badge-icon" />
            <div className="badge-text">
              <h4>Easy Returns</h4>
              <p>30-day money-back guarantee</p>
            </div>
          </div>
          <div className="trust-badge-item">
            <ShieldCheck size={24} className="badge-icon" />
            <div className="badge-text">
              <h4>Secure Checkout</h4>
              <p>SSL encrypted transactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog-start" className="catalog-section container">
        <div className="catalog-header">
          <h2 className="section-heading">Featured Collection</h2>
          <p className="section-subheading">Filter through our wide selection of items or search for specific products.</p>
        </div>
        <ProductList hookData={productsHook} />
      </section>
    </div>
  );
}
export default Home;
