import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import EditInfo from '../components/MyPage/EditInfo';
import RegisterBusiness from '../components/MyPage/ManageBusiness';
import ManageEmployees from '../components/MyPage/ManageEmployees';
import Info from '../components/MyPage/Info';
import Alarm from '../components/MyPage/Alarm';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    height: '100vh',
  },
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: theme.spacing(2),
    flex: '2', // 왼쪽 패널의 비율을 2로 설정합니다.
    backgroundColor: '#f0f0f0', 
  },
  rightPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '20px',
    flex: '8', // 오른쪽 패널의 비율을 8로 설정합니다.
    backgroundColor: '#ffffff',
    textAlign: 'center'
  },
}));

// 마이페이지
const MyPage = () => {
  const classes = useStyles();
  const [selectedComponent, setSelectedComponent] = useState('');

  // axios 로 회원정보 받아오는 코드 추가
  // 이메일, 비밀번호, 사업체명, 사업자번호 받아오기

  // 클릭 이벤트를 통해서 랜더링할 컴포넌트 지정
  const renderComponent = () => {
    switch (selectedComponent) {
      case 'alarm':
        return <Alarm />;
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
        <h4 onClick={() => setSelectedComponent('alarm')}>알람</h4>
        <h4 onClick={() => setSelectedComponent('edit')}>내 정보 수정</h4>
        <h4 onClick={() => setSelectedComponent('license')}>사업자 등록/수정</h4>
        <h4 onClick={() => setSelectedComponent('employees')}>직원 관리</h4>
      </div>
      <div className={classes.rightPanel}>
        {/* 오른쪽 패널의 내용 */}
        {renderComponent()}
      </div>
    </div>
  );
}

export default MyPage;

