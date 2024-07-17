import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Link from "next/link"

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    height: '100vh', // 전체 화면 높이에 따라 설정할 수 있습니다.
  },
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: theme.spacing(2),
    flex: '2', // 왼쪽 패널의 비율을 2로 설정합니다.
    backgroundColor: '#f0f0f0', // 예시로 배경색을 설정합니다.
  },
  rightPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '20px',
    flex: '8', // 오른쪽 패널의 비율을 8로 설정합니다.
    backgroundColor: '#ffffff', // 예시로 배경색을 설정합니다.
    textAlign: 'center'
  },
}));

const MyPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.leftPanel}>
        {/* 왼쪽 패널의 내용 */}
        <h2>마이페이지</h2>
        <Link href="/edit"><p>내 정보 수정</p></Link>
        <Link href="/license"><p>사업자 등록/수정</p></Link>
        <Link href="/employee"><p>직원 관리</p></Link>
      </div>
      <div className={classes.rightPanel}>
        {/* 오른쪽 패널의 내용 */}
        <h2>이소희님, 반갑습니다.</h2>
        <p>이 곳에 기존 개인 정보의 내용이 들어갑니다.</p>
      </div>
    </div>
  );
}

export default MyPage;