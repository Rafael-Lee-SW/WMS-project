import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button, TextField, IconButton } from '@mui/material';
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useAuth } from '../context/AuthContext';
import GridContainer from '../components/Grid/GridContainer';
import GridItem from '../components/Grid/GridItem';
import Card from '../components/Card/Card';
import CardBody from '../components/Card/CardBody';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
  },
  card: {
    border: "1px solid #7D4A1A", 
    maxWidth: '350px',
    marginLeft: '60px'
  },
  logo: {
    cursor: 'pointer',
    width: '100%',
    height: '200px',
    marginBottom: '8px',
  },
  snsButtons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    '& button': {
      margin: '8px',
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
    marginBottom: '16px',
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#7d4a1a',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#7d4a1a',
    },
  },
  button: {
    margin: '8px',
    width: '100px',
  },
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    width: '100%',
    margin: 0
  },
  divider: {
    height: '1px',
    width: '100px',
    backgroundColor: '#7d4a1a',
    margin: 0
  },
  dividerText: {
    fontSize: '12px',
    margin: 0,
    padding: '0 10px'
  },
  snsText: {
    margin: '8px 16px',
    fontSize: "18px",
  },
  title: {
    marginBottom: '32px',
  },
  backButton: {
    position: 'absolute',
    top: '16px',
    left: '16px',
  },
  form: {
    marginTop: '60px'
  },
  signUpContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '10px'
  },
  signUpText: {
    fontSize: '12px',
    margin: '0',
    padding: '0 5px'
  },
  loginTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '20px'
  }
}));


export default function Login() {
  const classes = useStyles();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailLogin, setShowEmailLogin] = useState(false);
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
      kakao: 'https://i11a508.p.ssafy.io/api/oauth2/authorization/kakao',
      naver: 'https://i11a508.p.ssafy.io/api/oauth2/authorization/naver',
    };
    window.location.href = urls[provider];
  };

  return (
    <GridContainer className={classes.container}>
      <GridItem xs={12} sm={6} md={4}>
        {showEmailLogin ? (
          <Card className={classes.card}>
            <IconButton className={classes.backButton} onClick={() => setShowEmailLogin(false)}>
              <ArrowBackIcon />
            </IconButton>
            <CardBody>
              <form onSubmit={handleLogin} className={classes.form}>
                <div className={classes.loginTitle}>
                  <img style={{ width: '20px', height: '20px', marginRight: '10px' }} src="/img/mailIconBk.png" alt="mailIcon"/>
                  <h4>이메일로 로그인하기</h4>
                </div>
                <TextField
                  label="이메일주소"
                  type="email"
                  variant="outlined"
                  fullWidth
                  className={classes.textField}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <TextField
                  label="비밀번호"
                  type="password"
                  variant="outlined"
                  fullWidth
                  className={classes.textField}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div>
                  <Button type="submit" variant="contained" style={{ backgroundColor: "#7D4A1A", color: "white" }} className={classes.button}>
                    로그인
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        ) : (
          <Card className={classes.card}>
            <div>
              <img
                src="/img/loginLogo.png"
                alt="Logo"
                className={classes.logo}
                onClick={() => router.push('/')}
              />
            </div>
            <CardBody>
              <div className={classes.dividerContainer}>
                <h3 variant="body1" className={classes.snsText}>
                  간편 로그인
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
              <div className={classes.dividerContainer}>
                <div className={classes.divider}></div>
                <p className={classes.dividerText}>또는</p>
                <div className={classes.divider}></div>
              </div>
              <Button
                  variant="outlined"
                  style={{ margin: '20px 0', borderColor: '#7D4A1A', color: '#7D4A1A' }}
                  onClick={() => setShowEmailLogin(true)}
                >
                  <img style={{ width: '20px', height: '20px', marginRight: '10px' }} src="/img/mailIcon.png" alt="mailIcon"/>
                  이메일로 로그인하기
              </Button>
              <div className={classes.signUpContainer}>
                <p className={classes.signUpText}>fit-box가 처음이신가요?</p>
                <a className={classes.signUpText} href="/signup">회원가입</a>
              </div>
            </CardBody>
          </Card>
        )}
      </GridItem>
    </GridContainer>
  );
}
