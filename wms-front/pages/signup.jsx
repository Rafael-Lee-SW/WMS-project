import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button, TextField, IconButton } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import GridContainer from '../components/Grid/GridContainer';
import GridItem from '../components/Grid/GridItem';
import Card from '../components/Card/Card';
import CardBody from '../components/Card/CardBody';
import { handleResponse, ResponseCode } from '../utils/responseHandler';

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
    justifyContent: 'center',
    marginBottom: '16px',
    '& button': {
      margin: '8px',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer'
    },
    '& img': {
      width: '50px',
      height: '50px',
    },
  },
  textField: {
    margin: '8px',
    minWidth: '100px',
    flex: 1,
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#7d4a1a', 
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#7d4a1a', 
    },
  },
  button: {
    margin: '8px',
    height: '56px',
  },
  buttonSmall: {
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
    margin: '0, 16px',
    fontSize: '18px'
  },
  title: {
    marginBottom: '32px',
  },
  backButton: {
    position: 'absolute',
    top: '16px',
    left: '16px',
  },
  signUpTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '20px'
  },
  form: {
    marginTop: '60px'
  },
  loginContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '10px'
  },
  loginText: {
    fontSize: '12px',
    margin: '0',
    padding: '0 5px'
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
  const [showEmailSignUp, setShowEmailSignUp] = useState(false);
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
          router.push('/signIn');
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
    window.location.href = 'https://i11a508.p.ssafy.io/api/oauth2.0/authorization/naver';
  };

  return (
    <GridContainer className={classes.container}>
      <GridItem xs={12} sm={6} md={4}>
        {showEmailSignUp ? ( 
          <Card className={classes.card}>
            <IconButton className={classes.backButton} onClick={() => setShowEmailSignUp(false)}>
              <ArrowBackIcon />
            </IconButton>
            <CardBody>
              <form onSubmit={handleSubmit} className={classes.form}>
                <div className={classes.signUpTitle}>
                  <img style={{ width: '20px', height: '20px', marginRight: '10px' }} src="/img/mailIconBk.png" alt="mailIcon"/>
                  <h4>이메일로 회원가입하기</h4>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                  <Button variant="contained" style={{ backgroundColor: "#7D4A1A", color: "white" }} onClick={handleEmailCheck} className={classes.button}>
                    이메일 인증
                  </Button>
                </div>
                <span style={{ color: isEmailValid ? 'blue' : 'red' }}>{emailCheckMessage}</span>
                <br />
                <br />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                    style={{
                      backgroundColor: isEmailValid ? "#7D4A1A" : "#c0c0c0",
                      color: "white",
                    }} 
                    onClick={handleSendCertificationEmail}
                    className={classes.button}
                    disabled={!isEmailValid}
                  >
                    인증 메일 발송
                  </Button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start'}}>
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: isEmailValid ? "#7D4A1A" : "#c0c0c0",
                      color: "white"
                    }} 
                    onClick={handleCertification}
                    className={classes.buttonSmall}
                    disabled={!isEmailValid}
                  >
                    인증 확인
                  </Button>
                </div>
                <span style={{ color: 'blue' }}>{certificationMessage}</span>
                {certificationButtonLabel === '인증 확인' && <span>{formatTime(timer)}</span>}
                <br />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingRight: '5px', paddingLeft: '5px' }}>
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
                  style={{
                    backgroundColor: isFormValid && isEmailValid ? "#7D4A1A" : "#c0c0c0",
                    color: "white",
                    marginTop: '20px'
                  }} 
                  disabled={!isFormValid || !isEmailValid}
                >
                  회원가입
                </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        ) : (
          <Card className={classes.card}>
            <div>
              <img src="/img/loginLogo.png" alt="Logo" className={classes.logo} onClick={() => router.push('/')} />
            </div>
            <CardBody>
              <div className={classes.dividerContainer}>
                <h3 variant="body1" className={classes.snsText}>
                  간편 회원가입
                </h3>
              </div>
              <div className={classes.snsButtons}>
                <button className="sns-button" onClick={handleKakaoSignIn}>
                  <img src="/img/kakao-sign-in.png" alt="Kakao Sign In" />
                </button>
                <button className="sns-button" onClick={handleNaverSignIn}>
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
                  onClick={() => setShowEmailSignUp(true)}
                >
                  <img style={{ width: '20px', height: '20px', marginRight: '10px' }} src="/img/mailIcon.png" alt="mailIcon"/>
                  이메일로 회원가입하기
              </Button>
              <div className={classes.loginContainer}>
                <p className={classes.loginText}>fit-box계정이 있으신가요?</p>
                <a className={classes.loginText} href="/login">로그인</a>
              </div>
              </CardBody>
            </Card>
          )}
      </GridItem>
    </GridContainer>
  );
}