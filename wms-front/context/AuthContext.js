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
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setAuthState({ user: null, token: null });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    console.log("please in userEffect")
    const token = localStorage.getItem('token');
    if (token) {
      console.log("Token found, starting API request"); // 추가 로그
      axios.get('http://localhost:8080/api/oauth/refresh/token', { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
          const userData = response.data;
          console.log("들어왔니 리프레시", userData);  // 서버에서 가져온 최신 정보로 갱신
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
  }, []);

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
