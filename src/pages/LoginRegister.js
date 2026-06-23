import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import './LoginRegister.css';

export function LoginRegister() {
  const { user, login, register } = useContext(AuthContext);
  const [isLoginTab, setIsLoginTab] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Determine where to redirect after authentication
  const redirectPath = location.state?.from?.pathname || '/';

  // If already logged in, redirect away
  useEffect(() => {
    if (user) {
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate, redirectPath]);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    // Basic Validations
    if (!email.trim() || !password.trim()) {
      setLocalError('All fields are required.');
      return;
    }
    if (!isLoginTab && !name.trim()) {
      setLocalError('Name is required for registration.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (isLoginTab) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      // Redirect happens automatically via useEffect once 'user' state updates
    } catch (err) {
      setLocalError(err.message || 'Authentication failed. Please check your inputs.');
      setLoading(false);
    }
  };

  // Toggle Tabs
  const toggleTab = (isLogin) => {
    setIsLoginTab(isLogin);
    setLocalError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="login-register-container container">
      <div className="auth-card glass-panel">
        {/* Tabs header */}
        <div className="auth-tabs">
          <button
            onClick={() => toggleTab(true)}
            className={`auth-tab-btn ${isLoginTab ? 'active' : ''}`}
          >
            Login
          </button>
          <button
            onClick={() => toggleTab(false)}
            className={`auth-tab-btn ${!isLoginTab ? 'active' : ''}`}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        <div className="auth-body">
          <div className="auth-header-text">
            <h2>{isLoginTab ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="auth-subtitle">
              {isLoginTab
                ? 'Sign in to access your dashboard, track orders and checkout.'
                : 'Join us to get exclusive offers, track cart and manage transactions.'}
            </p>
          </div>

          {/* Error Notification */}
          {localError && (
            <div className="auth-error-banner">
              <AlertCircle size={16} />
              <span>{localError}</span>
            </div>
          )}

          {/* Test Credentials Alert */}
          {isLoginTab && (
            <div className="test-credentials-alert">
              <span className="badge badge-primary">Demo login</span>
              <p>Email: <strong>admin@gmail.com</strong> / Pass: <strong>admin123</strong></p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Name (Registration Only) */}
            {!isLoginTab && (
              <div className="form-group">
                <label className="form-label" htmlFor="reg-name">Full Name</label>
                <div className="input-with-icon">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    id="reg-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="auth-email">Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  id="auth-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="auth-password">Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  type="password"
                  id="auth-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary auth-submit-btn"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{isLoginTab ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default LoginRegister;
