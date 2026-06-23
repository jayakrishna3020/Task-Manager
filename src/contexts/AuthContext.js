import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('ecommerce_user');
    if (savedSession) {
      try {
        setUser(JSON.parse(savedSession));
      } catch (err) {
        localStorage.removeItem('ecommerce_user');
      }
    }
    setLoading(false);
  }, []);

  // Register user
  const register = (name, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem('ecommerce_registered_users') || '[]');
          
          // Check if email already exists
          const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
          if (userExists) {
            reject(new Error('An account with this email already exists.'));
            return;
          }

          const newUser = {
            id: Date.now(),
            name,
            email: email.toLowerCase(),
            password // Stored in plain text for simulation purposes
          };

          users.push(newUser);
          localStorage.setItem('ecommerce_registered_users', JSON.stringify(users));
          
          // Auto-login after registration
          const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email };
          setUser(sessionUser);
          localStorage.setItem('ecommerce_user', JSON.stringify(sessionUser));
          setError(null);
          resolve(sessionUser);
        } catch (err) {
          reject(new Error('Failed to register user. Please try again.'));
        }
      }, 500);
    });
  };

  // Login user
  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const lowerEmail = email.toLowerCase();
          
          // Default admin/tester account
          if (lowerEmail === 'admin@gmail.com' && password === 'admin123') {
            const adminUser = { id: 100, name: 'Admin Tester', email: 'admin@gmail.com' };
            setUser(adminUser);
            localStorage.setItem('ecommerce_user', JSON.stringify(adminUser));
            setError(null);
            resolve(adminUser);
            return;
          }

          const users = JSON.parse(localStorage.getItem('ecommerce_registered_users') || '[]');
          const matchedUser = users.find(u => u.email === lowerEmail && u.password === password);
          
          if (!matchedUser) {
            reject(new Error('Invalid email or password.'));
            return;
          }

          const sessionUser = { id: matchedUser.id, name: matchedUser.name, email: matchedUser.email };
          setUser(sessionUser);
          localStorage.setItem('ecommerce_user', JSON.stringify(sessionUser));
          setError(null);
          resolve(sessionUser);
        } catch (err) {
          reject(new Error('Login failed. Please try again.'));
        }
      }, 500);
    });
  };

  // Logout user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecommerce_user');
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
