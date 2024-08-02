import { Button, Input, makeStyles } from "@material-ui/core";
import { useState, useEffect } from "react";
import { editBusiness } from "../../pages/api";
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/editInfoStyle.js";
import { useRouter } from "next/router";

const useStyles = makeStyles(styles);

export default function EditInfo({ id, name, email, nickname, statusEnum, onUpdateInfo }) {
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
            <h3 className={classes.h3}>내 정보 수정</h3>
            <form onSubmit={handleSubmit} className={classes.form}>
                <label className={classes.label}>이름:</label>
                <Input
                    type="text"
                    name="name"
                    value={userInfo.name}
                    onChange={handleChange}
                    className={classes.input}
                    placeholder="이름"
                />
                <label className={classes.label}>이메일:</label>
                <Input
                    type="email"
                    name="email"
                    value={userInfo.email}
                    onChange={handleChange}
                    className={classes.input}
                    placeholder="ssafy@ssafy.com"
                />
                <label className={classes.label}>닉네임:</label>
                <Input
                    type="text"
                    name="nickname"
                    value={userInfo.nickname}
                    onChange={handleChange}
                    className={classes.input}
                    placeholder="오영팔"
                />
                <div className={classes.buttonContainer}>
                    <Button 
                        type="submit"
                        className={classes.button}
                    >저장</Button>
                </div>
            </form>
        </div>
    );
}
