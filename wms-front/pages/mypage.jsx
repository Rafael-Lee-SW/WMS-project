import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { fetchBusiness } from './api';
import EditInfo from '../components/MyPage/EditInfo';
import SubInfo from '../components/MyPage/SubInfo';
import ManageBusiness from '../components/MyPage/ManageBusiness';
import ManageEmployees from '../components/MyPage/ManageEmployees';
import Info from '../components/MyPage/Info';
import Alarm from '../components/MyPage/Alarm';
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/mypageStyle.js";

const useStyles = makeStyles(styles)

// 마이페이지
const MyPage = () => {
  const classes = useStyles();
  const [selectedComponent, setSelectedComponent] = useState('');

  const [id, setId] = useState();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [subscription, setSubscription] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const getBusinessInfo = async () => {
      try {
        // 추후 아이디 받아와서 아래 1자리에 넣어야함
        const response = await fetchBusiness(1);
        const { id, name, email, businessNumber, notificationDtoList, employeeDtoList, nickname, subscriptionDtoList } = response.data.result;
        
        setId(id);
        setName(name);
        setEmail(email);
        setBusinessNumber(businessNumber);
        setNotifications(notificationDtoList);
        setSubscription(subscriptionDtoList);
        setEmployees(employeeDtoList);
        setNickname(nickname);
        
      } catch (error) {
        console.log(error)
      }
    }
    getBusinessInfo();
}, [])

  // 클릭 이벤트를 통해서 랜더링할 컴포넌트 지정
  // 본 페이지에서 필요한 모든 정보를 받아서 각 컴포넌트로 props 로 전달
  const renderComponent = () => {
    switch (selectedComponent) {
      case 'alarm':
        return <Alarm notifications={notifications}/>;
      case 'edit':
        return <EditInfo id={id} name={name} email={email} nickname={nickname}/>;
      case 'license':
        return <ManageBusiness id={id} name={name} businessNumber={businessNumber}/>;
      case 'subscription':
        return <SubInfo subscription={subscription}/>
      case 'employees':
        return <ManageEmployees employees={employees}/>;
      case 'info':
        return <Info name={name} email={email} businessNumber={businessNumber}/>
      default:
        return (
          <div>
            <h2>{name}님, 반갑습니다.</h2>
            <Info name={name} email={email} businessNumber={businessNumber} />
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
        <h4 onClick={() => setSelectedComponent('subscription')}>구독 정보</h4>
      </div>
      <div className={classes.rightPanel}>
        {/* 오른쪽 패널의 내용 */}
        {renderComponent()}
      </div>
    </div>
  );
}

export default MyPage;

