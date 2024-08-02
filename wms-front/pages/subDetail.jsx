import { useRouter } from 'next/router';
import GridContainer from "/components/Grid/GridContainer.js";
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { Button } from '@material-ui/core';
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/detailStyle.js";

const useStyles = makeStyles(styles)

// button 의 파라미터로 멤버십 종류를 받아서 각각 다른 내용으로 랜더링
export default function SubDetail () {
  const router = useRouter();
  const classes = useStyles();
  const { plan } = router.query;

  // 제목 색깔 지정
  const headerColor = plan === 'basic' ? 'brown' :
                      plan === 'standard' ? 'green' :
                      plan === 'premium' ? 'purple' : 'black';

  // 대문자로 변환
  const title = plan === 'basic' ? 'BASIC' :
                plan === 'standard' ? 'STANDARD' :
                plan === 'premium' ? 'PREMIUM' : '-';
                
  // 멤버십 별 창고 개수 - 추후 수정
  const option1 = plan === 'basic' ? '1' :
                  plan === 'standard' ? '2' :
                  plan === 'premium' ? '3' : '-';

  return (
    <GridContainer className={classes.container}>
        <h1 style={{ color: headerColor }} className={classes.header}>{ title }</h1>
        <Divider className={classes.divider} />
        <h3>창고 { option1 }개</h3>
        <div className={classes.div}>
          {Array.from({ length: option1 }).map((_, index) => (
            <img 
              key={index}
              src="img/box.png" 
              alt="box"
              className={classes.box}
            />
          ))}
        </div>
        <Button>구독하기</Button>
    </GridContainer>
  )

};



