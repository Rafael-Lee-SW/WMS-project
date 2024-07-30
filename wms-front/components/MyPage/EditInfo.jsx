import { Button, Input, makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react"
import { editBusiness } from "../../pages/api";
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/editInfoStyle.js";

const useStyles = makeStyles(styles)

// 개인정보수정
export default function EditInfo({id, name, email, nickname}) {
    const classes = useStyles();
    const [userInfo, setUserInfo] = useState({ name, email, nickname });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        useEffect(() => {
          const changeBusiness = async () => {
            try {
              const data = {
                "name" : userInfo.name,
                "email" : userInfo.email,
                "nickname" : userInfo.nickname
              }
              editBusiness(id, data)
            } catch (error) {
              console.log(error)
            }
          }
          changeBusiness();
      }, [])};

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
          />
        </div>
        <div className={classes.div}>
          <Input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
          />
        </div>
        <div className={classes.div}>
          <Input
            type="text"
            name="nickname"
            value={userInfo.nickname}
            onChange={handleChange}
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
