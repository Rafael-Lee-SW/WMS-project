import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { makeStyles, Button, TextField, Divider, Typography } from '@material-ui/core';
import GridContainer from '../../../../components/Grid/GridContainer';
import GridItem from '../../../../components/Grid/GridItem';
import Card from '../../../../components/Card/Card';
import CardHeader from '../../../../components/Card/CardHeader';
import CardBody from '../../../../components/Card/CardBody';

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
    flex: 1,
  },
  button: {
    margin: theme.spacing(1),
    height: '56px', // TextField의 높이에 맞춤
  },
  buttonSmall: {
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

export default function SignUp() {
  const classes = useStyles();
  const router = useRouter();

  const idRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordCheckRef = useRef(null);
  const emailRef = useRef(null);
  const certificationNumberRef = useRef(null);
  const nameRef = useRef(null);
  const nicknameRef = useRef(null);

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [email, setEmail] = useState('');
  const [certificationNumber, setCertificationNumber] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailCheckMessage, setEmailCheckMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [showPasswordMessage, setShowPasswordMessage] = useState(false);

  useEffect(() => {
    const validatePassword = (password) => {
      const lengthCheck1 = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(password);
      const lengthCheck2 = /^(?=.*[a-zA-Z])(?=.*\d|.*[!@#$%^&*])[\w!@#$%^&*]{10,}$/.test(password);

      return lengthCheck1 || lengthCheck2;
    };

    const timer = setTimeout(() => {
      if (password) {
        const isValidPassword = validatePassword(password);
        const isPasswordMatch = password === passwordCheck;

        if (isValidPassword && isPasswordMatch) {
          setPasswordMessage('비밀번호가 유효합니다.');
        } else if (!isValidPassword) {
          setPasswordMessage('비밀번호는 영문, 숫자, 특수문자 중 2종류 이상을 조합하여 최소 10자리 이상 또는 3종류 이상을 조합하여 최소 8자리 이상이어야 합니다.');
        } else if (!isPasswordMatch) {
          setPasswordMessage('비밀번호가 일치하지 않습니다.');
        }

        setShowPasswordMessage(true);
        setIsFormValid(isValidPassword && isPasswordMatch);
      } else {
        setShowPasswordMessage(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [password, passwordCheck]);

  const handleEmailCheck = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/email-check', { id: email });
      if (response.status === 200 && response.data.code === 'SU') {
        setIsEmailValid(true);
        setEmailCheckMessage('사용 가능한 이메일입니다.');

        // 인증 번호 요청
        const certificationResponse = await axios.post('http://localhost:8080/api/v1/auth/email-certification', { email });
        if (certificationResponse.status === 200 && certificationResponse.data.code === 'SU') {
          setEmailCheckMessage('이메일 인증 번호가 전송되었습니다.');
        }
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          if (error.response.data.code === 'VF') {
            setEmailCheckMessage('유효성 검사 실패');
          } else if (error.response.data.code === 'DI') {
            setEmailCheckMessage('중복된 이메일입니다.');
          }
        } else if (error.response.status === 500) {
          setEmailCheckMessage('서버 오류입니다.');
        }
      } else {
        setEmailCheckMessage('네트워크 오류가 발생했습니다.');
      }
      setIsEmailValid(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid && isEmailValid) {
      try {
        const response = await axios.post('http://localhost:8080/api/v1/auth/sign-up', {
          email,
          password,
          certificationNumber,
          name,
          nickname
        });
        if (response.status === 200 && response.data.code === 'SU') {
          alert('회원가입이 완료되었습니다. 로그인 후 이용해주세요.');
          router.push('/login');
        } else {
          alert('회원가입에 실패하였습니다. 다시 시도해주세요.');
        }
      } catch (error) {
        alert('회원가입에 실패하였습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <GridContainer className={classes.container}>
    
      <GridItem xs={12} sm={8} md={6}>
        <Card>
      
          <CardHeader>
            <img
              src="/img/logo.png"
              alt="Logo"
              className={classes.logo}
              onClick={() => router.push('/')}
            />
             <h2>FitBox</h2>
          </CardHeader>
          <CardBody>
            <div className={classes.dividerContainer}>
              <div className={classes.divider} />
              <Typography variant="body1" className={classes.snsText}>
                SNS 회원가입
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
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
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
                <Button variant="contained" color="primary" onClick={handleEmailCheck} className={classes.button}>
                  이메일 인증
                </Button>
              </div>
              <span style={{ color: isEmailValid ? 'blue' : 'red' }}>{emailCheckMessage}</span><br /><br />
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  label="인증번호"
                  type="text"
                  variant="outlined"
                  fullWidth
                  className={classes.textField}
                  value={certificationNumber}
                  onChange={(e) => setCertificationNumber(e.target.value)}
                  required
                />
                <Button variant="contained" color="primary" onClick={() => alert('인증 확인')} className={classes.button}>
                  인증 확인
                </Button>
              </div>
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
              <TextField
                label="비밀번호 확인"
                type="password"
                variant="outlined"
                fullWidth
                className={classes.textField}
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
                required
              />
              {showPasswordMessage && (
                <span style={{ color: passwordMessage.includes('유효합니다') ? 'blue' : 'red' }}>{passwordMessage}</span>
              )}<br /><br />
              <TextField
                label="이름"
                type="text"
                variant="outlined"
                fullWidth
                className={classes.textField}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextField
                label="닉네임"
                type="text"
                variant="outlined"
                fullWidth
                className={classes.textField}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />
              <Button type="submit" variant="contained" color="primary" className={classes.buttonSmall} disabled={!isFormValid || !isEmailValid}>
                회원가입
              </Button>
            </form>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
