import { Button, Input, makeStyles } from "@material-ui/core";
import { useState, useEffect } from "react";
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/manageBusinessStyle.js";
import { useRouter } from "next/router";
import axios from 'axios';

const useStyles = makeStyles(styles);

// 사업자 관리 Component
export default function ManageBusiness() {
  const classes = useStyles();
  const router = useRouter();

  const [businessInfo, setBusinessInfo] = useState({ name: '', businessNumber: '' });
  const [isRegistered, setIsRegistered] = useState(false);
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

          if (userData.roleTypeEnum === 'BUSINESS' && userData.businessId !== -1) {
            const businessResponse = await axios.get(`https://i11a508.p.ssafy.io/api/businesses/${userData.businessId}`);
            const businessData = businessResponse.data.result;
            setBusinessInfo({
              name: businessData.name,
              businessNumber: businessData.businessNumber
            });
            setIsRegistered(true);
          } else if (userData.roleTypeEnum === 'EMPLOYEE' && userData.businessId !== -1) {
            const businessResponse = await axios.get(`https://i11a508.p.ssafy.io/api/businesses/${userData.businessId}`);
            setBusinessName(businessResponse.data.result.name);
          }
        } else {
          alert("로그인이 필요합니다.");
          router.push('/signIn');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("데이터를 불러오는 중 오류가 발생했습니다.");
        router.push('/404');
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
        id: businessId,
        name: businessInfo.name,
        businessNumber: businessInfo.businessNumber,
        statusEnum: "ACTIVE"
      };

      if (isRegistered) {
        // 수정 로직
        await axios.put(`https://i11a508.p.ssafy.io/api/businesses/${businessId}`, data);
        alert("사업체 정보가 수정되었습니다.");
      } else {
        // 등록 로직
        const storedUser = JSON.parse(localStorage.getItem('user')); // 유저 정보를 다시 가져오기
        const userId = storedUser ? storedUser.id : null; // 유저 ID 가져오기

        if (userId) {
          // axios로 POST 요청 보내기
          const businessResponse = await axios.post(`https://i11a508.p.ssafy.io/api/businesses?userId=${userId}`, data);
          alert("사업체가 등록되었습니다.");

          // 새로 생성된 businessId 가져오기
          const newBusinessId = businessResponse.data.result.id; 

          // 구독 등록 요청
          const subscriptionData = {
            businessId: newBusinessId,
            paidTypeEnum: "KAKAOPAY", // 기본값 설정
            statusEnum: "ACTIVE", // 기본값 설정
            warehouseCount: 1, // 기본값 설정
          };

          await axios.post("https://i11a508.p.ssafy.io/api/subscriptions", subscriptionData);
          alert("창고 1개를 무료 등록 할 수 있습니다.");
          router.push('/user/select');
        } else {
          console.error("User ID is missing");
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);
      router.push('/404');
    }
  };

  const handleDelete = async () => {
    try {
      // 사업체 비활성화 로직
      await axios.patch(`https://i11a508.p.ssafy.io/api/businesses/${businessId}`, { statusEnum: "INACTIVE" });
      alert("사업체가 삭제되었습니다.");
      router.push('/');
    } catch (error) {
      console.error(error);
      router.push('/404');
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
