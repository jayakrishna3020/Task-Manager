import React, { useState } from 'react';
import { CreditCard, ShoppingBag, Loader2 } from 'lucide-react';
import './CheckoutForm.css';

export function CheckoutForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Custom formatting for card fields
    let formattedValue = value;
    if (name === 'cardNumber') {
      // Remove non-digits and limit to 16 digits
      formattedValue = value.replace(/\D/g, '').substring(0, 16);
    } else if (name === 'cardExpiry') {
      // Format as MM/YY
      const digits = value.replace(/\D/g, '');
      if (digits.length > 2) {
        formattedValue = `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
      } else {
        formattedValue = digits;
      }
      formattedValue = formattedValue.substring(0, 5);
    } else if (name === 'cardCvv') {
      // Limit to 3 digits
      formattedValue = value.replace(/\D/g, '').substring(0, 3);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Field Validation
  const validateForm = () => {
    const newErrors = {};

    // Shipping Validations
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State/Region is required';
    
    const zipRegex = /^\d{5,6}$/; // Standard US zip or general postal code
    if (!formData.zip.trim()) {
      newErrors.zip = 'Postal code is required';
    } else if (!zipRegex.test(formData.zip.replace(/\s/g, ''))) {
      newErrors.zip = 'Enter a valid 5 or 6-digit postal code';
    }

    // Payment Validations
    if (!formData.cardName.trim()) newErrors.cardName = 'Name on card is required';
    
    if (!formData.cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.length < 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!formData.cardExpiry) {
      newErrors.cardExpiry = 'Expiry is required';
    } else if (!expiryRegex.test(formData.cardExpiry)) {
      newErrors.cardExpiry = 'Enter a valid MM/YY date';
    } else {
      // Basic check if date is expired
      const [m, y] = formData.cardExpiry.split('/');
      const expiryDate = new Date(`20${y}`, m - 1);
      const today = new Date();
      if (expiryDate < today) {
        newErrors.cardExpiry = 'This card is expired';
      }
    }

    if (!formData.cardCvv) {
      newErrors.cardCvv = 'CVV is required';
    } else if (formData.cardCvv.length < 3) {
      newErrors.cardCvv = 'CVV must be 3 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate payment transaction delays
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(formData);
    }, 1800);
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="checkout-sections">
        {/* Shipping Information */}
        <div className="checkout-form-section glass-panel">
          <h3 className="section-title">
            <span className="step-num">1</span> Shipping Details
          </h3>
          
          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label" htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`form-input ${errors.fullName ? 'input-error' : ''}`}
                placeholder="Jane Doe"
              />
              {errors.fullName && <span className="form-error">{errors.fullName}</span>}
            </div>

            <div className="form-group flex-1">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                placeholder="jane.doe@example.com"
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`form-input ${errors.address ? 'input-error' : ''}`}
              placeholder="123 Main St, Apt 4B"
            />
            {errors.address && <span className="form-error">{errors.address}</span>}
          </div>

          <div className="form-row">
            <div className="form-group flex-2">
              <label className="form-label" htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`form-input ${errors.city ? 'input-error' : ''}`}
                placeholder="New York"
              />
              {errors.city && <span className="form-error">{errors.city}</span>}
            </div>

            <div className="form-group flex-1">
              <label className="form-label" htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`form-input ${errors.state ? 'input-error' : ''}`}
                placeholder="NY"
              />
              {errors.state && <span className="form-error">{errors.state}</span>}
            </div>

            <div className="form-group flex-1">
              <label className="form-label" htmlFor="zip">Zip Code</label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                className={`form-input ${errors.zip ? 'input-error' : ''}`}
                placeholder="10001"
              />
              {errors.zip && <span className="form-error">{errors.zip}</span>}
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="checkout-form-section glass-panel">
          <h3 className="section-title">
            <span className="step-num">2</span> Payment Method
          </h3>

          <div className="card-mockup-wrapper">
            <div className="credit-card-mockup">
              <div className="card-chip"></div>
              <div className="card-brand"><CreditCard size={32} /></div>
              <div className="card-number-display">
                {formData.cardNumber
                  ? formData.cardNumber.replace(/(.{4})/g, '$1 ').trim()
                  : '•••• •••• •••• ••••'}
              </div>
              <div className="card-details-display">
                <div className="card-holder-display">
                  <span className="card-lbl">Card Holder</span>
                  <span className="card-val">{formData.cardName || 'YOUR NAME'}</span>
                </div>
                <div className="card-expiry-display">
                  <span className="card-lbl">Expires</span>
                  <span className="card-val">{formData.cardExpiry || 'MM/YY'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="cardName">Cardholder Name</label>
            <input
              type="text"
              id="cardName"
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
              className={`form-input ${errors.cardName ? 'input-error' : ''}`}
              placeholder="Jane Doe"
            />
            {errors.cardName && <span className="form-error">{errors.cardName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="cardNumber">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              className={`form-input ${errors.cardNumber ? 'input-error' : ''}`}
              placeholder="4111 2222 3333 4444"
            />
            {errors.cardNumber && <span className="form-error">{errors.cardNumber}</span>}
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label" htmlFor="cardExpiry">Expiration Date</label>
              <input
                type="text"
                id="cardExpiry"
                name="cardExpiry"
                value={formData.cardExpiry}
                onChange={handleChange}
                className={`form-input ${errors.cardExpiry ? 'input-error' : ''}`}
                placeholder="MM/YY"
              />
              {errors.cardExpiry && <span className="form-error">{errors.cardExpiry}</span>}
            </div>

            <div className="form-group flex-1">
              <label className="form-label" htmlFor="cardCvv">CVV</label>
              <input
                type="password"
                id="cardCvv"
                name="cardCvv"
                value={formData.cardCvv}
                onChange={handleChange}
                className={`form-input ${errors.cardCvv ? 'input-error' : ''}`}
                placeholder="•••"
              />
              {errors.cardCvv && <span className="form-error">{errors.cardCvv}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Order */}
      <div className="checkout-submit-wrapper">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary checkout-btn"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="spinner-icon" />
              <span>Authorizing Transaction...</span>
            </>
          ) : (
            <>
              <ShoppingBag size={18} />
              <span>Complete Secure Purchase</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
export default CheckoutForm;
