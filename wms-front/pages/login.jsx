import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { makeStyles, Button, TextField, Divider, Typography } from '@material-ui/core';
import { useAuth } from '../context/AuthContext';
import GridContainer from '../components/Grid/GridContainer';
import GridItem from '../components/Grid/GridItem';
import Card from '../components/Card/Card';
import CardHeader from '../components/Card/CardHeader';
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
    width: '80px',
    height: '80px',
    marginBottom: theme.spacing(4),
    border: '2px solid black',
  },
  snsButtons: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
    '& button': {
      margin: theme.spacing(1),
    },
    '& img': {
      width: '40px',
      height: '40px',
    },
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
    width: '100px',
  },
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '80%',
    margin: theme.spacing(2, 0),
  },
  divider: {
    flex: 1,
    height: '1px',
    backgroundColor: '#000',
  },
  snsText: {
    margin: theme.spacing(0, 2),
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
        login(response.data.user, response.data.token); // 전역 상태에 사용자 정보와 토큰 저장
        alert(`${response.data.user.name}님 환영합니다!`);
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
      kakao: 'https://i11a508.p.ssafy.io/api/oauth2/authorization/kakao',
      naver: 'https://i11a508.p.ssafy.io/api/oauth2/authorization/naver',
    };
    window.location.href = urls[provider];
  };

  return (
    <GridContainer className={classes.container}>
      <Typography variant="h2" className={classes.title}>
        Web 재고 관리 시스템
      </Typography>
      <GridItem xs={12} sm={6} md={4}>
        <Card>
          <CardHeader>
            <img
              src="/img/logo.png"
              alt="Logo"
              className={classes.logo}
              onClick={() => router.push('/')}
            />
          </CardHeader>
          <CardBody>
            <div className={classes.dividerContainer}>
              <div className={classes.divider} />
              <Typography variant="body1" className={classes.snsText}>
                SNS 로그인하기
              </Typography>
              <div className={classes.divider} />
            </div>
            <div className={classes.snsButtons}>
              <button className="sns-button" onClick={() => signInWithProvider('kakao')}>
                <img src="/img/kakao-sign-in.png" alt="Kakao Sign In" />
              </button>
              <button className="sns-button" onClick={() => signInWithProvider('naver')}>
                <img src="/img/naver-sign-in.png" alt="Naver Sign In" />
              </button>
            </div>
            <Divider className={classes.divider} /><br />
            <form onSubmit={handleLogin}>
              <TextField
                label="이메일 ID"
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
                <Button type="submit" variant="contained" color="primary" className={classes.button}>
                  로그인
                </Button>
                <Button variant="outlined" color="primary" className={classes.button} onClick={() => router.push('/signup')}>
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
