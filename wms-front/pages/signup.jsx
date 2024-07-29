import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Input, makeStyles } from "@material-ui/core";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Card from "/components/Card/Card.js";
import CardHeader from "/components/Card/CardHeader.js";
import CardBody from "/components/Card/CardBody.js";
import Button from "/components/CustomButtons/Button.js";

import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/signupStyle.js";

const useStyles = makeStyles(styles);

export default function SignUp() {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConformPassword] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('비밀번호가 다릅니다.');
            return message;
        }
        try {
            const response = await axios.post('', { email, password });
            setMessage('회원가입이 완료되었습니다.');
            router.push('/login');
        } catch (error) {
            setMessage('회원가입이 처리되지 않았습니다.' + error.response.data);
            return message;
        }
    };

    return (
        <div className={classes.section} onSubmit={handleSubmit}>
            <h2 className={classes.h2}>환영합니다!</h2>
            <h3 className={classes.p}>회원가입 후 ADN의 서비스를 이용해보세요.</h3>
            <div className={classes.container}>
                <GridContainer justify="center">
                    <GridItem xs={12} sm={6} md={4}>
                        <Card>
                            <form className={classes.form}>
                                <CardHeader className={classes.cardHeader}>
                                    <h4>회원가입</h4>
                                </CardHeader>
                                <CardBody className={classes.cardBody}>
                                    <Input
                                        fullWidth
                                        className={classes.input}
                                        type="text"
                                        placeholder='아이디'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    >
                                    </Input>
                                    <Input
                                        fullWidth
                                        className={classes.input}
                                        type="password"
                                        placeholder='비밀번호'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    >
                                    </Input>
                                    <Input
                                        fullWidth
                                        className={classes.input}
                                        type="password"
                                        placeholder='비밀번호확인'
                                        value={confirmPassword}
                                        onChange={(e) => setConformPassword(e.target.value)}
                                    >
                                    </Input>
                                    <Button
                                        fullWidth
                                        type="submit"
                                    >
                                        회원가입
                                    </Button>
                                </CardBody>
                            </form>
                        </Card>
                    </GridItem>
                </GridContainer>
            </div>
        </div>
    )
}

