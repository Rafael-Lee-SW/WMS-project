import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { makeStyles, Button, TextField, Divider, Typography } from '@material-ui/core';
import GridContainer from '../components/Grid/GridContainer';
import GridItem from '../components/Grid/GridItem';
import Card from '../components/Card/Card';
import CardHeader from '../components/Card/CardHeader';
import CardBody from '../components/Card/CardBody';
import { handleResponse, ResponseCode } from '../utils/responseHandler';

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
    flex: 1,
  },
  button: {
    margin: theme.spacing(1),
    height: '56px',
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

  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [email, setEmail] = useState('');
  const [certificationNumber, setCertificationNumber] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [emailCheckMessage, setEmailCheckMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [showPasswordMessage, setShowPasswordMessage] = useState(false);
  const [certificationButtonLabel, setCertificationButtonLabel] = useState('인증 메일 발송');
  const [certificationMessage, setCertificationMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [timer, setTimer] = useState(180);

  useEffect(() => {
    const validatePassword = (password) => {
      const lengthCheck1 = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(password);
      const lengthCheck2 = /^(?=.*[a-zA-Z])(?=.*\d|.*[!@#$%^&*])[\w!@#$%^&*]{10,}$/.test(password);

      return lengthCheck1 || lengthCheck2;
    };

    const timerId = setTimeout(() => {
      if (password) {
        const isValidPassword = validatePassword(password);
        const isPasswordMatch = password === passwordCheck;

        if (isValidPassword && isPasswordMatch) {
          setPasswordMessage('비밀번호가 유효합니다.');
        } else if (!isValidPassword) {
          setPasswordMessage(
            '비밀번호는 영문, 숫자, 특수문자 중 2종류 이상을 조합하여 최소 10자리 이상 또는 3종류 이상을 조합하여 최소 8자리 이상이어야 합니다.'
          );
        } else if (!isPasswordMatch) {
          setPasswordMessage('비밀번호가 일치하지 않습니다.');
        }

        setShowPasswordMessage(true);
        setIsFormValid(isValidPassword && isPasswordMatch);
      } else {
        setShowPasswordMessage(false);
      }
    }, 1000);

    return () => clearTimeout(timerId);
  }, [password, passwordCheck]);

  useEffect(() => {
    if (timer > 0 && certificationButtonLabel === '인증 확인') {
      const intervalId = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [timer, certificationButtonLabel]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleEmailCheck = async () => {
    try {
      const response = await axios.post('https://i11a508.p.ssafy.io/api/oauth/email-check', { email });
      const { message, isSuccess } = handleResponse(response);
      setEmailCheckMessage(isSuccess ? '사용 가능한 이메일입니다.' : message);
      setIsEmailValid(isSuccess);
    } catch (error) {
      setEmailCheckMessage('중복된 이메일입니다.');
      setIsEmailValid(false);
    }
  };

  const handleSendCertificationEmail = async () => {
    if (isEmailValid) {
      try {
        const certificationResponse = await axios.post('https://i11a508.p.ssafy.io/api/oauth/email-certification', { email });
        const certificationResult = handleResponse(certificationResponse);

        if (certificationResult.isSuccess) {
          setCertificationMessage('인증번호 발송에 성공하였습니다.');
          setCertificationButtonLabel('인증 확인');
          setTimer(180); // Reset timer to 3 minutes
        } else {
          setCertificationMessage(certificationResult.message);
        }
      } catch (error) {
        setCertificationMessage('네트워크 오류가 발생했습니다.');
      }
    } else {
      setCertificationMessage('이메일을 먼저 인증해 주세요.');
    }
  };

  const handleCertification = async () => {
    if (certificationButtonLabel === '인증 확인') {
      try {
        const response = await axios.post('https://i11a508.p.ssafy.io/api/oauth/check-certification', {
          email,
          certificationNumber,
        });
        const { code } = response.data;

        if (code === 'SU') {
          setCertificationMessage('인증번호가 일치합니다.');
        } else {
          setCertificationMessage('인증번호가 일치하지 않습니다.');
        }
      } catch (error) {
        setCertificationMessage('네트워크 오류가 발생했습니다.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid && isEmailValid) {
      try {
        const response = await axios.post('https://i11a508.p.ssafy.io/api/oauth/sign-up', {
          email,
          password,
          certificationNumber,
          name,
          nickname,
        });
        const { message, isSuccess } = handleResponse(response);

        alert(isSuccess ? '회원가입이 완료되었습니다. 로그인 후 이용해주세요.' : message);

        if (isSuccess) {
          router.push('/login');
        }
      } catch (error) {
        alert('회원가입에 실패하였습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleKakaoSignIn = () => {
    window.location.href = 'https://i11a508.p.ssafy.io/api/oauth2/authorization/kakao';
  };

  const handleNaverSignIn = () => {
    window.location.href = 'https://i11a508.p.ssafy.io/api/oauth2/authorization/naver';
  };

  return (
    <GridContainer className={classes.container}>
      <GridItem xs={12} sm={8} md={6}>
        <Card>
          <CardHeader>
            <img src="/img/logo.png" alt="Logo" className={classes.logo} onClick={() => router.push('/')} />
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
              <button className="sns-button" onClick={handleKakaoSignIn}>
                <img src="/img/kakao-sign-in.png" alt="Kakao Sign In" />
              </button>
              <button className="sns-button" onClick={handleNaverSignIn}>
                <img src="/img/naver-sign-in.png" alt="Naver Sign In" />
              </button>
            </div>
            <Divider className={classes.divider} />
            <br />
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
              <span style={{ color: isEmailValid ? 'blue' : 'red' }}>{emailCheckMessage}</span>
              <br />
              <br />
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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendCertificationEmail}
                  className={classes.button}
                  disabled={!isEmailValid}
                >
                  인증 메일 발송
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCertification}
                  className={classes.button}
                  disabled={!isEmailValid}
                >
                  인증 확인
                </Button>
              </div>
              <span style={{ color: 'blue' }}>{certificationMessage}</span>
              {certificationButtonLabel === '인증 확인' && <span>{formatTime(timer)}</span>}
              <br />
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
                <span style={{ color: passwordMessage.includes('유효합니다') ? 'blue' : 'red' }}>
                  {passwordMessage}
                </span>
              )}
              <br />
              <br />
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
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.buttonSmall}
                disabled={!isFormValid || !isEmailValid}
              >
                회원가입
              </Button>
            </form>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
