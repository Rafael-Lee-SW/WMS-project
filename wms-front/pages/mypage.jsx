import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { fetchBusiness, fetchUser } from './api';
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

  const [userId, setUserId] = useState();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [businessId, setBusinessId] = useState();
  const [roleTypeEnum, setRoleTypeEnum] = useState('');
  const [nickname, setNickname] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [createdDate, setCreatedDate] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (user && token) {
      setUserId(user.id); 
    }
  }, []);

  useEffect(() => {
    if (userId) {
      getUserInfo();
    }
  }, [userId]);

  useEffect(() => {
    if (businessId) {
      getBusinessInfo();
    }
  }, [businessId]);

  const getUserInfo = async () => {
    
    try {
      const Response = await fetchUser(userId);
      const { id, name, email, nickname, roleTypeEnum, businessId } = Response.data.result;
      
      setUserId(id);
      setName(name);
      setEmail(email);
      setBusinessId(businessId);
      setRoleTypeEnum(roleTypeEnum);
      setNickname(nickname);
      
    } catch (error) {
      router.push('/404');
    }
  }
  
  const getBusinessInfo = async () => {

    try {
      const Response = await fetchBusiness(businessId);
      const { name, businessNumber, createdDate } = Response.data.result;

      setBusinessName(name);
      setBusinessNumber(businessNumber);
      setCreatedDate(createdDate);

    } catch (error) {
      console.log(error)
      router.push('/404');
    }
  }

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
        return <Alarm businessId={businessId}/>;
      case 'edit':
        return <EditInfo userId={userId} name={name} email={email} nickname={nickname} businessId={businessId} businessName={businessName} businessNumber={businessNumber} roleTypeEnum={roleTypeEnum} onUpdateInfo={handleUpdateInfo}/>;
      case 'license':
        return <ManageBusiness businessId={businessId} businessName={businessName} businessNumber={businessNumber} onUpdateBusiness={handleUpdateBusiness}/>;
      case 'subscriptions':
        return <SubInfo businessId={businessId}/>;
      case 'employees':
        return <ManageEmployees businessId={businessId} onUpdateEmployees={handleUpdate}/>;
      case 'info':
        return <Info name={name} email={email} nickname={nickname} businessId={businessId} businessName={businessName} businessNumber={businessNumber} createdDate={createdDate} roleTypeEnum={roleTypeEnum}/>;
      default:
        return (
          <div>
            <Info name={name} email={email} nickname={nickname} businessId={businessId} businessName={businessName} businessNumber={businessNumber} createdDate={createdDate} roleTypeEnum={roleTypeEnum}/>
          </div>
        );
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.leftPanel}>
        {/* 왼쪽 패널의 내용 */}
        <div className={classes.titleContainer}>
          <h2 className={classes.h2} onClick={() => setSelectedComponent('info')}>마이페이지</h2>
        </div>
        <div className={classes.divContainer}>
          <h4 onClick={() => setSelectedComponent('alarm')}>알람</h4>
          <h4 onClick={() => setSelectedComponent('edit')}>내 정보 수정</h4>
          <h4 onClick={() => setSelectedComponent('license')}>사업자 등록/수정</h4>
          <h4 onClick={() => setSelectedComponent('employees')}>직원 관리</h4>
          <h4 onClick={() => setSelectedComponent('subscriptions')}>구독 정보</h4>
        </div>
      </div>
      <div className={classes.rightPanel}>

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
