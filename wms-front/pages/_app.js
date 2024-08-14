import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    token: null,
  });

  const login = (userData, token) => {
    setAuthState({ user: userData, token });
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setAuthState({ user: null, token: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        console.log("Token found, starting API request");
        axios.get('http://localhost:8080/api/oauth/refresh/token', { headers: { Authorization: `Bearer ${token}` } })
          .then(response => {
            const userData = response.data;
            console.log("User data refreshed:", userData);
            login(userData, token);
          })
          .catch(error => {
            console.error("Failed to fetch user data", error);
            if (error.response && error.response.status === 401) {
              logout();
            }
          });
      } else {
        console.log("No token found");
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
