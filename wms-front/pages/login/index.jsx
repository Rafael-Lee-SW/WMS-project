import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { makeStyles, Button, TextField, Divider, Typography } from '@material-ui/core';
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import { signIn } from 'next-auth/react'; // next-auth의 signIn 함수 가져오기

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
    marginBottom: theme.spacing(4), // 로고 아래에 여백 추가
    border: '2px solid black', // 로고 테두리 검은색 실선
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
  
}));

export default function Login() {
  const classes = useStyles();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // 로그인 처리 로직 추가
    console.log('로그인 시도:', { email, password });
  };

  return (
    <GridContainer className={classes.container}>
      <GridItem xs={12} sm={6} md={4}>
        <Card>
          <CardHeader>
            <img
              src="/img/logo.png"
              alt="Logo"
              className={classes.logo}
              onClick={handleLogoClick}
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
              <button className="sns-button" onClick={() => signIn('kakao')}>
                <img src="/img/kakao-sign-in.png" alt="Kakao Sign In" />
              </button>
              <button className="sns-button" onClick={() => signIn('naver')}>
                <img src="/img/naver-sign-in.png" alt="Naver Sign In" />
              </button>
              
            </div>
            <div>
            <Divider className={classes.divider} />
            </div> <br />
          
            <form onSubmit={handleLogin}>
              <TextField
                label="이메일 ID"
                type="email"
                variant="outlined"
                fullWidth
                className={classes.textField}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="패스워드"
                type="password"
                variant="outlined"
                fullWidth
                className={classes.textField}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div>
                <Button type="submit" variant="contained" color="primary" className={classes.button}>
                  로그인
                </Button>
                <Button variant="outlined" color="primary" className={classes.button} onClick={() => router.push('/login/signup')}>
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