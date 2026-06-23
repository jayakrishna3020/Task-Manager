import React, { useContext, useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck, ShoppingCart, Calendar } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import CheckoutForm from '../components/Checkout/CheckoutForm';
import './CheckoutPage.css';

export function CheckoutPage() {
  const { user } = useContext(AuthContext);
  const {
    cartItems,
    cartSubtotal,
    cartShipping,
    cartTax,
    cartTotal,
    clearCart
  } = useContext(CartContext);

  const location = useLocation();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});

  // Route Guard: Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to Home if cart is empty and order wasn't successfully placed
  if (cartItems.length === 0 && !orderSuccess) {
    return <Navigate to="/" replace />;
  }

  // Handle Successful Order Submission
  const handleOrderSubmit = (formData) => {
    // Generate Order Info
    const orderNumber = `AUR-${Math.floor(100000 + Math.random() * 900000)}-${new Date().getFullYear()}`;
    
    // Estimate delivery date (3 business days from now)
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 3);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const estDeliveryDate = delivery.toLocaleDateString('en-US', options);

    setOrderDetails({
      orderNumber,
      deliveryDate: estDeliveryDate,
      totalAmount: cartTotal,
      customerName: formData.fullName,
      customerEmail: formData.email,
      shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`
    });

    setOrderSuccess(true);
    clearCart(); // Empty the cart on successful checkout
  };

  if (orderSuccess) {
    return (
      <div className="order-success-container container">
        <div className="success-card glass-panel">
          <div className="success-icon-wrapper">
            <CheckCircle2 size={56} className="success-icon" />
          </div>
          
          <h2 className="success-title text-gradient">Order Placed Successfully!</h2>
          <p className="success-lead">Thank you for your purchase, {orderDetails.customerName}. Your payment was authorized.</p>

          <hr className="success-divider" />

          {/* Receipt Info */}
          <div className="order-receipt-info">
            <div className="receipt-row">
              <span className="receipt-lbl">Order Number:</span>
              <strong className="receipt-val">{orderDetails.orderNumber}</strong>
            </div>
            <div className="receipt-row">
              <span className="receipt-lbl">Amount Charged:</span>
              <strong className="receipt-val">${orderDetails.totalAmount?.toFixed(2)}</strong>
            </div>
            <div className="receipt-row">
              <span className="receipt-lbl">Confirmation Sent To:</span>
              <span className="receipt-val">{orderDetails.customerEmail}</span>
            </div>
            <div className="receipt-row delivery-row">
              <Calendar size={16} className="calendar-icon" />
              <span>Estimated Delivery: <strong>{orderDetails.deliveryDate}</strong></span>
            </div>
          </div>

          <hr className="success-divider" />

          <p className="success-note">A receipt and tracking link will be sent to your email shortly. If you have questions, contact support.</p>

          <Link to="/" className="btn btn-primary back-home-btn">
            <span>Continue Shopping</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      <div className="checkout-page-header">
        <h1 className="page-heading">Checkout</h1>
        <p className="page-subheading">Secure payment & shipping coordination panel.</p>
      </div>

      <div className="checkout-page-grid">
        {/* Left Side: Form */}
        <div className="checkout-form-area">
          <CheckoutForm onSubmit={handleOrderSubmit} />
        </div>

        {/* Right Side: Simple Order Summary Sidebar */}
        <aside className="checkout-summary-sidebar">
          <div className="checkout-summary-card glass-panel">
            <h3 className="summary-title">Items in Order</h3>
            
            <div className="checkout-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="checkout-summary-item">
                  <div className="item-img-container">
                    <img src={item.image} alt={item.title} className="item-summary-img" />
                  </div>
                  <div className="item-summary-details">
                    <p className="item-summary-title">{item.title}</p>
                    <span className="item-summary-qty">Qty: {item.quantity} • ${item.price.toFixed(2)}</span>
                  </div>
                  <span className="item-summary-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <hr className="summary-divider" />

            <div className="summary-pricing-breakdown">
              <div className="summary-price-row">
                <span>Subtotal</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="summary-price-row">
                <span>Shipping</span>
                <span>{cartShipping === 0 ? 'FREE' : `$${cartShipping.toFixed(2)}`}</span>
              </div>
              <div className="summary-price-row">
                <span>Sales Tax (8%)</span>
                <span>${cartTax.toFixed(2)}</span>
              </div>
              <hr className="summary-divider" />
              <div className="summary-price-row checkout-total-row">
                <span>Total Amount</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="checkout-security-note">
              <ShieldCheck size={18} className="shield-icon" />
              <p>Your payment information is fully encrypted and never stored on our servers.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
export default CheckoutPage;
