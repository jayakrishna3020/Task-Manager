import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';
import { CartContext } from '../contexts/CartContext';
import CartItem from '../components/Cart/CartItem';
import './CartPage.css';

export function CartPage() {
  const {
    cartItems,
    cartSubtotal,
    cartShipping,
    cartTax,
    cartTotal,
    clearCart
  } = useContext(CartContext);

  const navigate = useNavigate();

  // Calculation for Free Shipping Meter ($100 target)
  const FREE_SHIPPING_LIMIT = 100;
  const remainingForFreeShipping = FREE_SHIPPING_LIMIT - cartSubtotal;
  const shippingProgressPercentage = Math.min((cartSubtotal / FREE_SHIPPING_LIMIT) * 100, 100);

  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty-cart-container container">
        <div className="empty-cart-card glass-panel">
          <div className="empty-cart-icon-bg">
            <ShoppingBag size={48} className="empty-cart-icon" />
          </div>
          <h2>Your Cart is Empty</h2>
          <p>It looks like you haven't added any products to your cart yet. Explore our featured items and start shopping!</p>
          <Link to="/" className="btn btn-primary start-shopping-btn">
            <ArrowLeft size={16} />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <div className="cart-page-header">
        <h1 className="page-heading">Your Shopping Bag</h1>
        <p className="page-subheading">You have {cartItems.length} unique items in your bag.</p>
      </div>

      <div className="cart-page-grid">
        {/* Left Side: Items List */}
        <div className="cart-items-section">
          {/* Free Shipping Meter */}
          <div className="free-shipping-meter glass-panel">
            <div className="meter-header">
              {remainingForFreeShipping > 0 ? (
                <p>
                  Add <strong className="text-gradient">${remainingForFreeShipping.toFixed(2)}</strong> more to unlock <strong>Free Express Shipping</strong>!
                </p>
              ) : (
                <p className="free-shipping-unlocked">
                  🎉 Congratulations! You have unlocked <strong>Free Express Shipping</strong>!
                </p>
              )}
            </div>
            <div className="meter-track">
              <div 
                className="meter-bar" 
                style={{ width: `${shippingProgressPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="items-list">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="cart-list-actions">
            <Link to="/" className="btn btn-secondary continue-shopping-btn">
              <ArrowLeft size={16} />
              <span>Continue Shopping</span>
            </Link>
            <button onClick={clearCart} className="btn btn-secondary clear-cart-btn-row">
              <Trash2 size={16} />
              <span>Clear Cart</span>
            </button>
          </div>
        </div>

        {/* Right Side: Order Summary Card */}
        <aside className="order-summary-section">
          <div className="summary-card glass-panel">
            <h3 className="summary-card-title">Order Summary</h3>
            
            <div className="summary-rows">
              <div className="summary-row">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Estimated Shipping</span>
                <span className="summary-value">
                  {cartShipping === 0 ? 'FREE' : `$${cartShipping.toFixed(2)}`}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Sales Tax (8%)</span>
                <span className="summary-value">${cartTax.toFixed(2)}</span>
              </div>
              
              <hr className="summary-divider" />
              
              <div className="summary-row total-row">
                <span className="summary-label">Order Total</span>
                <span className="summary-value">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')} 
              className="btn btn-primary checkout-proceed-btn"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div className="secure-checkout-badge">
              <span>🔒 256-Bit SSL Encrypted checkout</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
export default CartPage;
