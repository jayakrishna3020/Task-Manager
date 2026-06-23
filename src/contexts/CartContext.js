import React, { createContext, useState, useEffect, useMemo } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('ecommerce_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (err) {
        localStorage.removeItem('ecommerce_cart');
      }
    }
  }, []);

  // Sync cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('ecommerce_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item
        );
      }
      return [...prevItems, { ...product, quantity: product.quantity || 1 }];
    });
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Update item quantity
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity: Math.floor(quantity) } : item))
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Memoized Calculations for performance optimization
  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const cartShipping = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    return cartSubtotal >= 100 ? 0 : 9.99; // Free shipping above $100
  }, [cartSubtotal]);

  const cartTax = useMemo(() => {
    return cartSubtotal * 0.08; // 8% sales tax
  }, [cartSubtotal]);

  const cartTotal = useMemo(() => {
    return cartSubtotal + cartShipping + cartTax;
  }, [cartSubtotal, cartShipping, cartTax]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartSubtotal,
    cartShipping,
    cartTax,
    cartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
