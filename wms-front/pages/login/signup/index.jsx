import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { makeStyles, Button, TextField, Divider, Typography } from '@material-ui/core';
import GridContainer from '../../../components/Grid/GridContainer';
import GridItem from '../../../components/Grid/GridItem';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardBody from '../../../components/Card/CardBody';
import { handleResponse, ResponseCode } from '../../../utils/responseHandler';

const useStyles = makeStyles((theme) => ({
  // 스타일 정의
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

    return () => clearTimeout(timer);
  }, [password, passwordCheck]);

  const handleEmailCheck = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/oauth/email-check', { email });
      const { message, isSuccess } = handleResponse(response);
      setEmailCheckMessage(message);
      setIsEmailValid(isSuccess);

      if (isSuccess) {
        const certificationResponse = await axios.post('http://localhost:8080/api/oauth/email-certification', { email });
        const certificationResult = handleResponse(certificationResponse);

        if (certificationResult.isSuccess) {
          setCertificationMessage('인증번호 발송에 성공하였습니다.');
          setCertificationButtonLabel('인증 확인');
          startCountdown();
        } else {
          setCertificationMessage(certificationResult.message);
        }
      }
    } catch (error) {
      setEmailCheckMessage('네트워크 오류가 발생했습니다.');
      setIsEmailValid(false);
    }
  };

  const startCountdown = () => {
    let time = 180;
    const interval = setInterval(() => {
      if (time > 0) {
        time--;
        setCertificationMessage(`인증번호 발송에 성공하였습니다. ${time}초 남음.`);
      } else {
        clearInterval(interval);
        setCertificationButtonLabel('인증 메일 발송');
      }
    }, 1000);
  };

  const handleCertification = async () => {
    if (certificationButtonLabel === '인증 확인') {
      try {
        const response = await axios.post('http://localhost:8080/api/oauth/check-certification', {
          email,
          certificationNumber,
        });
        const { message, isSuccess } = handleResponse(response);
        setCertificationMessage(message);
      } catch (error) {
        setCertificationMessage('네트워크 오류가 발생했습니다.');
      }
    } else {
      handleEmailCheck();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid && isEmailValid) {
      try {
        const response = await axios.post('http://localhost:8080/api/oauth/sign-up', {
          email,
          password,
          certificationNumber,
          name,
          nickname,
        });
        const { message, isSuccess } = handleResponse(response);
        alert(message);

        if (isSuccess) {
          router.push('/login');
        }
      } catch (error) {
        alert('회원가입에 실패하였습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleKakaoSignIn = () => {
    window.location.href = 'http://localhost:8080/api/oauth2/code/kakao';
  };

  const handleNaverSignIn = () => {
    window.location.href = 'http://localhost:8080/api/oauth2/code/naver';
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
                  onClick={handleCertification}
                  className={classes.button}
                  disabled={!isEmailValid}
                >
                  {certificationButtonLabel}
                </Button>
              </div>
              <span style={{ color: 'blue' }}>{certificationMessage}</span>
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
