import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styled from "styled-components";
import Button from "/components/CustomButtons/Button.js";

const Container = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 568px;
  padding: 32px;
  background-color: white;
  margin: 0 auto;

  .input-wrapper {
    position: relative;
    margin-bottom: 16px;
    width: 100%;

    input {
      width: 100%;
      height: 46px;
      padding: 0 44px 0 11px;
      border: 1px solid;
      border-radius: 4px;
      font-size: 16px;
      outline: none;

      ::placeholder {
        color: gray;
      }
    }

    svg {
      position: absolute;
      right: 11px;
      top: 16px;
    }
  }

  h2 {
    margin-bottom: 24px;
  }
`;

// 사장 로그인
export default function PresidentLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { username, password });
      if (response.status === 200) {
        router.push('/')
      }
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  return (
    <Container onSubmit={handleSubmit}>
      <h2>로그인</h2>
      <div className="input-wrapper">
        <input 
          type="email" 
          placeholder="아이디" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required 
        />
      </div>
      <div className="input-wrapper">
        <input 
          type="password" 
          placeholder="비밀번호" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
      </div>
      <Button type="submit" color="primary">로그인</Button>
    </Container>
  );
}
