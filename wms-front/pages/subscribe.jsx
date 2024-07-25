import React from 'react';
import Button from "@material-ui/core/Button";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "@material-ui/core/Grid"; // 필요할 경우 GridItem 사용
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
    backgroundImage: "url('/img/subscribe.jpg')",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backgroundBlendMode: "overlay",
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

// 멤버십 선택 페이지
// button 의 파라미터로 멤버십 정보 전달
const Subscribe = () => {
  const classes = useStyles();

  return (
    <GridContainer className={classes.container}>
      <h2 className={classes.header}>ADN 멤버십</h2>
      <h3 className={classes.subheader}>재고관리의 혁신을 경험해보세요.</h3>
      <Divider className={classes.divider} />
      <Button href='/detail?plan=basic' style={{ color: "brown" }} variant="outlined" className={classes.button}>Basic</Button>
      <Button href='/detail?plan=standard' style={{ color: "green" }} variant="outlined" className={classes.button}>Standard</Button>
      <Button href='/detail?plan=premium' style={{ color: "purple" }} variant="outlined" className={classes.button}>Premium</Button>
    </GridContainer>
  );
}

export default Subscribe;
