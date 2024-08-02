import { makeStyles } from "@material-ui/core";
import { useState, useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center', 
    padding: "10px"
  },
  
}))
// 회원정보랜더링
export default function Info() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState({
        email: '',
        businessName: '',
        businessNumber: '',
        startDate: '',
    });
    const classes = useStyles();

//     useEffect(() => {
//     // API 호출하여 사용자 정보 가져오기
//     axios.get('/api/user-info')
//       .then(response => {
//         const { email, businessName, businessNumber, createdAt } = response.data;
//         setUserInfo({ email, businessName, businessNumber, createdAt });
//         setLoading(false);
//       })
//       .catch(error => {
//         setError(error);
//         setLoading(false);
//       });
//   }, []);
    
    // if (loading) return <div>Loading</div>;
    // if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h3>기본 정보</h3>
            <div className={classes.container}>
                <h4><strong>이메일: {userInfo.email}</strong></h4>
                <h4><strong>사업자 명: {userInfo.businessName}</strong></h4>
                <h4><strong>사업자 번호: {userInfo.businessNumber}</strong></h4>
                <h4><strong>구독시작일: {userInfo.startDate}</strong></h4>
            </div>
        </div>
    )
}