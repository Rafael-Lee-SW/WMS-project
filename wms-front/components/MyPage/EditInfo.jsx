import { Button, Input, makeStyles } from "@material-ui/core";
import { useState, useEffect } from "react"
import { editBusiness } from "../../pages/api";
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/editInfoStyle.js";
import { useRouter } from "next/router";

const useStyles = makeStyles(styles)

// 개인정보수정 Component
export default function EditInfo({id, name, email, nickname, statusEnum, onUpdateInfo }) {
    const classes = useStyles();
    const router = useRouter();
    
    const initialUserInfo = statusEnum !== 'DELETED' ? { name, email, nickname } : { name: '', email: '', nickname: '' };
    
    const [userInfo, setUserInfo] = useState(initialUserInfo);

    useEffect(() => {
        if (statusEnum !== 'DELETED') {
            setUserInfo({ name, email, nickname });
        } else {
            setUserInfo({ name: '', email: '', nickname: '' });
        }
    }, [name, email, nickname, statusEnum]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
              name: userInfo.name,
              email: userInfo.email,
              nickname: userInfo.nickname
            };
            await editBusiness(id, data);
            onUpdateInfo();
        } catch (error) {
            router.push('/404');
        }  
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
                        placeholder="이름"
                    />
                </div>
                <div className={classes.div}>
                    <Input
                        type="email"
                        name="email"
                        value={userInfo.email}
                        onChange={handleChange}
                        placeholder="이메일"
                    />
                </div>
                <div className={classes.div}>
                    <Input
                        type="text"
                        name="nickname"
                        value={userInfo.nickname}
                        onChange={handleChange}
                        placeholder="닉네임"
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
