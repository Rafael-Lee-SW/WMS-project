import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext' // AuthContext를 import

const OAuthCallback = () => {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const { response } = router.query; // 리다이렉션 URL에서 'response' 쿼리 매개변수 가져오기

      if (response) {
        try {
          // 'response' 쿼리 매개변수 값을 JSON으로 파싱
          const responseData = JSON.parse(decodeURIComponent(response));

          // 상태 코드와 응답 코드가 성공인지 확인
          if (responseData.code === 'SU') {
            const { user, token } = responseData;
            
            // 로그인 함수 호출하여 전역 상태에 저장
            login(user, token);

            alert(`${user.name}님 환영합니다!`);
            router.push('/'); // 메인 페이지로 이동
          } else {
            alert('로그인에 실패하였습니다.');
            router.push('/signIn'); // 로그인 페이지로 이동
          }
        } catch (error) {
          console.error('Error processing OAuth response:', error);
          alert('인증 처리 중 오류가 발생했습니다.');
          router.push('/signIn');
        }
      }
    };

    fetchData();
  }, [router, login]);

  return <div>OAuth 인증 처리 중...</div>;
};

export default OAuthCallback;
