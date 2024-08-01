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
import { useRouter } from 'next/router';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';

const useStyles = makeStyles(styles);

export default function Mypage() {
  const classes = useStyles();
  const router = useRouter();
  const [selectedComponent, setSelectedComponent] = useState('');

  const [id, setId] = useState();
  const [userId, setUserId] = useState();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [statusEnum, setStatusEnum] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [nickname, setNickname] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const getBusinessInfo = async () => {
    try {
      const response = await fetchBusiness(1);
      const { id, userId, name, email, businessNumber, statusEnum, notificationDtoList, employeeDtoList, nickname, subscriptionDtoList } = response.data.result;
      
      setId(id);
      setUserId(userId);
      setName(name);
      setEmail(email);
      setBusinessNumber(businessNumber);
      setStatusEnum(statusEnum);
      setNotifications(notificationDtoList);
      setSubscriptions(subscriptionDtoList);
      setEmployees(employeeDtoList);
      setNickname(nickname);
      
    } catch (error) {
      router.push('404');
    }
  }

  useEffect(() => {
    getBusinessInfo();
  }, []);

  const handleUpdate = () => {
    getBusinessInfo();
  }

  const handleUpdateBusiness = (status) => {
    getBusinessInfo();
    setSelectedComponent('info');
    const message = ''
    if ( status === '수정' ) {
      message = '사업체 수정이 완료되었습니다.'
    } else if ( status === '등록' ) {
      message = '사업체 등록이 완료되었습니다.'
    } else {
      message = '사업체 삭제가 완료되었습니다.'
    };
    setModalMessage(message);
    setOpenModal(true);
  }

  const handleUpdateInfo = () => {
    getBusinessInfo();
    setSelectedComponent('info');
    setModalMessage('정보 수정이 완료되었습니다.');
    setOpenModal(true);
  }

  const handleCloseModal = () => {
    setOpenModal(false);
  }

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'alarm':
        return <Alarm notifications={notifications}/>;
      case 'edit':
        return <EditInfo id={id} name={name} email={email} nickname={nickname} statusEnum={statusEnum} onUpdateInfo={handleUpdateInfo}/>;
      case 'license':
        return <ManageBusiness id={id} userId={userId} name={name} businessNumber={businessNumber} statusEnum={statusEnum} onUpdateBusiness={handleUpdateBusiness}/>;
      case 'subscriptions':
        return <SubInfo subscriptions={subscriptions}/>;
      case 'employees':
        return <ManageEmployees employees={employees} onUpdateEmployees={handleUpdate}/>;
      case 'info':
        return <Info name={name} email={email} businessNumber={businessNumber} statusEnum={statusEnum}/>;
      default:
        return (
          <div>
            <Info name={name} email={email} businessNumber={businessNumber} />
          </div>
        );
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.leftPanel}>
        {/* 왼쪽 패널의 내용 */}
        <h2 className={classes.h2} onClick={() => setSelectedComponent('info')}>마이페이지</h2>
        <div className={classes.divContainer}>
          <h4 onClick={() => setSelectedComponent('alarm')}>알람</h4>
          <h4 onClick={() => setSelectedComponent('edit')}>내 정보 수정</h4>
          <h4 onClick={() => setSelectedComponent('license')}>사업자 등록/수정</h4>
          <h4 onClick={() => setSelectedComponent('employees')}>직원 관리</h4>
          <h4 onClick={() => setSelectedComponent('subscriptions')}>구독 정보</h4>
        </div>
      </div>
      <div className={classes.rightPanel}>
        <div className={classes.headerContainer}>
          <h3 className={classes.h3}>{name}</h3>
          <div className={classes.divHr}/>
        </div>
        {/* 오른쪽 패널의 내용 */}
        <div className={classes.rendering}>
          {renderComponent()}
        </div>
      </div>

      {/* 모달 컴포넌트 */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>정보 수정</DialogTitle>
        <DialogContent>
          <p>{modalMessage}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
