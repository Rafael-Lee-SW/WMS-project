import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext.js";
import Header from "../Header/HomeHeader.js";
import Footer from "../Footer/Footer.js"; // Footer도 import합니다.
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }) => {
  const { login } = useAuth();

  useEffect(() => {
    const checkAndRefreshUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:8080/api/oauth/refresh/token', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.status === 200) {
            console.log("refresh토큰 발행");
            const userData = response.data;
            login(userData, token); // 전역 상태와 로컬 스토리지의 user 정보를 갱신
            console.log("User data refreshed:", userData); // 응답 데이터를 콘솔에 출력
          }
        } catch (error) {
          console.error("Failed to refresh user data", error);
          // 토큰이 유효하지 않거나 오류가 발생하면 로컬 스토리지에서 토큰과 사용자 정보를 제거
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    };

    checkAndRefreshUser();
  }, [login]); // login 함수가 업데이트되면 effect를 다시 실행

  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
