import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import EditInfo from '../components/MyPage/EditInfo';
import RegisterBusiness from '../components/MyPage/ManageBusiness';
import ManageEmployees from '../components/MyPage/ManageEmployees';
import Info from '../components/MyPage/Info';

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

// 마이페이지
const MyPage = () => {
  const classes = useStyles();
  const [selectedComponent, setSelectedComponent] = useState('이소희님 반갑습니다.');

  // axios 로 회원정보 받아오는 코드 추가
  // 이메일, 비밀번호, 사업체명, 사업자번호 받아오기

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'edit':
        return <EditInfo/>;
      case 'license':
        return <RegisterBusiness/>;
      case 'employees':
        return <ManageEmployees/>;
      case 'info':
        return <Info/>
      default:
        return (
          <div>
            <h2>고객이름님, 반갑습니다.</h2>
            <Info/>
          </div>
        )
    }
  }
  return (
    <div className={classes.container}>
      <div className={classes.leftPanel}>
        {/* 왼쪽 패널의 내용 */}
        <h2 onClick={() => setSelectedComponent('info')}>마이페이지</h2>
        <p onClick={() => setSelectedComponent('edit')}>내 정보 수정</p>
        <p onClick={() => setSelectedComponent('license')}>사업자 등록/수정</p>
        <p onClick={() => setSelectedComponent('employees')}>직원 관리</p>
      </div>
      <div className={classes.rightPanel}>
        {/* 오른쪽 패널의 내용 */}
        {renderComponent()}
      </div>
    </div>
  );
}

export default MyPage;

