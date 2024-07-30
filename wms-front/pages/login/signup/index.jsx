import React, { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function SignUp() {
    const router = useRouter();

    const idRef = useRef(null);
    const passwordRef = useRef(null);
    const passwordCheckRef = useRef(null);
    const emailRef = useRef(null);
    const certificationNumberRef = useRef(null);

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [email, setEmail] = useState('');
    const [certificationNumber, setCertificationNumber] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== passwordCheck) {
            alert('비밀번호가 다릅니다.');
            return;
        }

        try {
            const response = await axios.post('/api/signup', { email, password });
            alert('회원가입이 완료되었습니다.');
            router.push('/login');
        } catch (error) {
            alert('회원가입이 처리되지 않았습니다. ' + error.response.data);
        }
    };

    return (
        <div className="sign-up-wrapper">
            <div className="sign-up-container">
                <h1>Web 재고 관리 시스템</h1>
                <h2>SNS 회원가입</h2>
                <div className="sns-sign-in-buttons">
                    <button className="sns-button" onClick={() => signIn('kakao')}>
                        <img src="/img/kakao-sign-in.png" alt="Kakao Sign In" className="sns-sign-in-image"/>
                    </button>
                    <button className="sns-button" onClick={() => signIn('naver')}>
                        <img src="/img/naver-sign-in.png" alt="Naver Sign In" className="sns-sign-in-image" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>아이디</label>
                        <input
                            type="text"
                            placeholder="아이디를 입력해주세요"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            ref={idRef}
                        />
                        <button type="button" onClick={() => alert('중복 확인')}>중복 확인</button>
                    </div>
                    <div className="input-group">
                        <label>비밀번호</label>
                        <input
                            type="password"
                            placeholder="비밀번호를 입력해주세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            ref={passwordRef}
                        />
                    </div>
                    <div className="input-group">
                        <label>비밀번호 확인</label>
                        <input
                            type="password"
                            placeholder="비밀번호를 입력해주세요"
                            value={passwordCheck}
                            onChange={(e) => setPasswordCheck(e.target.value)}
                            ref={passwordCheckRef}
                        />
                    </div>
                    <div className="input-group">
                        <label>이메일</label>
                        <input
                            type="text"
                            placeholder="이메일 주소를 입력해주세요"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            ref={emailRef}
                        />
                        <button type="button" onClick={() => alert('이메일 인증')}>이메일 인증</button>
                    </div>
                    <div className="input-group">
                        <label>인증번호</label>
                        <input
                            type="text"
                            placeholder="인증번호 4자리를 입력해주세요"
                            value={certificationNumber}
                            onChange={(e) => setCertificationNumber(e.target.value)}
                            ref={certificationNumberRef}
                        />
                        <button type="button" onClick={() => alert('인증 확인')}>인증 확인</button>
                    </div>
                    <button type="submit" className="sign-up-button">회원가입</button>
                </form>
                <button className="login-button" onClick={() => router.push('/login')}>로그인</button>
            </div>
            <style jsx>{`
                .sign-up-wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background-color: #f7f7f7;
                }
                .sign-up-container {
                    background: #fff;
                    padding: 2rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    max-width: 400px;
                    text-align: center;
                }
                h1, h2 {
                    margin: 0 0 1rem 0;
                }
                .sns-sign-in-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 1rem; /* 버튼 사이의 간격을 조정 */
                    margin-bottom: 1rem;
                }
                .sns-button {
                    width: auto;
                    padding: 0.5rem;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    background: none;
                }
                .sns-sign-in-image {
                    width: 48px; /* 이미지를 적절한 크기로 조정 */
                    height: 48px; /* 이미지를 적절한 크기로 조정 */
                }
                .input-group {
                    display: flex;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                .input-group label {
                    flex: 1;
                    text-align: left;
                }
                .input-group input {
                    flex: 2;
                    padding: 0.5rem;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                .input-group button {
                    flex: 1;
                    margin-left: 0.5rem;
                    padding: 0.5rem;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    background-color: #ddd;
                }
                .sign-up-button {
                    width: 100%;
                    padding: 0.75rem;
                    border: none;
                    border-radius: 4px;
                    background-color: #555;
                    color: #fff;
                    cursor: pointer;
                    margin-top: 1rem;
                }
                .login-button {
                    margin-top: 1rem;
                    background: none;
                    border: none;
                    color: #555;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}
