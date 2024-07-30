import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { makeStyles, Button, TextField, Divider, Typography } from '@material-ui/core';
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';

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
  title: {
    marginBottom: theme.spacing(4),
  },
}));

export default function Login() {
  const classes = useStyles();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/sign-in', {
        email,
        password,
      });

      if (response.status === 200 && response.data.code === 'SU') {
        alert('로그인 성공!');
        router.push('/main');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400 && error.response.data.code === 'VF') {
          alert('로그인에 실패하였습니다.');
        } else if (error.response.status === 401 && error.response.data.code === 'SF') {
          alert('로그인 정보가 맞지 않습니다.');
        } else if (error.response.status === 500 && error.response.data.code === 'DBE') {
          alert('서버가 불안정합니다.');
        }
      } else {
        alert('로그인에 실패하였습니다.');
      }
      router.push('/login');
    }
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
              <button className="sns-button" onClick={() => signIn('kakao')}>
                <img src="/img/kakao-sign-in.png" alt="Kakao Sign In" />
              </button>
              <button className="sns-button" onClick={() => signIn('naver')}>
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
