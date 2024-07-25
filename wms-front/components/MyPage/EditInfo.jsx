import { Button, Input, makeStyles } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react"

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center', 
    padding: "10px"
  },
  div: {
    padding: "10px"
  },
  button: {
    margin: "10px",
    backgroundColor: "lightgray",
    height: "30px"
  }
}))

// 개인정보수정
const EditInfo = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState({
        email: '',
        password: '',
    });
    const classes = useStyles();


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
    <div className={classes.container}>
      <h2>내 정보 수정</h2>
      <form onSubmit={handleSubmit}>
        <div className={classes.div}>
          <Input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleChange}
            placeholder="기존 이름"
          />
        </div>
        <div className={classes.div}>
          <Input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
            placeholder="기존 이메일"
          />
        </div>
        <div className={classes.div}>
          <Input
            type="text"
            name="phone"
            value={userInfo.phone}
            onChange={handleChange}
            placeholder="기존 연락처"
          />
        </div>
        <Button 
        type="submit"
        className={classes.button}
        >저장</Button>
      </form>
    </div>
  );
};

export default EditInfo;