import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartContext } from '../../contexts/CartContext';
import './CartItem.css';

export function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useContext(CartContext);

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1) {
      updateQuantity(item.id, val);
    }
  };

  return (
    <div className="cart-item glass-panel">
      {/* Product Image */}
      <div className="cart-item-image-container">
        <img src={item.image} alt={item.title} className="cart-item-img" />
      </div>

      {/* Product Information */}
      <div className="cart-item-details">
        <span className="cart-item-category badge badge-primary">{item.category}</span>
        <Link to={`/product/${item.id}`} className="cart-item-title-link">
          <h4 className="cart-item-title">{item.title}</h4>
        </Link>
        <span className="cart-item-price-each">${item.price.toFixed(2)} each</span>
      </div>

      {/* Quantity Selector */}
      <div className="cart-item-quantity-wrapper">
        <span className="control-label">Quantity</span>
        <div className="quantity-selector">
          <button 
            onClick={handleDecrease} 
            className="qty-btn"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <input
            type="number"
            value={item.quantity}
            onChange={handleInputChange}
            min="1"
            className="qty-input"
          />
          <button 
            onClick={handleIncrease} 
            className="qty-btn"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Subtotal & Delete */}
      <div className="cart-item-actions">
        <div className="cart-item-subtotal">
          <span className="subtotal-label">Subtotal</span>
          <span className="subtotal-value">${(item.price * item.quantity).toFixed(2)}</span>
        </div>
        <button
          onClick={() => removeFromCart(item.id)}
          className="delete-item-btn"
          aria-label="Remove item from cart"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
export default CartItem;
