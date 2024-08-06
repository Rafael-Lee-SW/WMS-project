import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuth } from '../../../../context/AuthContext'; // AuthContext에서 제공하는 훅을 import

export default function KakaoCallback() {
  const router = useRouter();
  const { login } = useAuth(); // AuthContext의 login 함수를 가져옵니다.

  useEffect(() => {
    const handleKakaoCallback = async () => {
      const { code } = router.query;

      if (!code) {
        console.error('Authorization code not found.');
        return;
      }

      try {
        // 서버에 인증 코드 보내기
        const response = await axios.post('/api/oauth2/code/kakao', { code });

        if (response.status === 200) {
          const { user, token } = response.data;
          
          // 로그인 성공 처리
          login(user, token); // 전역 상태에 사용자 정보와 토큰 저장
          alert(`${user.name}님 환영합니다!`); // 환영 메시지 표시
          router.push('/'); // 메인 페이지로 이동
        }
      } catch (error) {
        console.error('Kakao OAuth callback error:', error);
        alert('로그인에 실패했습니다. 다시 시도해주세요.');
        router.push('/login'); // 로그인 페이지로 리다이렉트
      }
    };

    if (router.isReady) {
      handleKakaoCallback();
    }
  }, [router.isReady, router.query, login]);

  return <div>카카오 로그인 처리 중...</div>;
}
