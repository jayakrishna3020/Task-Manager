import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut, Sun, Moon } from 'lucide-react';
import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';
import './Navbar.css';

export function Navbar() {
  const { cartCount } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Search input state
  const [searchInput, setSearchInput] = useState('');
  // Mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // User dropdown toggle
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  // Theme state
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // Sync search input with URL search param
  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  // Apply theme class to body
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate('/');
    }
    setMobileMenuOpen(false);
  };

  const handleCategoryClick = (category) => {
    navigate(`/?category=${encodeURIComponent(category)}`);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo" onClick={() => navigate('/')}>
          <span className="text-gradient">AURA</span>
          <span className="logo-dot">.</span>
        </Link>

        {/* Search Bar (Desktop) */}
        <form onSubmit={handleSearchSubmit} className="navbar-search-form">
          <input
            type="text"
            placeholder="Search products, brands..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="navbar-search-input"
          />
          <button type="submit" className="navbar-search-btn">
            <Search size={18} />
          </button>
        </form>

        {/* Navigation Items (Desktop) */}
        <div className="navbar-actions">
          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="nav-icon-btn" aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Cart Icon */}
          <Link to="/cart" className="nav-icon-btn cart-btn">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* User Section */}
          {user ? (
            <div className="user-dropdown-container">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)} 
                className="user-profile-btn"
              >
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="user-name-text">{user.name.split(' ')[0]}</span>
              </button>

              {userDropdownOpen && (
                <div className="user-dropdown-menu glass-panel">
                  <div className="dropdown-user-info">
                    <p className="dropdown-name">{user.name}</p>
                    <p className="dropdown-email">{user.email}</p>
                  </div>
                  <hr className="dropdown-divider" />
                  <button onClick={handleLogout} className="dropdown-item logout-item">
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary login-nav-btn">
              <User size={16} />
              <span>Login</span>
            </Link>
          )}

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="mobile-menu-btn"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer glass-panel">
          <form onSubmit={handleSearchSubmit} className="mobile-search-form">
            <input
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="mobile-search-input"
            />
            <button type="submit" className="mobile-search-btn">
              <Search size={18} />
            </button>
          </form>

          <div className="mobile-nav-links">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">Home</Link>
            <button onClick={() => handleCategoryClick('electronics')} className="mobile-nav-link text-left">Electronics</button>
            <button onClick={() => handleCategoryClick('jewelry')} className="mobile-nav-link text-left">Jewelry</button>
            <button onClick={() => handleCategoryClick("men's clothing")} className="mobile-nav-link text-left">Men's Clothing</button>
            <button onClick={() => handleCategoryClick("women's clothing")} className="mobile-nav-link text-left">Women's Clothing</button>
          </div>
        </div>
      )}
    </nav>
  );
}
export default Navbar;
