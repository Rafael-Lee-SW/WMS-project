import { Button, Input, makeStyles } from "@material-ui/core";
import { useState, useEffect } from "react";
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/manageBusinessStyle.js";
import { createBusiness, deleteBusiness, editBusiness } from "../../pages/api";
import { useRouter } from "next/router";
import axios from 'axios';

const useStyles = makeStyles(styles);

// 사업자 관리 Component
export default function ManageBusiness({ id, userId, name, businessNumber, statusEnum, onUpdateBusiness }) {
  const classes = useStyles();
  const router = useRouter();

  const [businessInfo, setBusinessInfo] = useState({ name: '', businessNumber: '' });
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    // 클라이언트 측에서만 실행
    const storedUser = JSON.parse(localStorage.getItem('user')); // 로컬 스토리지에서 사용자 정보 파싱
    const businessId = storedUser ? storedUser.businessId : -1; // 사용자 정보에서 businessId 가져오기

    // businessId에 따라 상태 설정
    if (businessId !== -1) {
      setBusinessInfo({
        name: name || '',
        businessNumber: businessNumber || '',
      });
      setIsRegistered(true);
    } else {
      setBusinessInfo({
        name: '',
        businessNumber: ''
      });
      setIsRegistered(false);
    }
  }, [name, businessNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusinessInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: businessInfo.name,
        businessNumber: businessInfo.businessNumber
      };
      if (isRegistered) {
        // 수정 로직
        await editBusiness(id, data);
      } else {
        // 등록 로직
        const storedUser = JSON.parse(localStorage.getItem('user')); // 유저 정보를 다시 가져오기
        const userId = storedUser ? storedUser.id : null; // 유저 ID 가져오기

        if (userId) {
          // axios로 POST 요청 보내기
          await axios.post(`http://localhost:8080/api/businesses?userId=${userId}`, data);
          onUpdateBusiness('등록');
        } else {
          console.error("User ID is missing");
        }
      }
    } catch (error) {
      console.error(error);
      router.push('/404');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBusiness(id);
      setBusinessInfo({ name: '', businessNumber: '' });
      setIsRegistered(false);
      onUpdateBusiness('삭제');
    } catch (error) {
      console.error(error);
      router.push('/404');
    }
  };

  return (
    <div className={classes.container}>
      <h2>사업자 {isRegistered ? '수정' : '등록'}</h2> {/* 상태에 따라 제목 변경 */}
      <form onSubmit={handleSubmit}>
        <div className={classes.div}>
          <Input
            type="text"
            name="name"
            value={businessInfo.name || ''}
            onChange={handleChange}
            placeholder="사업자 이름"
            required
          />
        </div>
        <div className={classes.div}>
          <Input
            type="text"
            name="businessNumber"
            value={businessInfo.businessNumber || ''}
            onChange={handleChange}
            placeholder="사업자 번호"
            required
          />
        </div>
        <Button 
          type="submit"
          className={classes.button}
        >
          {isRegistered ? '수정' : '등록'}
        </Button>
        {isRegistered && (
        <Button onClick={handleDelete} className={classes.button}>
          삭제
        </Button>
      )}
      </form>
    </div>
  );
};
