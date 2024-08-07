import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { makeStyles, Button, TextField } from '@material-ui/core';
import { useAuth } from '../context/AuthContext';
import GridContainer from '../components/Grid/GridContainer';
import GridItem from '../components/Grid/GridItem';
import Card from '../components/Card/Card';
import CardBody from '../components/Card/CardBody';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
  },
  logo: {
    cursor: 'pointer',
    width: '100%',
    height: '300px',
    marginBottom: theme.spacing(1),
  },
  snsButtons: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
    '& button': {
      margin: theme.spacing(1),
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
    },
    '& img': {
      width: '50px',
      height: '50px',
    },
  },
  textField: {
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#7d4a1a', // 클릭 시 아웃라인 색상
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#7d4a1a', // 클릭 시 레이블 색상
    },
  },
  button: {
    margin: theme.spacing(1),
    width: '100px',
  },
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  snsText: {
    margin: theme.spacing(0, 2),
    fontSize: "20px"
  },
  title: {
    marginBottom: theme.spacing(4),
  },
}));

export default function Login() {
  const classes = useStyles();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://i11a508.p.ssafy.io/api/oauth/sign-in', {
        email,
        password,
      });
    
      if (response.status === 200 && response.data.code === 'SU') {
        const { user, token } = response.data;
        
        login(user, token); // 전역 상태에 사용자 정보와 토큰 저장
        alert(`${user.name}님 환영합니다!`);
        router.push('/'); // 메인 페이지로 이동
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400 && error.response.data.code === 'VF') {
          alert('로그인에 실패하였습니다. 입력한 정보를 확인하세요.');
        } else if (error.response.status === 401 && error.response.data.code === 'SF') {
          alert('로그인 정보가 맞지 않습니다. 다시 시도해주세요.');
        } else if (error.response.status === 500 && error.response.data.code === 'DBE') {
          alert('서버가 불안정합니다. 잠시 후 다시 시도해주세요.');
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의하세요.');
        }
      } else {
        alert('네트워크 오류가 발생했습니다. 인터넷 연결을 확인하세요.');
      }
      // 로그인 페이지에 머무름
    }
  };

  const signInWithProvider = (provider) => {
    const urls = {
      kakao: 'https://i11a508.p.ssafy.io/oauth2/authorization/kakao',
      naver: 'https://i11a508.p.ssafy.io/oauth2/authorization/naver',
    };
    window.location.href = urls[provider];
  };

  return (
    <GridContainer className={classes.container}>
      <GridItem xs={12} sm={6} md={4}>
        <Card>
          <cardHeader>
            <img
              src="/img/loginLogo.jpg"
              alt="Logo"
              className={classes.logo}
              onClick={() => router.push('/')}
            />
          </cardHeader>
          <CardBody>
            <div className={classes.dividerContainer}>
              <h3 variant="body1" className={classes.snsText}>
                SNS 로그인
              </h3>
            </div>
            <div className={classes.snsButtons}>
              <button className="sns-button" onClick={() => signInWithProvider('kakao')}>
                <img src="/img/kakao-sign-in.png" alt="Kakao Sign In" />
              </button>
              <button className="sns-button" onClick={() => signInWithProvider('naver')}>
                <img src="/img/naver-sign-in.png" alt="Naver Sign In" />
              </button>
            </div>
            <form onSubmit={handleLogin}>
              <TextField
                label="이메일"
                type="email"
                variant="outlined"
                fullWidth
                className={classes.textField}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="패스워드"
                type="password"
                variant="outlined"
                fullWidth
                className={classes.textField}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div>
                <Button type="submit" variant="contained" style={{ backgroundColor:"#7D4A1A", color:"white" }} className={classes.button}>
                  로그인
                </Button>
                <Button variant="outlined" style={{ borderColor:"#7D4A1A", color: "#7D4A1A" }} className={classes.button} onClick={() => router.push('/signup')}>
                  회원가입
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
