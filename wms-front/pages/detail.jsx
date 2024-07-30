import { useRouter } from 'next/router';
import GridContainer from "/components/Grid/GridContainer.js";
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { Button } from '@material-ui/core';

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
  div: {
    padding: "20px"
  },
  box: {
    padding: "10px",
    width: "100px",
    height: "100px",
  },
}));


// button 의 파라미터로 멤버십 종류를 받아서 각각 다른 내용으로 랜더링
const MembershipDetail = () => {
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

export default MembershipDetail;


