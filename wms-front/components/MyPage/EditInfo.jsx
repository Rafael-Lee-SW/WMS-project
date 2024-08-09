import { Button, Input, makeStyles } from "@material-ui/core";
import { useState, useEffect } from "react";
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/editInfoStyle.js";
import { useRouter } from "next/router";
import { editUser } from "../../pages/api";

const useStyles = makeStyles(styles);

export default function EditInfo({ userId, name, email, nickname, onUpdateInfo }) {
    const classes = useStyles();
    const router = useRouter();
    const [userInfo, setUserInfo] = useState({ userId, name, email, nickname });

    useEffect(() => {
        setUserInfo({ userId, name, email, nickname });
    }, [userId, name, email, nickname]);

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
                "name" : userInfo.name,
                "email" : userInfo.email,
                "nickname" : userInfo.nickname
            };
            await editUser(userInfo.userId, data);
            alert('회원정보 수정이 완료되었습니다.')
        } catch (error) {
            router.push('/404');
        }
    };

    return (
        <div>
            <h3 className={classes.h3}>내 정보 수정</h3>
            <div className={classes.container}>
                <table className={classes.table}>
                    <tbody>
                        <tr>
                            <td className={classes.labelCell}><strong className={classes.text}>이름</strong></td>
                            <td className={classes.valueCell}>
                                <Input
                                    type="text"
                                    name="name"
                                    value={userInfo.name}
                                    onChange={handleChange}
                                    className={classes.input}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className={classes.labelCell}><strong className={classes.text}>이메일</strong></td>
                            <td className={classes.valueCell}>
                                <Input
                                    type="email"
                                    name="email"
                                    value={userInfo.email}
                                    onChange={handleChange}
                                    className={classes.input}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className={classes.labelCell}><strong className={classes.text}>닉네임</strong></td>
                            <td className={classes.valueCell}>
                                <Input
                                    type="text"
                                    name="nickname"
                                    value={userInfo.nickname}
                                    onChange={handleChange}
                                    className={classes.input}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className={classes.buttonContainer}>
                    <Button 
                        type="submit"
                        className={classes.button}
                        onClick={handleSubmit}
                    >
                        저장
                    </Button>
                </div>
            </div>
        </div>
    );
}
