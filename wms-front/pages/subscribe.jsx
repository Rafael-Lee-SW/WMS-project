import React from 'react';
import Button from "@material-ui/core/Button";
import GridContainer from "/components/Grid/GridContainer.js";
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/subStyle.js";

const useStyles = makeStyles(styles)

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
