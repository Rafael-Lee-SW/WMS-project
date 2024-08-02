import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function NaverCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleNaverCallback = async () => {
      const { code, state } = router.query;

      if (!code) {
        console.error('Authorization code not found.');
        return;
      }

      try {
        // 서버에 인증 코드 보내기
        const response = await axios.post('/api/oauth2/code/naver', { code, state });

        if (response.status === 200) {
          // 로그인 성공 처리
          console.log('User information:', response.data);
          router.push('/main'); // 메인 페이지로 이동
        }
      } catch (error) {
        console.error('Naver OAuth callback error:', error);
        router.push('/login'); // 로그인 페이지로 리다이렉트
      }
    };

    if (router.isReady) {
      handleNaverCallback();
    }
  }, [router.isReady, router.query]);

  return <div>네이버 로그인 처리 중...</div>;
}
