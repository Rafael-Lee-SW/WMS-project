import axios from "axios";
import { useEffect, useState } from "react"

// 개인정보수정
const EditInfo = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState({
        email: '',
        password: '',
    });

    // 기존 정보 받아오기

    // useEffect(() => {
    //     axios.get('').then(response => {
    //         const { email, password } = response.data;
    //         setUserInfo({ email, password });
    //         setLoading(false);
    //     })
    //     .catch(error => {
    //         setError(error);
    //         setLoading(false);
    //     });
    // }, []);

    // if (loading) return <div>Loading</div>;
    // if (error) return <div>Error: {error.message}</div>;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('', userInfo).then(response => {
            console.log('성공')
        }).catch(error => {
            console.log(error)
        });
    };

   return (
    <div>
      <h2>내 정보 수정</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이름:</label>
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>이메일:</label>
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>전화번호:</label>
          <input
            type="text"
            name="phone"
            value={userInfo.phone}
            onChange={handleChange}
          />
        </div>
        <button type="submit">저장</button>
      </form>
    </div>
  );
};

export default EditInfo;