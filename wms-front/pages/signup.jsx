import styled from "styled-components";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const Container = styled.form`

    width: 568px;
    padding: 32px;
    background-color: white;

    .input-wrapper {
    position: relative;
    margin-bottom: 16px;
    input {
        position: relative;
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
    `;

// 회원가입 폼
export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConformPassword] = useState('');
    const [message, setMessage] = useState('');

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('비밀번호가 다릅니다.');
            return;
        }
        try {
            const response = await axios.post('', { email, password});
            setMessage('회원가입이 완료되었습니다.');
            router.push('/login');
        } catch (error) {
            setMessage('회원가입이 처리되지 않았습니다.' + error.response.data);
        }
    };

    return (
        <Container onSubmit={handleSubmit}>
            <h1>회원가입</h1>
            <div>
                <div className="input-wrapper">
                    <h3>이메일</h3>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div className="input-wrapper">
                    <h3>비밀번호</h3>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <div className="input-wrapper">
                    <h3>비밀번호 확인</h3>
                    <input type="password" value={confirmPassword} onChange={(e) => setConformPassword(e.target.value)} required/>
                </div>
                <button type="submit">회원가입</button>
            </div>
            { message && <p>{message}</p>}
        </Container>
    )
}
