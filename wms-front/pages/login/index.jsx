import React from 'react';
import Button from "@material-ui/core/Button";
import GridContainer from "/components/Grid/GridContainer.js";
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center', // 텍스트 중앙 정렬
  },
  header: {
    marginBottom: theme.spacing(2),
  },
  subheader: {
    marginBottom: theme.spacing(2),
  },
  divider: {
    width: '60%',
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(1),
    width: '300px',
    height: '50px',
    color: '#000',
    borderColor: '#000',
    backgroundColor: '#fff',
  },
}));

const Login = () => {
  const classes = useStyles();

  return (
    <GridContainer className={classes.container}>
      <h2 className={classes.header}>로그인</h2>
      <h3 className={classes.subheader}>로그인 옵션을 선택해주세요.</h3>
      <Divider className={classes.divider} />
      <Button href='/login/president' style={{ color: "brown" }} variant="outlined" className={classes.button}>사장으로 로그인하기</Button>
      <Button href='/login/employee' style={{ color: "green" }} variant="outlined" className={classes.button}>직원으로 로그인하기</Button>
    </GridContainer>
  );
}

export default Login;