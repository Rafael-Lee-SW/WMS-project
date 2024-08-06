import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // AuthContext에서 제공하는 훅을 가져옵니다.

export default function NaverCallback() {
  const router = useRouter();
  const { login } = useAuth(); // AuthContext의 login 함수를 사용합니다.

  useEffect(() => {
    const handleNaverCallback = async () => {
      const { code, state } = router.query; // state도 보통 인증에 포함되므로 같이 가져옵니다.

      if (!code) {
        console.error('인증 코드를 찾을 수 없습니다.');
        return;
      }

      try {
        // 서버에 인증 코드 전송
        const response = await axios.post('/api/oauth2/code/naver', { code, state });

        if (response.status === 200) {
          const { user, token } = response.data;


          // 로그인 성공 처리
          login(user, token); // 전역 상태에 사용자 정보 및 토큰 저장
          alert(`${user.name}님 환영합니다!`); // 사용자 이름으로 환영 메시지 표시
          router.push('/'); // 메인 페이지로 이동
        }
      } catch (error) {
        console.error('네이버 OAuth 콜백 에러:', error);
        alert('로그인에 실패했습니다. 다시 시도해주세요.');
        router.push('/login'); // 로그인 페이지로 리디렉션
      }
    };

    if (router.isReady) {
      handleNaverCallback();
    }
  }, [router.isReady, router.query, login]);

  return <div>네이버 로그인 처리 중...</div>;
}
