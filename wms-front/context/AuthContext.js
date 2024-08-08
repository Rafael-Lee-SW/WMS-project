// src/context/AuthContext.js

import React, { createContext, useContext, useState } from 'react';

// AuthContext를 생성합니다.
const AuthContext = createContext();

// Context를 제공하는 컴포넌트를 생성합니다.
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    token: null,
  });

  const login = (userData, token) => {
    setAuthState({ user: userData, token });

    localStorage.setItem('token', token); // 토큰을 로컬 저장소에 저장하여 페이지를 새로고침해도 유지
    localStorage.setItem('user', JSON.stringify(userData)); // 사용자   보를 로컬 저장소에 저장
  };

  const logout = () => {
    setAuthState({ user: null, token: null });
    localStorage.removeItem('token'); // 로그아웃 시 토큰 삭제
    localStorage.removeItem('user'); // 로그아웃 시 사용자 정보 삭제
  };
  return (   
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
