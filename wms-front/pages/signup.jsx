import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
    },
    input_wrapper: {
        marginBottom: '16px',
    }
    
}))

// 회원가입 폼
export default function SignUp() {
    const classes = useStyles();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConformPassword] = useState('');
    const [message, setMessage] = useState('');

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('비밀번호가 다릅니다.');
            return;
        }
        try {
            const response = await axios.post('', { email, password});
            setMessage('회원가입이 완료되었습니다.');
            router.push('/login');
        } catch (error) {
            setMessage('회원가입이 처리되지 않았습니다.' + error.response.data);
        }
    };

    return (
        <Container onSubmit={handleSubmit} className={classes.container}>
            <h1>회원가입</h1>
            <div>
                <div className={classes.input_wrapper}>
                    <h3>이메일</h3>
                    <input placeholder="abcd@ssafy.com" type="text" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div className={classes.input_wrapper}>
                    <h3>비밀번호</h3>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <div className={classes.input_wrapper}>
                    <h3>비밀번호 확인</h3>
                    <input type="password" value={confirmPassword} onChange={(e) => setConformPassword(e.target.value)} required/>
                </div>
                <button type="submit">회원가입</button>
            </div>
            { message && <p>{message}</p>}
        </Container>
    )
}
