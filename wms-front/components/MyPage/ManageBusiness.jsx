import { Button, Input, makeStyles } from "@material-ui/core";
import { useState, useEffect } from "react";
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/manageBusinessStyle.js";
import { useRouter } from "next/router";
import axios from 'axios';

const useStyles = makeStyles(styles);

export default function ManageBusiness() {
  const classes = useStyles();
  const router = useRouter();

  const [businessInfo, setBusinessInfo] = useState({ name: '', businessNumber: '' });
  const [roleType, setRoleType] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessId, setBusinessId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const userId = storedUser ? storedUser.id : null;

        if (userId) {
          const response = await axios.get(`https://i11a508.p.ssafy.io/api/users/${userId}`);
          const userData = response.data.result;

          setRoleType(userData.roleTypeEnum);
          setBusinessId(userData.businessId);

          if (userData.roleTypeEnum === 'BUSINESS') {
            // BUSINESS role이면 비즈니스 정보를 가져옴
            const businessResponse = await axios.get(`https://i11a508.p.ssafy.io/api/businesses/${userData.businessId}`);
            const businessData = businessResponse.data.result;
            setBusinessInfo({
              name: businessData.name,
              businessNumber: businessData.businessNumber
            });
          } else if (userData.roleTypeEnum === 'EMPLOYEE') {
            // EMPLOYEE role이면 사업체명을 가져옴
            const businessResponse = await axios.get(`https://i11a508.p.ssafy.io/api/businesses/${userData.businessId}`);
            setBusinessName(businessResponse.data.result.name);
          }
        } else {
          alert("로그인이 필요합니다.");
          router.push('/signin');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("데이터를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchUserData();
  }, [router]);

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

      if (roleType === 'BUSINESS') {
        // BUSINESS 역할로 수정 로직
        await axios.put(`https://i11a508.p.ssafy.io/api/businesses/${businessId}`, data);
        alert("사업체 정보가 수정되었습니다.");
      } else if (roleType === 'GENERAL') {
        // GENERAL 역할로 등록 로직
        const storedUser = JSON.parse(localStorage.getItem('user')); // 유저 정보를 다시 가져오기
        const userId = storedUser ? storedUser.id : null; // 유저 ID 가져오기

        if (userId) {
          // axios로 POST 요청 보내기
          await axios.post(`http://localhost:8080/api/businesses?userId=${userId}`, data);
          alert("사업체가 등록되었습니다.");
        } else {
          console.error("User ID is missing");
        }
      } else {
        alert("등록할 수 없는 상태입니다.");
      }
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    try {
      // 사업체 비활성화 로직
      await axios.patch(`http://localhost:8080/api/businesses/${businessId}`, { statusEnum: "INACTIVE" });
      alert("사업체가 삭제되었습니다.");
      router.push('/');
    } catch (error) {
      console.error(error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleLeave = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user')); // 유저 정보를 다시 가져오기
      const userId = storedUser ? storedUser.id : null; // 유저 ID 가져오기

      if (userId) {
        const data = {
          name: storedUser.name,
          nickname: storedUser.nickname,
          roleTypeEnum: "EMPLOYEE",
          businessId: -1
        };

        const response = await axios.put(`https://i11a508.p.ssafy.io/api/users/${userId}`, data);

        if (response.data.success) {
          alert("사업장 탈퇴가 완료되었습니다.");
          router.push('/');
        }
      }
    } catch (error) {
      console.error("Error leaving business:", error);
      alert("탈퇴 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={classes.container}>
      {roleType === 'GENERAL' && (
        <div>
          <h2>사업자 등록</h2>
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
              등록
            </Button>
          </form>
        </div>
      )}
      {roleType === 'EMPLOYEE' && (
        <div>
          <h2>현재 소속된 창고</h2>
          <p>사업체명: {businessName}</p>
          <Button onClick={handleLeave} className={classes.button}>
            탈퇴하기
          </Button>
        </div>
      )}
      {roleType === 'BUSINESS' && (
        <div>
          <h2>사업자 수정</h2>
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
              수정
            </Button>
            <Button onClick={handleDelete} className={classes.button}>
              삭제
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
