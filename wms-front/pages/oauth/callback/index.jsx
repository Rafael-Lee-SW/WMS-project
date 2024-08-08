import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext'; // AuthContext를 import

const OAuthCallback = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const fetchUserInfo = async (token, email) => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/oauth/social-sign-in`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            email,
          },
        });

        if (response.status === 200) {
          const user = response.data;
          // 로컬 스토리지에 사용자 정보 저장
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);

          // 전역 상태에 사용자 정보와 토큰 저장
          login(user, token);
          alert(`${user.name}님 환영합니다!`);
          router.push('/'); // 메인 페이지로 이동
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        alert('사용자 정보를 가져오는 중 오류가 발생했습니다.');
        router.push('/signIn');
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    const handleCallback = async () => {
      const { response } = router.query; // 리다이렉션 URL에서 'response' 쿼리 매개변수 가져오기

      if (response) {
        try {
          // 'response' 쿼리 매개변수 값을 JSON으로 파싱
          const responseData = JSON.parse(decodeURIComponent(response));

          // 상태 코드와 응답 코드가 성공인지 확인
          if (responseData.code === 'SU') {
            const { userEmail, token } = responseData;
            
            // 이메일과 토큰을 사용하여 사용자 정보 가져오기
            await fetchUserInfo(token, userEmail);
          } else {
            alert('로그인에 실패하였습니다.');
            router.push('/signIn'); // 로그인 페이지로 이동
          }
        } catch (error) {
          console.error('Error processing OAuth response:', error);
          alert('인증 처리 중 오류가 발생했습니다.');
          router.push('/signIn');
        } finally {
          setLoading(false); // 로딩 상태 해제
        }
      } else {
        setLoading(false); // response가 없을 경우 로딩 상태 해제
      }
    };

    handleCallback();
  }, [router, login]);

  if (loading) {
    return <div>OAuth 인증 처리 중...</div>;
  }

  return null;
};

export default OAuthCallback;
