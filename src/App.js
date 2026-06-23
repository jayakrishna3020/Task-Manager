import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Styling Imports
import './styles/theme.css';
import './styles/global.css';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Static Components
import Navbar from './components/Navbar/Navbar';

// Lazy Loaded Pages for Code Splitting & Performance Optimization
const Home = lazy(() => import('./pages/Home'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LoginRegister = lazy(() => import('./pages/LoginRegister'));

// Custom Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled page crash:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-screen container" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <div className="glass-panel" style={{ padding: '40px', maxWidth: '500px', margin: '0 auto', background: '#151c2c' }}>
            <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>Application Error</h2>
            <p style={{ color: '#9ca3af', marginBottom: '24px', fontSize: '0.95rem', lineHeight: '1.6' }}>
              We apologize, but something went wrong. A crash occurred in the interface.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="btn btn-primary"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Spinner for Route Suspense Fallback
function PageLoader() {
  return (
    <div className="page-suspense-loader" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 72px)',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div className="spinner" style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(255, 255, 255, 0.05)',
        borderTopColor: 'var(--primary)',
        borderRadius: '50%',
        animation: 'spin 1s infinite linear'
      }}></div>
      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
        LOADING AURA...
      </span>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Navbar />
            <main className="main-content-wrapper">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public Catalog Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<CartPage />} />
                  
                  {/* Authentication Router */}
                  <Route path="/login" element={<LoginRegister />} />
                  
                  {/* Protected Checkout Route (Guard checks inside component) */}
                  <Route path="/checkout" element={<CheckoutPage />} />
                  
                  {/* Fallback Catch-All Redirect */}
                  <Route path="*" element={<Home />} />
                </Routes>
              </Suspense>
            </main>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;