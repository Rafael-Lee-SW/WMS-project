import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function KakaoCallback() {
  const router = useRouter();

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
          // 로그인 성공 처리
          console.log('User information:', response.data);
          router.push('/main'); // 메인 페이지로 이동
        }
      } catch (error) {
        console.error('Kakao OAuth callback error:', error);
        router.push('/login'); // 로그인 페이지로 리다이렉트
      }
    };

    if (router.isReady) {
      handleKakaoCallback();
    }
  }, [router.isReady, router.query]);

  return <div>카카오 로그인 처리 중...</div>;
}
